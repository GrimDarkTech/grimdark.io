/*
 * data.js — мини-движок шаблонов + загрузка данных из JSON.
 *
 * Поддерживается:
 *   {{ path.to.value }}                         — подстановка значения (в тексте и в атрибутах)
 *   <template data-repeat="path" data-as="x">   — повтор блока для каждого элемента списка
 *   data-if="x.flag" / data-if="x.type === 'p'" — удалить элемент, если условие ложно
 *   data-html="path"                            — вставить HTML из данных (innerHTML)
 *   {{root}}                                    — относительный путь до корня сайта ("" или "../")
 *
 * На каждой странице в <body> задаются:
 *   data-page="home|about|tariffs|terms"  — какой файл data/<page>.json грузить
 *   data-root=""                          — префикс пути до корня (для подстраниц: "../")
 */
(function () {
  'use strict';

  var TOKEN = /\{\{\s*([\w.]+)\s*\}\}/g;

  function get(obj, path) {
    return String(path).split('.').reduce(function (o, key) {
      return (o == null) ? undefined : o[key];
    }, obj);
  }

  // Рекурсивная подстановка: значение само может содержать {{ }} (например, {{site.domain}} внутри текста).
  function interp(str, ctx, depth) {
    depth = depth || 0;
    var out = String(str).replace(TOKEN, function (match, path) {
      var value = get(ctx, path);
      return (value == null) ? '' : value;
    });
    if (depth < 10 && out.indexOf('{{') !== -1) return interp(out, ctx, depth + 1);
    return out;
  }

  function evalIf(expr, ctx) {
    expr = String(expr).trim();
    var negate = false;
    while (expr.charAt(0) === '!') { negate = !negate; expr = expr.slice(1).trim(); }
    var m = expr.match(/^([\w.]+)\s*(===|!==|==|!=)\s*(['"])([\s\S]*?)\3$/);
    var value;
    if (m) {
      var left = get(ctx, m[1]);
      var literal = m[4];
      if (m[2] === '===') value = left === literal;
      else if (m[2] === '!==') value = left !== literal;
      else if (m[2] === '==') value = left == literal; // eslint-disable-line eqeqeq
      else value = left != literal; // eslint-disable-line eqeqeq
    } else {
      value = get(ctx, expr);
    }
    return negate ? !value : !!value;
  }

  function toArray(nodes) { return Array.prototype.slice.call(nodes); }

  function expandRepeats(scope, ctx) {
    // content шаблона находится в отдельном DocumentFragment, поэтому вложенные
    // data-repeat не попадут в выборку и будут развёрнуты рекурсивно позже.
    toArray(scope.querySelectorAll('template[data-repeat]')).forEach(function (tpl) {
      var list = get(ctx, tpl.getAttribute('data-repeat')) || [];
      var as = tpl.getAttribute('data-as') || 'item';
      var fragment = document.createDocumentFragment();

      toArray(list).forEach(function (item) {
        var childCtx = Object.assign({}, ctx);
        childCtx[as] = item;

        var clone = tpl.content.cloneNode(true);
        expandRepeats(clone, childCtx);
        bind(clone, childCtx);
        fragment.appendChild(clone);
      });

      tpl.parentNode.replaceChild(fragment, tpl);
    });
  }

  function bind(node, ctx) {
    if (node.nodeType === 1) {
      if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE') return;
      if (node.hasAttribute('data-if')) {
        if (!evalIf(node.getAttribute('data-if'), ctx)) {
          node.parentNode.removeChild(node);
          return;
        }
        node.removeAttribute('data-if'); // защита от повторной обработки с внешним контекстом
      }
      if (node.hasAttribute('data-html')) {
        node.innerHTML = interp(get(ctx, node.getAttribute('data-html')) || '', ctx);
        node.removeAttribute('data-html');
      }
      toArray(node.attributes).forEach(function (attr) {
        if (attr.value.indexOf('{{') !== -1) node.setAttribute(attr.name, interp(attr.value, ctx));
      });
    } else if (node.nodeType === 3) {
      if (node.nodeValue.indexOf('{{') !== -1) node.nodeValue = interp(node.nodeValue, ctx);
    }
    toArray(node.childNodes).forEach(function (child) { bind(child, ctx); });
  }

  function fetchJSON(url) {
    return fetch(url, { cache: 'no-cache' }).then(function (response) {
      if (!response.ok) throw new Error('HTTP ' + response.status + ' при загрузке ' + url);
      return response.json();
    });
  }

  function showError(err) {
    console.error('[data.js] Не удалось загрузить данные сайта:', err);
    document.documentElement.classList.add('data-error');
    var notice = document.createElement('div');
    notice.className = 'data-error-message';
    notice.innerHTML = 'Не удалось загрузить данные (<code>data/*.json</code>).<br>' +
      'Откройте сайт через веб-сервер — браузеры запрещают чтение JSON с диска. Подробности в README.md.';
    document.body.appendChild(notice);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var page = document.body.getAttribute('data-page') || 'home';
    var root = document.body.getAttribute('data-root') || '';

    Promise.all([
      fetchJSON(root + 'data/site.json'),
      fetchJSON(root + 'data/' + page + '.json')
    ]).then(function (result) {
      var ctx = { site: result[0], page: result[1], root: root };
      expandRepeats(document.documentElement, ctx);
      bind(document.documentElement, ctx);
      document.dispatchEvent(new CustomEvent('site:ready', {
        detail: { site: result[0], page: result[1], root: root }
      }));
    }).catch(showError);
  });
})();
