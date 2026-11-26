/**
 * main.js - Interações do site CONNECTION MOZAMBIQUE
 */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  function isMobile() {
    return window.matchMedia && window.matchMedia('(max-width: 991.98px)').matches;
  }

  /** Dropdowns + menu mobile */
  function initNav() {
    var menu = document.getElementById('navMenu');
    var toggles = document.querySelectorAll('.sn-header .dropdown-toggle');

    // Mobile: impedir navegação no toggle; Bootstrap trata do open/close
    toggles.forEach(function (toggle) {
      toggle.addEventListener('click', function (e) {
        if (isMobile()) {
          e.preventDefault();
        }
      });
    });

    // Ao abrir offcanvas no mobile, configurar dropdowns como static
    if (menu && window.bootstrap) {
      menu.addEventListener('shown.bs.offcanvas', function () {
        toggles.forEach(function (toggle) {
          try {
            var inst = bootstrap.Dropdown.getInstance(toggle);
            if (inst) inst.dispose();
            bootstrap.Dropdown.getOrCreateInstance(toggle, {
              display: 'static',
              autoClose: 'outside',
              popperConfig: null
            });
          } catch (err) {}
        });
      });

      menu.addEventListener('hidden.bs.offcanvas', function () {
        toggles.forEach(function (toggle) {
          try {
            var inst = bootstrap.Dropdown.getInstance(toggle);
            if (inst) inst.dispose();
            // Volta ao comportamento normal no desktop
            bootstrap.Dropdown.getOrCreateInstance(toggle);
          } catch (err) {}
        });
      });
    }

    // Fechar offcanvas ao clicar num link (não no toggle)
    var links = document.querySelectorAll('#navMenu .dropdown-item, #navMenu a.nav-link:not(.dropdown-toggle), #navMenu .btn');
    links.forEach(function (link) {
      link.addEventListener('click', function () {
        if (!menu || !window.bootstrap || !isMobile()) return;
        var oc = bootstrap.Offcanvas.getInstance(menu);
        if (oc) oc.hide();
      });
    });
  }

  function initMultiStepForm() {
    var form = document.getElementById('multiStepForm');
    if (!form) return;

    var steps = Array.prototype.slice.call(form.querySelectorAll('.form-step'));
    var progress = document.getElementById('formProgress');
    var progressWrap = progress ? progress.parentElement : null;
    var indicators = Array.prototype.slice.call(document.querySelectorAll('[data-indicator]'));
    var total = steps.length;
    var current = 1;

    function getStep(n) {
      for (var i = 0; i < steps.length; i++) {
        if (Number(steps[i].getAttribute('data-step')) === n) return steps[i];
      }
      return null;
    }

    function showStep(n, focus) {
      current = Math.min(Math.max(n, 1), total);
      steps.forEach(function (s) {
        var active = Number(s.getAttribute('data-step')) === current;
        s.classList.toggle('d-none', !active);
        s.setAttribute('aria-hidden', active ? 'false' : 'true');
      });
      var pct = Math.round((current / total) * 100);
      if (progress) progress.style.width = pct + '%';
      if (progressWrap) progressWrap.setAttribute('aria-valuenow', String(pct));
      indicators.forEach(function (ind) {
        var k = Number(ind.getAttribute('data-indicator'));
        ind.classList.toggle('active', k === current);
        ind.classList.toggle('completed', k < current);
        var num = ind.querySelector('.step-number');
        if (num) num.textContent = k < current ? '✓' : String(k);
      });
      if (current === total) buildSummary();
    }

    function validateStep(n) {
      var step = getStep(n);
      if (!step) return false;
      var first = null;
      var inputs = step.querySelectorAll('input,select,textarea');
      for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        input.classList.remove('is-invalid');
        if (!input.checkValidity()) {
          input.classList.add('is-invalid');
          if (!first) first = input;
        } else if (String(input.value || '').trim() !== '') {
          input.classList.add('is-valid');
        }
      }
      if (first) {
        if (first.reportValidity) first.reportValidity();
        first.focus();
        return false;
      }
      return true;
    }

    function valueOf(input) {
      if (input.tagName === 'SELECT') {
        var opt = input.selectedOptions && input.selectedOptions[0];
        return opt ? String(opt.textContent || '').trim() || '—' : '—';
      }
      if (input.type === 'checkbox') return input.checked ? 'Sim' : 'Não';
      return String(input.value || '').trim() || '—';
    }

    function buildSummary() {
      var box = document.getElementById('resumo');
      if (!box) return;
      while (box.firstChild) box.removeChild(box.firstChild);
      var h = document.createElement('h3');
      h.className = 'h6 fw-bold mb-2';
      h.textContent = 'Reveja os dados antes de enviar';
      box.appendChild(h);
      var fields = form.querySelectorAll('input[name],select[name],textarea[name]');
      for (var i = 0; i < fields.length; i++) {
        var input = fields[i];
        if (input.name === 'consentimento' || input.type === 'hidden') continue;
        var row = document.createElement('div');
        row.className = 'sn-summary-row d-flex justify-content-between py-1 border-bottom';
        var lab = document.createElement('span');
        lab.className = 'text-muted';
        lab.textContent = input.name;
        var val = document.createElement('span');
        val.className = 'fw-semibold text-end';
        val.textContent = valueOf(input);
        row.appendChild(lab);
        row.appendChild(val);
        box.appendChild(row);
      }
    }

    form.addEventListener('click', function (e) {
      var t = e.target;
      if (!t) return;
      if (t.matches('[data-next], .btn-next') || (t.closest && t.closest('[data-next], .btn-next'))) {
        e.preventDefault();
        if (validateStep(current)) showStep(current + 1);
      }
      if (t.matches('[data-prev], .btn-prev') || (t.closest && t.closest('[data-prev], .btn-prev'))) {
        e.preventDefault();
        showStep(current - 1);
      }
    });

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      if (!validateStep(current)) return;

      var consent = form.querySelector('[name="consentimento"]');

      if (consent && !consent.checked) {
        consent.classList.add('is-invalid');
        if (consent.reportValidity) consent.reportValidity();
        return;
      }

      var notice = form.querySelector('.cm-form-notice');

      if (!notice) {
        notice = document.createElement('div');
        notice.className = 'alert mt-3 cm-form-notice';
        form.insertBefore(notice, form.firstChild);
      }

      var submitButton = form.querySelector('button[type="submit"]');

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'A enviar pedido...';
      }

      notice.className = 'alert alert-info mt-3 cm-form-notice';
      notice.textContent = 'Estamos a enviar o seu pedido. Aguarde, por favor.';

      try {
        var dados = {};

        new FormData(form).forEach(function (value, key) {
          dados[key] = value;
        });

        dados._subject = 'Novo pedido de orçamento - CONNECTION MOZAMBIQUE';
        dados._template = 'table';
        dados._replyto = dados.email || '';
        dados._url = window.location.href;

        var resposta = await fetch(
          'https://formsubmit.co/ajax/admin@connectionmozambique.com',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(dados)
          }
        );

        var resultado = await resposta.json();

        if (!resposta.ok || String(resultado.success).toLowerCase() !== 'true') {
          throw new Error(resultado.message || 'O serviço não confirmou o envio.');
        }

        notice.className = 'alert alert-success mt-3 cm-form-notice';
        notice.textContent = 'Pedido enviado com sucesso! A equipa da CONNECTION MOZAMBIQUE irá analisar os dados e entrar em contacto consigo.';

        if (submitButton) {
          submitButton.textContent = 'Pedido enviado';
        }

      } catch (erro) {
        console.error('Erro no envio do orçamento:', erro);

        notice.className = 'alert alert-danger mt-3 cm-form-notice';
        notice.textContent = 'Não foi possível confirmar o envio do pedido. ' +
          (erro.message || 'Verifique a sua ligação à Internet e tente novamente.');

        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = 'Tentar novamente';
        }
      }
    });
    showStep(1, false);
  }

  function initContactForm() {
    document.querySelectorAll('form').forEach(function (form) {
      if (form.id === 'multiStepForm') return;
      if (!form.querySelector('input[type="email"]') || !form.querySelector('textarea')) return;

      form.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (form.reportValidity && !form.reportValidity()) return;

        var botao = form.querySelector('button[type="submit"]');
        var msg = form.querySelector('[data-form-message]');

        if (!msg) {
          msg = document.createElement('div');
          msg.setAttribute('data-form-message', 'true');
          msg.className = 'alert mt-3';
          form.appendChild(msg);
        }

        if (botao) {
          botao.disabled = true;
          botao.textContent = 'A enviar mensagem...';
        }

        msg.className = 'alert alert-info mt-3';
        msg.textContent = 'A enviar a sua mensagem. Aguarde, por favor.';

        try {
          var dados = {};

          new FormData(form).forEach(function (valor, chave) {
            dados[chave] = valor;
          });

          dados._subject = 'Nova mensagem - CONNECTION MOZAMBIQUE';
          dados._template = 'table';
          dados._replyto = dados.email || '';
          dados._url = window.location.href;

          var resposta = await fetch(
            'https://formsubmit.co/ajax/admin@connectionmozambique.com',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify(dados)
            }
          );

          var resultado = await resposta.json();

          if (!resposta.ok || String(resultado.success).toLowerCase() !== 'true') {
            throw new Error(resultado.message || 'O serviço não confirmou o envio.');
          }

          msg.className = 'alert alert-success mt-3';
          msg.textContent = 'Mensagem enviada com sucesso! A equipa da CONNECTION MOZAMBIQUE entrará em contacto consigo.';

          form.reset();

          if (botao) {
            botao.textContent = 'Mensagem enviada';
          }

        } catch (erro) {
          console.error('Erro no envio da mensagem:', erro);

          msg.className = 'alert alert-danger mt-3';
          msg.textContent = 'Não foi possível enviar a mensagem. ' +
            (erro.message || 'Verifique a ligação e tente novamente.');

          if (botao) {
            botao.disabled = false;
            botao.textContent = 'Tentar novamente';
          }
        }
      });
    });
  }

  function initScrollReveal() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var els = document.querySelectorAll('.sn-card, .sn-section-title');
    if (!els.length || !('IntersectionObserver' in window)) return;
    var ob = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          ob.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) {
      el.classList.add('sn-reveal');
      ob.observe(el);
    });
  }

  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length || !('IntersectionObserver' in window)) return;
    var ob = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var target = parseInt(el.getAttribute('data-count'), 10);
        if (!isFinite(target)) return;
        var value = 0;
        var inc = Math.max(1, Math.ceil(target / 40));
        var timer = setInterval(function () {
          value = Math.min(value + inc, target);
          try { el.textContent = value.toLocaleString('pt-MZ'); }
          catch (err) { el.textContent = String(value); }
          if (value >= target) clearInterval(timer);
        }, 28);
        ob.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { ob.observe(el); });
  }

  ready(function () {
    try { initNav(); } catch (e) { console.warn('nav', e); }
    try { initMultiStepForm(); } catch (e) { console.warn('form', e); }
    try { initContactForm(); } catch (e) { console.warn('contact', e); }
    try { initScrollReveal(); } catch (e) { console.warn('reveal', e); }
    try { initCounters(); } catch (e) { console.warn('counters', e); }
  });
})();





