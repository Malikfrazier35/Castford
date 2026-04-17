import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const sb = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const ALLOWED_ORIGINS = [
  'https://castford.com',
  'https://www.castford.com',
  'https://castford.vercel.app',
  'http://localhost:3000',
]

function cors(req: Request) {
  const origin = req.headers.get('origin') || ''
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey',
    'Content-Type': 'application/json',
  }
}

Deno.serve(async (req) => {
  const headers = cors(req)
  if (req.method === 'OPTIONS') return new Response('ok', { headers })

  const url = new URL(req.url)
  const slug = url.searchParams.get('slug')
  const category = url.searchParams.get('category')
  const search = url.searchParams.get('q')
  const action = url.searchParams.get('action') // 'helpful_yes' or 'helpful_no'

  try {
    // POST: Track helpful votes or views
    if (req.method === 'POST' && slug) {
      if (action === 'helpful_yes') {
        await sb.rpc('increment_field', { table_name: 'knowledge_articles', field_name: 'helpful_yes', row_slug: slug }).catch(() => {})
        // Fallback: direct update
        await sb.from('knowledge_articles').update({ helpful_yes: sb.raw('helpful_yes + 1') }).eq('slug', slug).catch(() => {})
        const { data } = await sb.from('knowledge_articles').select('helpful_yes').eq('slug', slug).single()
        if (data) {
          await sb.from('knowledge_articles').update({ helpful_yes: (data.helpful_yes || 0) + 1 }).eq('slug', slug)
        }
        return new Response(JSON.stringify({ status: 'ok' }), { headers })
      }
      if (action === 'helpful_no') {
        const { data } = await sb.from('knowledge_articles').select('helpful_no').eq('slug', slug).single()
        if (data) {
          await sb.from('knowledge_articles').update({ helpful_no: (data.helpful_no || 0) + 1 }).eq('slug', slug)
        }
        return new Response(JSON.stringify({ status: 'ok' }), { headers })
      }
      if (action === 'view') {
        const { data } = await sb.from('knowledge_articles').select('views').eq('slug', slug).single()
        if (data) {
          await sb.from('knowledge_articles').update({ views: (data.views || 0) + 1 }).eq('slug', slug)
        }
        return new Response(JSON.stringify({ status: 'ok' }), { headers })
      }
    }

    // GET: Fetch articles
    if (slug) {
      // Single article by slug
      const { data, error } = await sb.from('knowledge_articles')
        .select('*').eq('slug', slug).eq('published', true).single()
      if (error || !data) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers })
      return new Response(JSON.stringify(data), { headers })
    }

    // List articles with optional filters
    let query = sb.from('knowledge_articles').select('slug, title, category, pain_point, solution_summary, castford_feature, difficulty, time_to_implement, tags, views, helpful_yes, helpful_no, created_at')
      .eq('published', true).order('created_at', { ascending: false })

    if (category) query = query.eq('category', category)
    if (search) query = query.or(`title.ilike.%${search}%,pain_point.ilike.%${search}%,tags.cs.{${search}}`)

    const { data, error } = await query
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers })

    return new Response(JSON.stringify({ articles: data, total: data?.length || 0 }), { headers })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Internal error' }), { status: 500, headers })
  }
})
