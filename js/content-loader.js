/**
 * content-loader.js - Aplica conteúdo dinâmico do localStorage no site
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'cm_site_content';

  function loadContent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function setText(el, text) {
    if (el && text != null && String(text).length) el.textContent = text;
  }

  function setImg(img, src, alt) {
    if (!img || !src) return;
    img.src = src;
    if (alt) img.alt = alt;
    img.onerror = function () { this.src = './public/logo.png'; };
  }

  function applyHero(data) {
    if (!data || !data.textos) return;
    setText(document.querySelector('.sn-hero-title'), data.textos.heroTitle);
    setText(document.querySelector('.sn-hero-subtitle'), data.textos.heroSubtitle);
  }

  function applySlider(data) {
    if (!data || !Array.isArray(data.slider) || !data.slider.length) return;
    var track = document.querySelector('.sn-hero-bg-track');
    if (!track) return;

    function makeGroup(images) {
      var group = document.createElement('div');
      group.className = 'sn-hero-bg-group';
      images.forEach(function (src) {
        var slide = document.createElement('div');
        slide.className = 'sn-hero-bg-slide';
        var img = document.createElement('img');
        img.src = src;
        img.alt = '';
        img.loading = 'lazy';
        img.onerror = function () { this.src = './public/logo.png'; };
        slide.appendChild(img);
        group.appendChild(slide);
      });
      return group;
    }

    track.innerHTML = '';
    track.appendChild(makeGroup(data.slider));
    track.appendChild(makeGroup(data.slider));
  }

  function applyServicosHome(data) {
    if (!data || !Array.isArray(data.servicos) || !data.servicos.length) return;

    if (data.textos) {
      var section = document.querySelector('.sn-section.bg-sn-light');
      if (section) {
        setText(section.querySelector('.sn-section-title'), data.textos.servicosTitulo);
        var p = section.querySelector('p.text-muted');
        setText(p, data.textos.servicosSubtitulo);
      }
    }

    var cards = document.querySelectorAll('.sn-section.bg-sn-light .sn-card');
    data.servicos.forEach(function (s, i) {
      if (s.ativo === false) return;
      var card = cards[i];
      if (!card) return;
      setImg(card.querySelector('img.sn-service-img'), s.imagem, s.titulo);
      setText(card.querySelector('h3'), s.titulo);
      setText(card.querySelector('p.text-muted'), s.descricaoCurta);
    });
  }

  function applyServicosPage(data) {
    if (!data || !Array.isArray(data.servicos)) return;
    data.servicos.forEach(function (s) {
      var section = document.getElementById(s.id);
      if (!section) return;
      setImg(section.querySelector('img.sn-detail-img'), s.imagem, s.tituloLongo || s.titulo);
      setText(section.querySelector('.sn-badge'), s.badge);
      setText(section.querySelector('.sn-section-title'), s.tituloLongo);
      setText(section.querySelector('p.text-muted'), s.descricaoLonga);
      var ul = section.querySelector('ul.list-unstyled');
      if (ul && Array.isArray(s.itens) && s.itens.length) {
        ul.innerHTML = s.itens.map(function (item) {
          return '<li class="mb-2">✓ ' + item + '</li>';
        }).join('');
      }
    });
  }

  function applyEmpresas(data) {
    if (!data || !Array.isArray(data.empresas) || !data.empresas.length) return;
    var logos = document.querySelectorAll('.sn-logo-img, .sn-client-logo img, [class*="logo"] img');
    // Soft apply: update known partner blocks if structure matches
    var blocks = document.querySelectorAll('.sn-client, .client-item, .parceiro');
    if (!blocks.length) return;
    var active = data.empresas.filter(function (e) { return e.ativo !== false; });
    active.forEach(function (e, i) {
      if (!blocks[i]) return;
      var img = blocks[i].querySelector('img');
      var strong = blocks[i].querySelector('strong');
      setImg(img, e.logo, e.nome);
      setText(strong, e.nome);
    });
  }

  function applySobre(data) {
    if (!data || !data.sobre) return;
    var s = data.sobre;
    setText(document.querySelector('#sobre .sn-section-title, .sobre-titulo'), s.titulo);
    setText(document.querySelector('#sobre .sobre-texto, .sobre-desc'), s.texto);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var data = loadContent();
    if (!data) return;

    var path = (location.pathname || '').toLowerCase();
    var isHome = /\/$|index\.html?$/.test(path) || path.endsWith('/website') || path.endsWith('/website/');
    var isServicos = path.indexOf('servicos') !== -1;
    var isSobre = path.indexOf('sobre') !== -1;

    if (isHome || document.querySelector('.sn-hero-title')) {
      applyHero(data);
      applySlider(data);
      applyServicosHome(data);
      applyEmpresas(data);
    }
    if (isServicos) applyServicosPage(data);
    if (isSobre) applySobre(data);
  });
})();
