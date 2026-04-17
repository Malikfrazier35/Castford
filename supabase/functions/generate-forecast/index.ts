import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
const AO = ['https://castford.com','https://www.castford.com','https://castford.vercel.app','http://localhost:3000']
function cors(req: Request) { const o=req.headers.get('origin')||''; return { 'Access-Control-Allow-Origin':AO.includes(o)?o:AO[0], 'Access-Control-Allow-Methods':'POST, OPTIONS', 'Access-Control-Allow-Headers':'Content-Type, Authorization, apikey', 'Content-Type':'application/json' }; }

function linearForecast(d: number[], p: number): number[] { const n=d.length; if(n<2)return Array(p).fill(d[0]||0); let sX=0,sY=0,sXY=0,sX2=0; for(let i=0;i<n;i++){sX+=i;sY+=d[i];sXY+=i*d[i];sX2+=i*i;} const m=(n*sXY-sX*sY)/(n*sX2-sX*sX); const b=(sY-m*sX)/n; return Array.from({length:p},(_,i)=>Math.round(m*(n+i)+b)); }
function emaForecast(d: number[], p: number, span=3): number[] { if(d.length<2)return Array(p).fill(d[0]||0); const k=2/(span+1); let ema=d[0]; for(let i=1;i<d.length;i++)ema=d[i]*k+ema*(1-k); const dd=d.length>=2?d[d.length-1]-d[d.length-2]:0; const damp=dd*0.5; return Array.from({length:p},()=>{ema+=damp;return Math.round(ema);}); }
function monteCarloForecast(d:number[],p:number,sims=1000):{p10:number[],p50:number[],p90:number[],mean:number[]}{ if(d.length<3){const f=Array(p).fill(d[d.length-1]||0);return{p10:f,p50:f,p90:f,mean:f};} const rets:number[]=[]; for(let i=1;i<d.length;i++){const prev=d[i-1]||1;rets.push((d[i]-prev)/Math.abs(prev));} const mr=rets.reduce((a,b)=>a+b,0)/rets.length; const v=rets.reduce((a,r)=>a+(r-mr)**2,0)/rets.length; const sd=Math.sqrt(v); const sr:number[][]=[];for(let s=0;s<sims;s++){const path:number[]=[];let c=d[d.length-1];for(let q=0;q<p;q++){const u1=Math.random();const u2=Math.random();const z=Math.sqrt(-2*Math.log(u1))*Math.cos(2*Math.PI*u2);c=c*(1+mr+sd*z);path.push(Math.round(c));}sr.push(path);} const p10:number[]=[],p50:number[]=[],p90:number[]=[],mean:number[]=[]; for(let q=0;q<p;q++){const vals=sr.map(s=>s[q]).sort((a,b)=>a-b);p10.push(vals[Math.floor(sims*0.1)]);p50.push(vals[Math.floor(sims*0.5)]);p90.push(vals[Math.floor(sims*0.9)]);mean.push(Math.round(vals.reduce((a,b)=>a+b,0)/sims));} return{p10,p50,p90,mean}; }
function backtest(d:number[],h=3):{linear_mape:number,ema_mape:number,monte_carlo_mape:number}{ if(d.length<=h+2)return{linear_mape:0,ema_mape:0,monte_carlo_mape:0}; const tr=d.slice(0,-h);const act=d.slice(-h); const lp=linearForecast(tr,h);const ep=emaForecast(tr,h);const mp=monteCarloForecast(tr,h,500).p50; function mape(pred:number[],a:number[]):number{let s=0,c=0;for(let i=0;i<a.length;i++){if(a[i]!==0){s+=Math.abs((a[i]-pred[i])/a[i]);c++;}}return c>0?Math.round(s/c*1000)/10:0;} return{linear_mape:mape(lp,act),ema_mape:mape(ep,act),monte_carlo_mape:mape(mp,act)}; }

