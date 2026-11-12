/* =========================================================================
   站点渲染与交互 — 纯原生 JS，无依赖、无构建
   单文件多视图：一个 index.html，靠 #/ 路由切换四个视图
     #/            首页
     #/works       全部作品（可带筛选 #/works/info）
     #/work/<id>   作品详情
     #/about       关于
     #/contact     首页并滚到联系区
   编辑：任意地址后加 ?edit=1 即可就地改字、换图
   ========================================================================= */

(function () {
  'use strict';

  var S = window.PortfolioStore;
  /* ?edit=1 写在 # 前面或后面都认，避免记错位置 */
  var EDIT = /[?&]edit=1/.test(location.search) || /[?&]edit=1/.test(location.hash);
  /* 正常浏览只认 data/content.js；只有编辑模式才叠加本机草稿。
     这样浏览器里残留的旧草稿永远不会影响正式页面。 */
  var C = S.get(EDIT);
  /* 每次都重新取，不能在启动时缓存——否则路由会一直用旧值 */
  function cleanHash() { return (location.hash || '').split('?')[0]; }
  var current = { view: 'home', id: '', part: '' };

  /* ------------------------------------------------------------ 小工具 */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function txt(s) {
    var v = String(s == null ? '' : s);
    if (!v.trim()) return '<span class="ph">在这里写点什么</span>';
    return esc(v).replace(/\n/g, '<br>');
  }
  function ml(s) {
    var v = String(s == null ? '' : s);
    if (!v.trim()) return '<span class="ph">在这里写点什么</span>';
    return esc(v).replace(/&lt;br\s*\/?&gt;/gi, '<br>').replace(/\n/g, '<br>');
  }
  function inl(path) {
    return EDIT ? ' data-edit="' + path + '" contenteditable="true" spellcheck="false"' : '';
  }
  function ed(path) { return inl(path); }
  function img(src) { return S.asset(src, '.'); }
  function pad(n) { return String(n).padStart(2, '0'); }
  function partOf(id) {
    return (C.parts || []).filter(function (p) { return p.id === id; })[0] || { id: id, label: id, en: '' };
  }
  function projectsOf(part) {
    return (C.projects || []).filter(function (p) { return !part || p.part === part; });
  }
  function byId(id) {
    return (C.projects || []).filter(function (p) { return p.id === id; })[0];
  }
  function coverOf(p) {
    return p && p.images && p.images.length ? p.images[0] : null;
  }
  function ratioStyle(im) {
    if (!im || !im.w || !im.h) return '';
    return 'aspect-ratio:' + im.w + '/' + im.h + ';';
  }
  function projHref(id) { return '#/work/' + encodeURIComponent(id); }

  /* ------------------------------------------------------------ 导航与页脚 */
  function renderChrome() {
    var header = $('#site-header');
    if (header) {
      var nav = [
        { href: '#/works', label: '作品', key: 'works' },
        { href: '#/about', label: '关于', key: 'about' },
        { href: '#/contact', label: '联系', key: 'contact' }
      ];
      header.className = 'header';
      header.innerHTML =
        '<div class="header__inner">' +
          '<a class="brand" href="#/">' +
            '<span class="brand__cn">' + txt(C.site.name) + '</span>' +
            '<span class="brand__en">' + txt(C.site.nameEn) + '</span>' +
          '</a>' +
          '<nav class="nav">' + nav.map(function (n) {
            var on = (n.key === current.view) || (n.key === 'works' && current.view === 'project');
            return '<a href="' + n.href + '"' + (on ? ' class="is-active"' : '') + '>' + n.label + '</a>';
          }).join('') + '</nav>' +
          '<div class="header__tag">' + esc(C.site.role) + '</div>' +
          '<button class="menu-btn" aria-label="菜单"><span></span><span></span></button>' +
        '</div>';
    }

    /* 页脚链接：保留当前视图；编辑模式下改为「退出编辑」 */
    var ch = cleanHash();
    var editHref = EDIT ? (location.pathname + ch) : ('?edit=1' + ch);
    var editText = EDIT ? '✎ 退出编辑' : '✎ 修改内容';

    /* 编辑入口只在「本机打开」或「已进入编辑模式」时出现。
       部署到线上后，访客看到的页脚是干净的，不会点进后台。 */
    var IS_LOCAL = location.protocol === 'file:' ||
      /^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/.test(location.hostname) ||
      /^192\.168\.|^10\.|^172\.(1[6-9]|2\d|3[01])\./.test(location.hostname);
    var SHOW_ADMIN = IS_LOCAL || EDIT;

    var footer = $('#site-footer');
    if (footer) {
      footer.className = 'footer';
      footer.innerHTML =
        '<div class="wrap footer__inner">' +
          '<div class="footer__l">' +
            '<b>' + txt(C.site.name) + ' · ' + txt(C.site.nameEn) + '</b><br>' +
            esc(C.site.school) + '<br>' +
            esc(C.contact.email) + ' · ' + esc(C.contact.tel) +
          '</div>' +
          '<div class="footer__links">' +
            '<a href="#/works">全部作品</a>' +
            '<a href="#/about">关于</a>' +
            '<a href="mailto:' + esc(C.contact.email) + '">邮件</a>' +
            (SHOW_ADMIN
              ? '<a href="editor.html">内容管理</a>' +
                '<a href="' + editHref + '">' + editText + '</a>'
              : '') +
          '</div>' +
        '</div>';
    }

    /* 菜单按钮：委托绑定一次，避免每次重渲染重复绑定 */
    if (!renderChrome._bound) {
      document.addEventListener('click', function (e) {
        if (e.target.closest('.menu-btn')) $('#site-header').classList.toggle('is-open');
      });
      renderChrome._bound = true;
    }
  }

  /* ------------------------------------------------------------ 首页 */
  function renderHome() {
    var s = C.site;

    var meta = $('#hero-meta');
    if (meta) {
      meta.innerHTML = (s.metaTags || []).map(function (t, i) {
        return '<span' + ed('site.metaTags.' + i) + '>' + txt(t) + '</span>';
      }).join('');
    }
    var scroll = $('#hero-scroll-label');
    if (scroll) scroll.innerHTML = txt(s.scrollLabel);

    var h1 = $('#hero-title');
    if (h1) {
      h1.innerHTML = (s.heroLines || []).map(function (line, i) {
        var cls = i === 1 ? ' class="outline indent"' : '';
        return '<span' + cls + ed('site.heroLines.' + i) + '>' + txt(line) + '</span>';
      }).join('');
    }

    var lede = $('#hero-lede');
    if (lede) { lede.innerHTML = txt(s.lede); if (EDIT) { lede.setAttribute('data-edit', 'site.lede'); lede.setAttribute('contenteditable', 'true'); } }

    var idxLabel = $('#index-label');
    if (idxLabel) { idxLabel.innerHTML = txt(s.indexLabel); if (EDIT) { idxLabel.setAttribute('data-edit', 'site.indexLabel'); idxLabel.setAttribute('contenteditable', 'true'); } }

    var cats = $('#home-cats');
    if (cats) {
      cats.innerHTML = (C.parts || []).map(function (p) {
        var n = projectsOf(p.id).length;
        return '<a href="#/works/' + p.id + '">' +
          '<span>' + txt(p.label) + '</span>' +
          '<em>' + pad(n) + ' / ' + esc(p.en.split(' ')[0]) + '</em></a>';
      }).join('');
    }

    var title = $('#selected-title');
    if (title) { title.innerHTML = ml(s.selectedTitle); if (EDIT) { title.setAttribute('data-edit', 'site.selectedTitle'); title.setAttribute('contenteditable', 'true'); } }
    var note = $('#selected-note');
    if (note) { note.innerHTML = txt(s.selectedNote); if (EDIT) { note.setAttribute('data-edit', 'site.selectedNote'); note.setAttribute('contenteditable', 'true'); } }

    var grid = $('#home-collage');
    if (grid) {
      var ids = (s.collageIds || []).slice(0, 5);
      var slots = ['a', 'b', 'c', 'd', 'e'];
      var items = ids.map(function (id) { return byId(id); }).filter(Boolean);
      (C.projects || []).forEach(function (p) {
        if (items.length < 5 && ids.indexOf(p.id) < 0) items.push(p);
      });
      grid.innerHTML = items.slice(0, 5).map(function (p, i) {
        var im = coverOf(p);
        if (!im) return '';
        return '<a class="collage__item ' + slots[i] + ' edit-img" href="' + projHref(p.id) + '"' +
          ' data-img="projects.' + C.projects.indexOf(p) + '.images.0">' +
          '<img src="' + img(im.src) + '" alt="' + esc(p.title) + '" loading="lazy">' +
          '<span class="collage__label">' + pad(C.projects.indexOf(p) + 1) + '</span>' +
          '<span class="collage__cap">' + esc(p.title) + ' · ' + esc(p.tagline || '') + '</span>' +
        '</a>';
      }).join('');
    }

    var ft = $('#featured-title');
    if (ft) { ft.innerHTML = ml(s.featuredTitle); if (EDIT) { ft.setAttribute('data-edit', 'site.featuredTitle'); ft.setAttribute('contenteditable', 'true'); } }
    var fn = $('#featured-note');
    if (fn) { fn.innerHTML = txt(s.featuredNote); if (EDIT) { fn.setAttribute('data-edit', 'site.featuredNote'); fn.setAttribute('contenteditable', 'true'); } }

    var list = $('#home-featured');
    if (list) {
      list.innerHTML = (C.projects || []).slice(0, 5).map(function (p, i) {
        var im = coverOf(p);
        var part = partOf(p.part);
        return '<a class="feat-row" href="' + projHref(p.id) + '">' +
          '<div class="feat-row__num">' + pad(i + 1) + ' / ' + pad(C.projects.length) + '</div>' +
          '<div class="feat-row__title">' + txt(p.title) +
            '<small>' + esc(p.en) + ' · ' + esc(part.en) + '</small></div>' +
          '<div class="feat-row__img">' + (im ? '<img src="' + img(im.src) + '" alt="" loading="lazy">' : '') + '</div>' +
          '<div class="feat-row__arrow">↗</div>' +
        '</a>';
      }).join('');
    }
    var allBtn = $('#all-works-label');
    if (allBtn) allBtn.textContent = '查看全部 ' + pad(C.projects.length) + ' 个项目 ↗';

    var band = $('#divider-band');
    if (band) {
      var pick = byId((s.dividerId || '')) || C.projects[2] || C.projects[0];
      var pim = coverOf(pick);
      if (pick && pim) {
        band.innerHTML =
          '<div class="divider-band__img"><img src="' + img(pim.src) + '" alt="" loading="lazy"></div>' +
          '<div class="divider-band__text">' +
            '<div class="lb">' + esc(partOf(pick.part).en) + '</div>' +
            '<h3>' + txt(pick.title) + '</h3>' +
            '<p>' + esc(pick.tagline || '') + '<br>' + esc(pick.en) + ' · ' + esc(pick.year) + '</p>' +
            '<a href="' + projHref(pick.id) + '">进入项目 ↗</a>' +
          '</div>';
      }
    }

    var al = $('#about-label');
    if (al) { al.innerHTML = txt(s.aboutLabel); if (EDIT) { al.setAttribute('data-edit', 'site.aboutLabel'); al.setAttribute('contenteditable', 'true'); } }
    var at = $('#about-title');
    if (at) { at.innerHTML = ml(s.aboutTitle); if (EDIT) { at.setAttribute('data-edit', 'site.aboutTitle'); at.setAttribute('contenteditable', 'true'); } }
    var a1 = $('#about-text-1');
    if (a1) { a1.innerHTML = txt(s.aboutText1); if (EDIT) { a1.setAttribute('data-edit', 'site.aboutText1'); a1.setAttribute('contenteditable', 'true'); } }
    var a2 = $('#about-text-2');
    if (a2) { a2.innerHTML = txt(s.aboutText2); if (EDIT) { a2.setAttribute('data-edit', 'site.aboutText2'); a2.setAttribute('contenteditable', 'true'); } }

    var cl = $('#contact-label');
    if (cl) { cl.innerHTML = txt(s.contactLabel); if (EDIT) { cl.setAttribute('data-edit', 'site.contactLabel'); cl.setAttribute('contenteditable', 'true'); } }
    var clist = $('#contact-list');
    if (clist) {
      var rows = [
        { k: 'NAME', v: C.contact.name },
        { k: 'TEL', v: C.contact.tel, href: 'tel:' + C.contact.tel },
        { k: 'EMAIL', v: C.contact.email, href: 'mailto:' + C.contact.email },
        { k: 'WECHAT', v: C.contact.wechat },
        { k: 'CITY', v: C.contact.city },
        { k: 'SOURCE', v: C.contact.source }
      ].filter(function (r) { return r.v; });
      clist.innerHTML = rows.map(function (r) {
        var inner = r.href ? '<a href="' + esc(r.href) + '">' + esc(r.v) + '</a>' : '<b>' + esc(r.v) + '</b>';
        return '<div><span>' + r.k + '</span>' + inner + '</div>';
      }).join('');
    }

    var ct = $('#closing-title');
    if (ct) { ct.innerHTML = txt(s.closingTitle); if (EDIT) { ct.setAttribute('data-edit', 'site.closingTitle'); ct.setAttribute('contenteditable', 'true'); } }
    var cp = $('#closing-text');
    if (cp) { cp.innerHTML = txt(s.closingText); if (EDIT) { cp.setAttribute('data-edit', 'site.closingText'); cp.setAttribute('contenteditable', 'true'); } }
    var cn = $('#closing-note');
    if (cn) { cn.innerHTML = txt(s.closingNote); if (EDIT) { cn.setAttribute('data-edit', 'site.closingNote'); cn.setAttribute('contenteditable', 'true'); } }
  }

  /* ------------------------------------------------------------ 作品索引 */
  var currentFilter = 'all';

  function renderWorks() {
    var filters = $('#filters');
    if (filters) {
      var opts = [{ id: 'all', label: '全部作品', en: 'ALL' }].concat(C.parts || []);
      filters.innerHTML = opts.map(function (p) {
        var n = p.id === 'all' ? C.projects.length : projectsOf(p.id).length;
        return '<button data-filter="' + p.id + '"' + (p.id === currentFilter ? ' class="is-on"' : '') + '>' +
          p.label + '<em>' + pad(n) + '</em></button>';
      }).join('');
      if (!filters._bound) {
        filters.addEventListener('click', function (e) {
          var b = e.target.closest('button[data-filter]');
          if (!b) return;
          currentFilter = b.dataset.filter;
          $$('button', filters).forEach(function (x) { x.classList.toggle('is-on', x === b); });
          applyFilter();
          var h = '#/works' + (currentFilter === 'all' ? '' : '/' + currentFilter);
          try { history.replaceState(null, '', location.pathname + location.search + h); } catch (err) {}
        });
        filters._bound = true;
      }
    }

    var grid = $('#works-grid');
    if (grid) {
      grid.innerHTML = (C.projects || []).map(function (p, i) {
        var im = coverOf(p);
        var part = partOf(p.part);
        return '<a class="card" data-part="' + esc(p.part) + '" href="' + projHref(p.id) + '">' +
          '<div class="card__img">' +
            (im ? '<img src="' + img(im.src) + '" alt="' + esc(p.title) + '" loading="lazy">' : '') +
            '<span class="card__num">' + pad(i + 1) + '</span>' +
          '</div>' +
          '<div class="card__title">' + esc(p.title) + '</div>' +
          '<div class="card__sub">' + esc(p.en) + '</div>' +
          '<div class="card__tag">' + esc(part.label) + ' · ' + esc(p.year) + '</div>' +
        '</a>';
      }).join('');
      applyFilter();
    }

    var total = $('#works-count');
    if (total) total.textContent = pad(C.projects.length);
  }

  function applyFilter() {
    $$('.card').forEach(function (c) {
      c.classList.toggle('is-hidden', currentFilter !== 'all' && c.dataset.part !== currentFilter);
    });
  }

  /* ------------------------------------------------------------ 项目详情 */
  function renderProject(id) {
    var idx = -1;
    (C.projects || []).forEach(function (p, i) { if (p.id === id) idx = i; });
    if (idx < 0) idx = 0;
    var p = C.projects[idx];
    if (!p) return;
    var part = partOf(p.part);

    document.title = p.title + ' · ' + C.site.name + ' 作品集';

    var box = $('#proj');
    if (!box) return;

    var prev = C.projects[(idx - 1 + C.projects.length) % C.projects.length];
    var next = C.projects[(idx + 1) % C.projects.length];

    var meta = [
      { k: '类别', v: part.label },
      { k: '年份', v: p.year },
      { k: '工具', v: p.tools },
      { k: '角色', v: p.role },
      { k: '规格', v: p.size }
    ].filter(function (m) { return m.v; });

    box.innerHTML =
      '<div class="wrap proj-hero">' +
        '<div class="proj-top">' +
          '<a class="back" href="#/works">← 全部作品</a>' +
          '<div class="proj-idx">' + pad(idx + 1) + ' / ' + pad(C.projects.length) + ' &nbsp;·&nbsp; ' + esc(part.en) + '</div>' +
        '</div>' +
        '<div class="proj-title">' +
          '<h1' + inl('projects.' + idx + '.title') + '>' + txt(p.title) + '</h1>' +
          '<div class="en">' + esc(p.en) + '</div>' +
          (p.tagline ? '<div class="tagline"' + inl('projects.' + idx + '.tagline') + '>' + esc(p.tagline) + '</div>' : '') +
        '</div>' +
      '</div>' +
      '<div class="wrap proj-body">' +
        '<aside class="proj-meta">' + meta.map(function (m) {
          return '<div><span>' + m.k + '</span><b>' + esc(m.v) + '</b></div>';
        }).join('') + '</aside>' +
        '<div class="proj-content">' +
          '<p class="summary"' + inl('projects.' + idx + '.summary') + '>' + txt(p.summary) + '</p>' +
          (p.blocks || []).map(function (b, bi) {
            return '<div class="proj-block"><h3>' + esc(b.k) + '</h3><p' + inl('projects.' + idx + '.blocks.' + bi + '.v') + '>' + txt(b.v) + '</p></div>';
          }).join('') +
          (p.note ? '<div class="proj-note">' + txt(p.note) + '</div>' : '') +
        '</div>' +
      '</div>' +
      '<div class="wrap gallery">' + (p.images || []).map(function (im, i) {
        return '<figure class="gallery__item' + (im.tall ? ' tall' : '') + '">' +
          '<img src="' + img(im.src) + '" alt="' + esc(p.title) + '" style="' + ratioStyle(im) + 'object-fit:contain" data-lb="' + i + '">' +
          (im.cap ? '<figcaption>' + esc(im.cap) + '</figcaption>' : '') +
        '</figure>';
      }).join('') + '</div>' +
      detailsHTML(p, idx) +
      '<div class="wrap pager">' +
        '<a href="' + projHref(prev.id) + '"><small>← PREVIOUS</small><b>' + esc(prev.title) + '</b></a>' +
        '<a class="next" href="' + projHref(next.id) + '"><small>NEXT →</small><b>' + esc(next.title) + '</b></a>' +
      '</div>';

    initDetails(box);
  }

  /* ------------------------------------------------------------ 细节区 */
  function detailsHTML(p, idx) {
    var ds = p.details || [];
    if (!ds.length) return '';
    var imgs = p.images || [];
    var first = imgs[ds[0].of] || imgs[0] || {};
    var ar = (first.w && first.h) ? (first.w + '/' + first.h) : '1/1.414';

    var figs = ds.map(function (d, i) {
      var src = imgs[d.of] || {};
      return '<figure class="detail" data-i="' + i + '" data-of="' + d.of + '"' +
        ' data-box="' + d.box.join(',') + '"' +
        ' data-src="' + esc(img(src.src || '')) + '">' +
        '<div class="detail__img"><img src="' + img(d.src) + '" width="' + (d.w || 1200) + '" height="' + (d.h || 900) + '" alt="' + esc(d.title) + '" loading="lazy"></div>' +
        '<figcaption>' +
          '<span class="detail__n">' + pad(i + 1) + '</span>' +
          '<b' + inl('projects.' + idx + '.details.' + i + '.title') + '>' + esc(d.title) + '</b>' +
          '<p' + inl('projects.' + idx + '.details.' + i + '.note') + '>' + txt(d.note) + '</p>' +
        '</figcaption></figure>';
    }).join('');

    return '<section class="details"><div class="wrap">' +
      '<div class="section-head" data-reveal>' +
        '<h2>DETAILS<br>细节</h2>' +
        '<div class="side">从整幅里裁出来的局部。左边那块标出它在原图中的位置——鼠标移到任意一张，色块会跟着走。</div>' +
      '</div>' +
      '<div class="details__grid">' +
        '<aside class="details__loc">' +
          '<div class="loc" style="aspect-ratio:' + ar + '">' +
            '<img id="loc-img" src="' + esc(img(first.src || '')) + '" alt="">' +
            '<span class="loc__rect" id="loc-rect"></span>' +
          '</div>' +
          '<div class="loc__cap"><b id="loc-num">01</b> · 原图定位</div>' +
        '</aside>' +
        '<div class="details__list"><div class="details__col">' + figs + '</div><div class="details__col"></div></div>' +
      '</div>' +
    '</div></section>';
  }

  function initDetails(root) {
    var list = $('.details__list', root);
    var cols = $$('.details__col', root);
    var rect = $('#loc-rect', root);
    var imgEl = $('#loc-img', root);
    var num = $('#loc-num', root);
    if (!rect) return;
    /* 把图版按估算高度分到两列，让左右两栏尽量等高 */
    var figs = $$('.detail', root);
    if (figs.length && cols.length === 2) {
      figs.forEach(function (f) { if (f.parentNode) f.parentNode.removeChild(f); });
      var single = window.innerWidth <= 640;
      list.classList.toggle('is-single', single);
      cols[1].style.display = single ? 'none' : '';
      var colW = cols[0].getBoundingClientRect().width || 320;
      var acc = [0, 0];
      figs.forEach(function (f) {
        var im = f.querySelector('img');
        var ratio = (im && im.getAttribute('width') && im.getAttribute('height'))
          ? (+im.getAttribute('height') / +im.getAttribute('width')) : 1;
        var i = (!single && acc[1] < acc[0]) ? 1 : 0;
        cols[i].appendChild(f);
        acc[i] += colW * ratio + 104;
      });
    }

    var items = $$('.detail', root);

    function focus(el) {
      var b = el.dataset.box.split(',').map(Number);
      rect.style.left = (b[0] * 100) + '%';
      rect.style.top = (b[1] * 100) + '%';
      rect.style.width = ((b[2] - b[0]) * 100) + '%';
      rect.style.height = ((b[3] - b[1]) * 100) + '%';
      if (imgEl.getAttribute('src') !== el.dataset.src) imgEl.src = el.dataset.src;
      if (num) num.textContent = pad(+el.dataset.i + 1);
      items.forEach(function (d) { d.classList.toggle('is-on', d === el); });
    }
    items.forEach(function (el) {
      el.addEventListener('mouseenter', function () { focus(el); });
      el.addEventListener('click', function () { focus(el); });
    });
    if (items[0]) focus(items[0]);
  }

  /* ------------------------------------------------------------ 关于 */
  function renderAbout() {
    var A = C.about || {};
    var ph = $('#about-photo');
    var fig = $('#about-figure');
    var wrap2 = $('.about-two');
    var hasPhoto = !!(A.portrait && String(A.portrait).trim());
    if (fig) fig.style.display = hasPhoto ? '' : 'none';
    if (wrap2) wrap2.classList.toggle('no-photo', !hasPhoto);
    if (hasPhoto) {
      if (ph) {
        /* 万一草稿里还留着旧照片路径，加载失败也要优雅退化成无照片排版 */
        ph.onerror = function () {
          if (fig) fig.style.display = 'none';
          if (wrap2) wrap2.classList.add('no-photo');
        };
        ph.src = img(A.portrait);
      }
      var cap = fig ? fig.querySelector('figcaption') : null;
      if (cap && A.portraitCap) cap.textContent = A.portraitCap;
    }
    var intro = $('#about-intro');
    if (intro) { intro.innerHTML = txt(A.intro); if (EDIT) { intro.setAttribute('data-edit', 'about.intro'); intro.setAttribute('contenteditable', 'true'); } }
    var facts = $('#about-facts');
    if (facts) {
      facts.innerHTML = (A.facts || []).map(function (f, i) {
        return '<div><span>' + esc(f.k) + '</span><div' + (EDIT ? ' data-edit="about.facts.' + i + '.v" contenteditable="true"' : '') + '>' + txt(f.v) + '</div></div>';
      }).join('');
    }
    var tl = $('#timeline');
    if (tl) {
      tl.innerHTML = (A.timeline || []).map(function (t, i) {
        return '<div class="tl-row"><div class="y">' + esc(t.y) + '</div>' +
          '<div class="t">' + esc(t.t) + '</div><div class="d"' + (EDIT ? ' data-edit="about.timeline.' + i + '.d" contenteditable="true"' : '') + '>' + txt(t.d) + '</div></div>';
      }).join('');
    }
    var clist = $('#about-contact');
    if (clist) {
      var rows = [
        { k: 'TEL', v: C.contact.tel, href: 'tel:' + C.contact.tel },
        { k: 'EMAIL', v: C.contact.email, href: 'mailto:' + C.contact.email },
        { k: 'WECHAT', v: C.contact.wechat },
        { k: 'CITY', v: C.contact.city }
      ].filter(function (r) { return r.v; });
      clist.innerHTML = rows.map(function (r) {
        var inner = r.href ? '<a href="' + esc(r.href) + '">' + esc(r.v) + '</a>' : '<b>' + esc(r.v) + '</b>';
        return '<div><span>' + r.k + '</span>' + inner + '</div>';
      }).join('');
    }
  }

  /* ------------------------------------------------------------ 灯箱（事件委托） */
  var LB = { at: 0, list: [] };

  function initLightbox() {
    var lb = $('#lightbox');
    if (!lb) return;
    var imgEl = $('.lightbox__img', lb);
    var capEl = $('.lightbox__caption', lb);
    var cntEl = $('.lightbox__counter', lb);

    /* 一次只看一组：点作品大图就翻大图，点细节图就翻细节图 */
    function collect(el) {
      var scope = el.closest('.details__list');
      LB.list = scope ? $$('.detail__img img', scope) : $$('.gallery__item img');
      LB.caps = LB.list.map(function (x) {
        var f = x.closest('figure');
        var b = f && f.querySelector('figcaption b');
        var c = f && f.querySelector('figcaption');
        return b ? b.textContent : (c ? c.textContent : '');
      });
    }

    function show(i) {
      if (!LB.list.length) return;
      LB.at = (i + LB.list.length) % LB.list.length;
      imgEl.src = LB.list[LB.at].src;
      capEl.textContent = LB.caps[LB.at] || '';
      cntEl.textContent = (LB.at + 1) + ' / ' + LB.list.length;
    }
    function open(el) {
      collect(el);
      show(LB.list.indexOf(el));
      lb.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function close() { lb.classList.remove('is-open'); document.body.style.overflow = ''; }

    document.addEventListener('click', function (e) {
      var im = e.target.closest('.gallery__item img, .detail__img img');
      if (im) { e.preventDefault(); open(im); }
    });
    $('[data-lightbox-close]', lb).addEventListener('click', close);
    $('[data-lightbox-prev]', lb).addEventListener('click', function () { show(LB.at - 1); });
    $('[data-lightbox-next]', lb).addEventListener('click', function () { show(LB.at + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(LB.at - 1);
      if (e.key === 'ArrowRight') show(LB.at + 1);
    });
  }

  /* ------------------------------------------------------------ 滚动动效 */
  function initScroll() {
    var bar = $('#progress');
    var header = $('#site-header');
    var last = 0;
    function onScroll() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      if (bar) bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
      if (header) {
        var y = h.scrollTop;
        header.classList.toggle('is-hidden', y > 220 && y > last);
        last = y;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: .08, rootMargin: '0px 0px -6% 0px' });
    $$('[data-reveal]').forEach(function (el) { io.observe(el); });

    setTimeout(function () {
      $$('[data-reveal]:not(.is-in)').forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 1.2) el.classList.add('is-in');
      });
    }, 2500);
  }

  /* ------------------------------------------------------------ 就地编辑 */
  function initEdit() {
    if (!EDIT) return;
    document.body.classList.add('is-editing');

    var bar = document.createElement('div');
    bar.className = 'editbar';
    bar.innerHTML =
      '<b>编辑模式</b>' +
      '<button data-act="save" class="primary">保存草稿</button>' +
      '<button data-act="export">导出 content.js</button>' +
      '<button data-act="admin">内容管理</button>' +
      '<button data-act="reset">恢复默认</button>' +
      '<button data-act="exit">退出</button>';
    document.body.appendChild(bar);

    function bindText() {
      $$('[data-edit]').forEach(function (el) {
        if (el._bound) return;
        el._bound = true;
        el.addEventListener('blur', function () {
          var path = el.dataset.edit;
          var val = el.innerText.replace(/\u00a0/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
          S.set(path, val);
          C = S.get(true);
        });
        el.addEventListener('keydown', function (e) { if (e.key === 'Escape') el.blur(); });
      });
    }

    function resizeToDataUrl(file, cb) {
      var fr = new FileReader();
      fr.onload = function () {
        var im = new Image();
        im.onload = function () {
          var MAX = 1800;
          var s = Math.min(1, MAX / Math.max(im.width, im.height));
          var c = document.createElement('canvas');
          c.width = Math.round(im.width * s); c.height = Math.round(im.height * s);
          c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
          cb(c.toDataURL('image/jpeg', .86), im.width, im.height);
        };
        im.src = fr.result;
      };
      fr.readAsDataURL(file);
    }

    function bindImages() {
      $$('.edit-img, [data-img]').forEach(function (el) {
        if (el._bound) return;
        el._bound = true;
        el.addEventListener('click', function (e) {
          e.preventDefault();
          var path = el.dataset.img;
          if (!path) return;
          var inp = document.createElement('input');
          inp.type = 'file'; inp.accept = 'image/*';
          inp.onchange = function () {
            var f = inp.files && inp.files[0];
            if (!f) return;
            resizeToDataUrl(f, function (data, w, h) {
              var o = S.get(true);
              var rest = path.split('.');
              var lastIdx = +rest[rest.length - 1];
              var parentPath = rest.slice(0, -1).join('.');
              var cur = o, keys = parentPath.split('.');
              for (var i = 0; i < keys.length; i++) cur = cur[keys[i]];
              if (cur) {
                cur[lastIdx] = Object.assign({}, cur[lastIdx], { src: data, w: w, h: h });
                S.save(o);
                C = S.get(true);
                var imEl = el.tagName === 'IMG' ? el : el.querySelector('img');
                if (imEl) imEl.src = data;
              }
            });
          };
          inp.click();
        }, true);
      });
    }

    bar.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-act]');
      if (!b) return;
      var act = b.dataset.act;
      if (act === 'save') {
        alert('已保存到本机草稿。\n\n注意：草稿只在 ?edit=1 编辑模式下可见，正常浏览看到的是 data/content.js 里的版本。\n要让改动正式生效，请点「导出 content.js」，再用它覆盖 data/content.js。');
      } else if (act === 'export') {
        S.exportContent();
      } else if (act === 'admin') {
        location.href = 'editor.html';
      } else if (act === 'reset') {
        if (confirm('恢复成 data/content.js 的默认内容？本地草稿会被清空。')) {
          S.reset(); location.reload();
        }
      } else if (act === 'exit') {
        if (S.isDirty() && !confirm('你还有没导出的本机草稿。\n退出编辑后，网站会显示 data/content.js 里的版本（未导出的改动就看不到了）。\n\n确定退出？')) return;
        location.href = location.pathname + location.hash;
      }
    });

    /* 视图切换后重新绑定新生成的节点 */
    window.__rebindEdit = function () { bindText(); bindImages(); };
    bindText();
    bindImages();
  }

  /* ------------------------------------------------------------ 路由 */
  function parseRoute() {
    var raw = cleanHash().replace(/^#\/?/, '');
    var seg = raw.split('/').filter(Boolean);
    if (!seg.length) return { view: 'home' };
    if (seg[0] === 'works') return { view: 'works', part: seg[1] || '' };
    if (seg[0] === 'work') return { view: 'project', id: decodeURIComponent(seg[1] || '') };
    if (seg[0] === 'about') return { view: 'about' };
    if (seg[0] === 'contact') return { view: 'home', scrollTo: 'contact' };
    return { view: 'home' };
  }

  function show(view) {
    $$('.view').forEach(function (v) {
      v.classList.toggle('is-on', v.id === 'view-' + view);
    });
  }

  function route(first) {
    var r = parseRoute();
    current = r;

    if (r.view === 'works') currentFilter = r.part || 'all';
    if (r.view !== 'project') document.title = C.site.title || (C.site.name + ' · 设计作品集');

    show(r.view);
    renderChrome();

    if (r.view === 'home') renderHome();
    if (r.view === 'works') renderWorks();
    if (r.view === 'project') renderProject(r.id);
    if (r.view === 'about') renderAbout();

    if (window.__rebindEdit) window.__rebindEdit();

    if (r.scrollTo === 'contact') {
      var el = $('#contact');
      if (el) requestAnimationFrame(function () { el.scrollIntoView({ block: 'start' }); });
    } else if (!first) {
      window.scrollTo(0, 0);
    }
  }

  /* ------------------------------------------------------------ 启动 */
  initLightbox();
  initScroll();
  initEdit();
  route(true);
  window.addEventListener('hashchange', function () { route(false); });
})();
