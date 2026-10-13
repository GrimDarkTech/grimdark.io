/*
 * tariffs.js — переключение тарифов и форма заявки на странице «Тарифы».
 * Список тарифов формируется шаблоном из data/tariffs.json.
 */
(function () {
  'use strict';

  var tiers = ['basic', 'standart', 'premium'];
  var captcha = 0;
  var strings = {};

  function openTariff(id) {
    tiers.forEach(function (tier) {
      var active = (tier === id);
      var container = document.getElementById('tariff_container_' + tier);
      var title = document.getElementById('title_' + tier);
      if (container) container.style.display = active ? 'block' : 'none';
      if (title) title.style.textTransform = active ? 'uppercase' : 'capitalize';
    });

    var select = document.getElementById('form_tariff_title');
    if (select && tiers.indexOf(id) !== -1) select.value = id;
  }
  window.openTariff = openTariff;

  function numberGenerating() {
    var value = '';
    for (var i = 0; i < 4; i++) value += Math.floor(Math.random() * 10);
    captcha = value;

    var label = document.getElementById('form_tariff_number_label');
    if (label) {
      label.textContent = (strings.captcha || 'Введите число') + ' ' + value + ' ' + (strings.captchaSuffix || '*');
    }
  }

  window.getFeedback = function () {
    var box = document.getElementById('feedback');
    if (box) {
      box.style.display = 'block';
      box.style.animation = 'animation_feedback 1s linear both';
    }
    numberGenerating();
  };

  window.send = function () {
    var input = document.getElementById('form_tariff_number');
    if (!input) return;

    if (input.value !== String(captcha)) {
      input.style.boxShadow = '0 0 5px 1px rgb(255 207 207)';
      return;
    }
    input.style.boxShadow = '';

    alert(strings.sent || 'Заявка отправлена');
    var form = document.getElementById('form_feedback');
    if (form) form.reset();
  };

  document.addEventListener('site:ready', function (event) {
    var feedback = event.detail.page.feedback || {};
    strings = Object.assign({}, feedback.labels || {}, feedback.messages || {});

    var stored = null;
    try { stored = localStorage.getItem('tariff'); } catch (err) { /* no-op */ }
    openTariff(tiers.indexOf(stored) !== -1 ? stored : 'basic');

    if (window.jQuery && jQuery.fn && jQuery.fn.mask) {
      jQuery('.form_tariff_phone').mask('+7(999) 999-9999');
    }
  });
})();