async function runForecast(orgId: string, userId: string|null, body: any): Promise<any> {
  const fp = body.periods || 6; const at = body.account_type || 'revenue'; const model = body.model || 'all';
  let q = sb.from('gl_transactions').select('amount, period, gl_accounts!inner(account_type)').eq('org_id', orgId);
  if (at !== 'all') q = q.eq('gl_accounts.account_type', at);
  const { data: txns } = await q.order('period');
  if (!txns?.length) return { error: 'No transaction data', forecast: null };
  const byP: Record<string,number> = {}; txns.forEach((t:any)=>{const p=t.period||'';if(p)byP[p]=(byP[p]||0)+Math.abs(Number(t.amount)||0);}); const sp=Object.keys(byP).sort(); const ts=sp.map(p=>byP[p]);
  const lp=sp[sp.length-1]; const [ly,lm]=lp.split('-').map(Number); const fP:string[]=[]; for(let i=1;i<=fp;i++){const m=((lm-1+i)%12)+1;const y=ly+Math.floor((lm-1+i)/12);fP.push(`${y}-${String(m).padStart(2,'0')}`)}
  const r:any={historical:sp.map((p,i)=>({period:p,actual:Math.round(ts[i])})),forecast_periods:fP,account_type:at,data_points:ts.length};
  if(model==='linear'||model==='all')r.linear=fP.map((p,i)=>({period:p,predicted:linearForecast(ts,fp)[i]}));
  if(model==='ema'||model==='all')r.ema=fP.map((p,i)=>({period:p,predicted:emaForecast(ts,fp)[i]}));
  if(model==='monte_carlo'||model==='all'){const mc=monteCarloForecast(ts,fp);r.monte_carlo=fP.map((p,i)=>({period:p,p10:mc.p10[i],p50:mc.p50[i],p90:mc.p90[i],mean:mc.mean[i]}));}
  if(ts.length>=5){r.backtest=backtest(ts,Math.min(3,Math.floor(ts.length/3)));const bt=r.backtest;const ms={linear:bt.linear_mape,ema:bt.ema_mape,monte_carlo:bt.monte_carlo_mape};const best=Object.entries(ms).sort((a,b)=>(a[1]as number)-(b[1]as number))[0];r.recommended_model=best[0];r.recommended_mape=best[1];}
  // Log usage — wrapped in try/catch (Supabase client insert doesn't have .catch())
  try { if(userId) await sb.from('usage_events').insert({org_id:orgId,user_id:userId,event_type:'scenario_run',tokens_used:0,metadata:{model,account_type:at,periods:fp},reported_to_stripe:false}); } catch {}
  try { await sb.from('audit_log').insert({user_id:userId,org_id:orgId,action:'forecast.generated',resource_type:'forecast',metadata:{model,account_type:at,periods:fp,recommended:r.recommended_model,trigger:userId?'user':'cron'}}); } catch {}
  return r;
}

Deno.serve(async (req: Request) => {
  const headers = cors(req); if(req.method==='OPTIONS')return new Response('ok',{headers}); if(req.method!=='POST')return new Response(JSON.stringify({error:'POST only'}),{status:405,headers});
  const authHeader=req.headers.get('Authorization'); const cronSecret=req.headers.get('x-cron-secret'); const expectedSecret=Deno.env.get('CRON_SECRET')||'';
  if(cronSecret&&expectedSecret&&cronSecret===expectedSecret){const body=await req.json().catch(()=>({}));const{data:orgs}=await sb.from('organizations').select('id');const results:any[]=[];for(const org of(orgs||[])){try{const f=await runForecast(org.id,null,body);if(f&&!f.error)results.push({org_id:org.id,status:'ok',data_points:f.data_points,recommended:f.recommended_model});else results.push({org_id:org.id,status:'no_data'});}catch(e:any){results.push({org_id:org.id,status:'error',error:e.message});}} return new Response(JSON.stringify({mode:'cron',orgs_processed:results.length,results}),{headers});}
  if(!authHeader?.startsWith('Bearer '))return new Response(JSON.stringify({error:'Unauthorized'}),{status:401,headers}); const{data:{user},error:ae}=await sb.auth.getUser(authHeader.replace('Bearer ','')); if(ae||!user)return new Response(JSON.stringify({error:'Invalid token'}),{status:401,headers}); const{data:profile}=await sb.from('users').select('org_id').eq('id',user.id).maybeSingle(); if(!profile?.org_id)return new Response(JSON.stringify({error:'No org'}),{status:404,headers});
  try{const body=await req.json();const r=await runForecast(profile.org_id,user.id,body);return new Response(JSON.stringify(r),{status:200,headers});}catch(err:any){return new Response(JSON.stringify({error:err?.message||'Failed'}),{status:500,headers});}
});
