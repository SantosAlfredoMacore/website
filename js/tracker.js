/**
 * tracker.js - Registo de visitas e ações (painel admin)
 * Não interfere com o envio dos formulários.
 */
(function () {
  'use strict';

  var VISITS_KEY = 'cm_site_visits';
  var ACTIVITY_KEY = 'cm_site_activity';
  var ORCAMENTOS_KEY = 'cm_site_orcamentos';
  var CONTACTOS_KEY = 'cm_site_contactos';

  function safeParse(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      var v = JSON.parse(raw);
      return v != null ? v : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function safeSave(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  function logActivity(user, action, detail, meta) {
    var list = safeParse(ACTIVITY_KEY, []);
    if (!Array.isArray(list)) list = [];
    list.unshift({
      id: Date.now() + '-' + Math.random().toString(36).slice(2, 7),
      ts: new Date().toISOString(),
      user: user || 'visitante',
      action: action || 'event',
      detail: detail || '',
      meta: meta || {},
      page: (location.pathname.split('/').pop() || 'index.html')
    });
    if (list.length > 500) list.length = 500;
    safeSave(ACTIVITY_KEY, list);
  }

  function recordVisit() {
    try {
      var page = location.pathname.split('/').pop() || 'index.html';
      if (page.indexOf('admin') !== -1 || page === 'login.html') return;

      var visits = safeParse(VISITS_KEY, []);
      if (!Array.isArray(visits)) visits = [];

      var sessionId = sessionStorage.getItem('cm_visit_session');
      if (!sessionId) {
        sessionId = 's-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
        sessionStorage.setItem('cm_visit_session', sessionId);
      }

      // Evita duplicar a mesma página na mesma sessão em < 3s
      var last = visits[0];
      if (last && last.sessionId === sessionId && last.page === page) {
        var diff = Date.now() - new Date(last.ts).getTime();
        if (diff < 3000) return;
      }

      visits.unshift({
        id: Date.now() + '-' + Math.random().toString(36).slice(2, 6),
        ts: new Date().toISOString(),
        page: page,
        sessionId: sessionId,
        referrer: document.referrer || '',
        ua: (navigator.userAgent || '').slice(0, 120),
        w: window.innerWidth || 0
      });
      if (visits.length > 1000) visits.length = 1000;
      safeSave(VISITS_KEY, visits);
      logActivity('visitante', 'page_view', 'Visitou ' + page, { page: page, w: window.innerWidth });
    } catch (e) {}
  }

  function formToObject(form) {
    var data = {};
    try {
      var fd = new FormData(form);
      fd.forEach(function (v, k) {
        if (data[k] !== undefined) {
          if (!Array.isArray(data[k])) data[k] = [data[k]];
          data[k].push(v);
        } else {
          data[k] = v;
        }
      });
    } catch (e) {}
    return data;
  }

  function saveOrcamento(data) {
    var list = safeParse(ORCAMENTOS_KEY, []);
    if (!Array.isArray(list)) list = [];
    list.unshift({
      id: String(Date.now()),
      ts: new Date().toISOString(),
      status: 'novo',
      nome: data.nome || '',
      empresa: data.empresa || '',
      email: data.email || '',
      telefone: data.telefone || '',
      servico: data.servico || '',
      urgencia: data.urgencia || '',
      utilizadores: data.utilizadores || '',
      localizacao: data.localizacao || '',
      desafios: data.desafios || '',
      raw: data
    });
    safeSave(ORCAMENTOS_KEY, list);
    logActivity(data.email || data.nome || 'visitante', 'orcamento', 'Pedido de orçamento: ' + (data.servico || ''), data);
  }

  function saveContacto(data) {
    var list = safeParse(CONTACTOS_KEY, []);
    if (!Array.isArray(list)) list = [];
    list.unshift({
      id: String(Date.now()),
      ts: new Date().toISOString(),
      status: 'novo',
      nome: data.nome || data.name || '',
      email: data.email || '',
      telefone: data.telefone || data.phone || '',
      mensagem: data.mensagem || data.message || data.msg || '',
      raw: data
    });
    safeSave(CONTACTOS_KEY, list);
    logActivity(data.email || data.nome || 'visitante', 'contacto', 'Mensagem de contacto', data);
  }

  function bindForms() {
    // Orçamento multi-step
    var multi = document.getElementById('multiStepForm');
    if (multi && !multi.dataset.cmTracked) {
      multi.dataset.cmTracked = '1';
      multi.addEventListener('submit', function () {
        saveOrcamento(formToObject(multi));
      }, true);
    }

    // Outros formulários com email + textarea
    var forms = document.querySelectorAll('form');
    for (var i = 0; i < forms.length; i++) {
      var form = forms[i];
      if (form.id === 'multiStepForm' || form.dataset.cmTracked) continue;
      var hasEmail = form.querySelector('input[type="email"]');
      var hasText = form.querySelector('textarea');
      if (hasEmail && hasText) {
        form.dataset.cmTracked = '1';
        form.addEventListener('submit', function (ev) {
          saveContacto(formToObject(ev.target));
        }, true);
      }
    }
  }

  function init() {
    recordVisit();
    bindForms();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.cmTracker = {
    logActivity: logActivity,
    saveOrcamento: saveOrcamento,
    saveContacto: saveContacto,
    recordVisit: recordVisit
  };
})();
