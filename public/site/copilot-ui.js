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

  function addMsg(role, text) {
    var div = document.createElement('div');
    div.className = 'copilot-msg ' + role;
    var bubble = document.createElement('div');
    bubble.className = 'copilot-bubble';
    bubble.innerHTML = text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/- /g, '&bull; ');
    div.appendChild(bubble);
    body.appendChild(div);
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
        addMsg('ai', 'Error: ' + data.error);
      } else {
        addMsg('ai', data.text || data.response || 'No response');
        history.push({ role: 'user', content: query });
        history.push({ role: 'assistant', content: data.text || '' });
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
