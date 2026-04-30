/* Castford Copilot UI Wiring
   Connects the copilot input/button on dashboard pages to the copilot edge function.
   Requires: auth-guard.js loaded (provides window.__fos_supabase) */

(function(){
  'use strict';
  var API = 'https://crecesswagluelvkesul.supabase.co/functions/v1/copilot';
  var conversationId = null;
  var history = [];

  var input = document.querySelector('.copilot-input input');
  var btn = document.querySelector('.copilot-input button');
  var body = document.querySelector('.copilot-body');
  if (!input || !btn || !body) return;

  function addMsg(role, text, typewriter) {
    var div = document.createElement('div');
    div.className = 'copilot-msg ' + role;
    var bubble = document.createElement('div');
    bubble.className = 'copilot-bubble';
    div.appendChild(bubble);
    body.appendChild(div);

    if (role === 'ai' && typewriter !== false) {
      // Typewriter: 20ms per character
      var formatted = text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/- /g, '&bull; ');
      var chars = formatted.split('');
      var i = 0;
      bubble.innerHTML = '<span class="copilot-cursor" style="display:inline-block;width:2px;height:14px;background:var(--blue,#5B7FCC);animation:blink .8s infinite;vertical-align:text-bottom"></span>';
      var interval = setInterval(function() {
        if (i >= chars.length) { clearInterval(interval); bubble.innerHTML = formatted; body.scrollTop = body.scrollHeight; return; }
        // Insert before cursor
        var cursor = bubble.querySelector('.copilot-cursor');
        if (cursor) cursor.insertAdjacentHTML('beforebegin', chars[i]);
        else bubble.innerHTML += chars[i];
        i++;
        if (i % 8 === 0) body.scrollTop = body.scrollHeight;
      }, 18);
    } else {
      bubble.innerHTML = text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/- /g, '&bull; ');
    }
    body.scrollTop = body.scrollHeight;
  }

  function addLoading() {
    var div = document.createElement('div');
    div.className = 'copilot-msg ai';
    div.id = 'copilot-loading';
    div.innerHTML = '<div class="copilot-bubble" style="opacity:0.6">Thinking...</div>';
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  function removeLoading() {
    var el = document.getElementById('copilot-loading');
    if (el) el.remove();
  }

  async function send() {
    var query = input.value.trim();
    if (!query) return;

    input.value = '';
    addMsg('user', query);
    addLoading();
    btn.disabled = true;

    try {
      var sb = window.__fos_supabase;
      if (!sb) { removeLoading(); addMsg('ai', 'Authentication required. Please refresh the page.'); btn.disabled = false; return; }
      var session = window.__fos_session || (await sb.auth.getSession()).data?.session;
      if (!session) { removeLoading(); addMsg('ai', 'Please sign in to use the copilot.'); btn.disabled = false; return; }

      var res = await fetch(API, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + session.access_token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query, history: history.slice(-6), conversation_id: conversationId, context: 'dashboard' }),
      });

      var data = await res.json();
      removeLoading();

      if (data.error) {
        // v54 returns { error, detail, anthropic_status, anthropic_error_type, model_attempted, diag, first_attempt_error }
        var msg = data.error;
        if (data.detail) msg += '\n\n' + data.detail;
        var meta = [];
        if (data.model_attempted) meta.push('Model: ' + data.model_attempted);
        if (data.anthropic_status) meta.push('HTTP ' + data.anthropic_status);
        if (data.anthropic_error_type) meta.push(data.anthropic_error_type);
        if (data.diag && data.diag.key_prefix) meta.push('Key: ' + data.diag.key_prefix + '… (' + data.diag.key_length + ' chars)');
        if (data.diag && data.diag.fallback_used) meta.push('fallback used');
        if (meta.length) msg += '\n\n[' + meta.join(' · ') + ']';
        if (data.first_attempt_error) msg += '\n\nFirst attempt: ' + data.first_attempt_error;
        addMsg('ai', msg);
      } else {
        var reply = data.text || data.response || 'No response';
        if (data.fallback_used && data.first_attempt_error) {
          reply += '\n\n[Note: ran on ' + (data.model_label || data.model || 'fallback') + ' after primary failed — ' + data.first_attempt_error.substring(0, 80) + ']';
        }
        addMsg('ai', reply);
        history.push({ role: 'user', content: query });
        history.push({ role: 'assistant', content: data.text || data.response || '' });
        if (data.conversation_id) conversationId = data.conversation_id;
      }
    } catch (e) {
      removeLoading();
      addMsg('ai', 'Connection error. Please try again.');
    }
    btn.disabled = false;
    input.focus();
  }

  btn.addEventListener('click', send);
  input.addEventListener('keydown', function(e) { if (e.key === 'Enter') send(); });

  // Clear static example messages
  var existing = body.querySelectorAll('.copilot-msg');
  if (existing.length > 0 && existing[0].querySelector('.copilot-bubble')?.textContent.includes('Why did COGS')) {
    body.innerHTML = '<div class="copilot-msg ai"><div class="copilot-bubble">Hi! I\'m your FP&A copilot. Ask me about your financials — revenue trends, budget variances, expense breakdowns, or forecasts. I have access to your live GL data.</div></div>';
  }
})();
