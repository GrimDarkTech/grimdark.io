/*
 * gallery.js — карусель изображений на странице «Подробнее».
 * Список картинок и стартовый кадр берутся из data/about.json (page.gallery).
 */
(function () {
  'use strict';

  var state = { images: [], main: 2, max: 0 };

  function setBackground(id, url) {
    var el = document.getElementById(id);
    if (el) el.style.backgroundImage = 'url("' + url + '")';
  }

  function paint() {
    if (!state.images.length) return;
    var prev = state.main - 1 < 1 ? state.max : state.main - 1;
    var next = state.main + 1 > state.max ? 1 : state.main + 1;

    setBackground('image1', state.images[prev - 1]);
    setBackground('image2', state.images[state.main - 1]);
    setBackground('image3', state.images[next - 1]);
  }

  window.scrollGallery = function (side) {
    if (!state.max) return;
    if (side === 'left') {
      state.main = (state.main === 1) ? state.max : state.main - 1;
    } else {
      state.main = (state.main === state.max) ? 1 : state.main + 1;
    }
    paint();
  };

  function buildThumbs() {
    var list = document.querySelector('.gallery_adaption .list');
    if (!list) return;
    list.innerHTML = '';
    state.images.forEach(function (src) {
      var item = document.createElement('li');
      item.className = 'item';
      item.style.backgroundImage = 'url("' + src + '")';
      item.style.backgroundSize = 'cover';
      list.appendChild(item);
    });
  }

  document.addEventListener('site:ready', function (event) {
    var gallery = event.detail.page.gallery;
    if (!gallery) return;

    var root = event.detail.root;
    state.images = (gallery.images || []).map(function (path) { return root + path; });
    state.max = state.images.length;
    state.main = gallery.mainIndex || 1;
    if (state.main > state.max) state.main = state.max || 1;

    paint();
    buildThumbs();
  });
})();
