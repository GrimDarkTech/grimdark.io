/*
 * main.js — общее поведение для всех страниц:
 * плавный скролл по якорям, бургер-меню, анимация появления блоков,
 * модальные окна с видео и запоминание выбранного тарифа.
 */
(function () {
  'use strict';

  function initSmoothScroll() {
    var links = [].slice.call(document.querySelectorAll('.parallax__buttons a'))
      .concat([].slice.call(document.querySelectorAll('.header-menu__link')));

    if (window.seamless) window.seamless.polyfill();

    links.forEach(function (element) {
      element.addEventListener('click', function (event) {
        var href = element.getAttribute('href') || '';
        if (href.charAt(0) !== '#') return;      // обычные ссылки (index.html#about) — не перехватываем
        event.preventDefault();

        var section = document.getElementById(href.substring(1));
        if (!section) return;

        if (window.seamless) {
          window.seamless.scrollIntoView(section, {
            behavior: 'smooth', block: 'start', inline: 'start'
          });
        } else {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  function offset(el) {
    var rect = el.getBoundingClientRect();
    var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
  }

  function initScrollAnimation() {
    var animItems = document.querySelectorAll('._anim-items');
    if (!animItems.length) return;

    function animationScroll() {
      for (var i = 0; i < animItems.length; i++) {
        var animItem = animItems[i];
        var animItemHeight = animItem.offsetHeight;
        var animItemOffset = offset(animItem).top;
        var animStart = 4;
        var animItemPoint = window.innerHeight - animItemHeight / animStart;

        if (animItemHeight > window.innerHeight) {
          animItemPoint = window.innerHeight - window.innerHeight / animStart;
        }

        if ((window.pageYOffset > animItemOffset - animItemPoint) &&
            window.pageYOffset < (animItemOffset + animItemHeight)) {
          animItem.classList.add('_active');
        } else {
          animItem.classList.remove('_active');
        }
        if (animItemHeight <= window.pageYOffset) {
          animItem.classList.add('_active');
        }
      }
    }

    window.addEventListener('scroll', animationScroll);
    animationScroll();
  }

  function initBurger() {
    var iconMenu = document.querySelector('.menu__menu-burger') ||
                   document.querySelector('.menu_menu-burger');
    var menuBody = document.querySelector('.header-menu__body');
    if (!iconMenu || !menuBody) return;

    iconMenu.addEventListener('click', function () {
      document.body.classList.toggle('_lock');
      iconMenu.classList.toggle('_active');
      menuBody.classList.toggle('_active');
    });
  }

  function initLoadingClass() {
    setTimeout(function () {
      document.body.classList.add('body_loading');
    }, 200);
  }

  document.addEventListener('site:ready', function () {
    initSmoothScroll();
    initScrollAnimation();
    initBurger();
    initLoadingClass();
  });
})();

/* --- Глобальные помощники, вызываемые из inline-обработчиков --- */

function openVideo(numberVideo) {
  var container = document.getElementById('container_video' + numberVideo);
  var frame = document.getElementById('video' + numberVideo);
  if (!container || !frame) return;
  container.style.display = 'flex';
  var base = frame.getAttribute('data-src') || frame.getAttribute('src');
  frame.setAttribute('src', base + (base.indexOf('?') === -1 ? '?' : '&') + 'autoplay=1');
}

function closeVideo(numberVideo) {
  var container = document.getElementById('container_video' + numberVideo);
  var frame = document.getElementById('video' + numberVideo);
  if (!container || !frame) return;
  container.style.display = 'none';
  var base = frame.getAttribute('data-src');
  if (base) frame.setAttribute('src', base);
}

function addStorage(value) {
  try { localStorage.setItem('tariff', value); } catch (e) { /* no-op */ }
}
