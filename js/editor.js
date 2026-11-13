/* =========================================================================
   内容管理后台 —— 改文案、换图、增删作品、排序、导出
   所有改动先写入浏览器草稿（localStorage），导出后覆盖 data/content.js 才发布。
   ========================================================================= */

(function () {
  'use strict';

  var S = window.PortfolioStore;
  var C = S.get();
  var state = { view: 'site', sel: 0 };

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ---------------------------------------------------------- 路径读写 */
  function getPath(o, p) {
    var k = String(p).split('.'), cur = o;
    for (var i = 0; i < k.length; i++) { if (cur == null) return ''; cur = cur[k[i]]; }
    return cur == null ? '' : cur;
  }
  function setPath(o, p, val) {
    var k = String(p).split('.'), cur = o;
    for (var i = 0; i < k.length - 1; i++) {
      if (cur[k[i]] == null) cur[k[i]] = /^\d+$/.test(k[i + 1]) ? [] : {};
      cur = cur[k[i]];
    }
    cur[k[k.length - 1]] = val;
  }

  /* ---------------------------------------------------------- 保存 */
  var tid = null;
  function commit(now) {
    clearTimeout(tid);
    tid = setTimeout(function () {
      S.save(C);
      paintState();
    }, now ? 0 : 320);
  }
  function paintState() {
    var el = $('#ed-state');
    if (!el) return;
    el.innerHTML = S.isDirty()
      ? '当前显示：<b>本机草稿</b><br>后台和编辑模式都以此为准<br>导出并覆盖文件后网站才更新'
      : '当前显示：data/content.js 文件内容';
  }
  var ttid = null;
  function toast(msg) {
    var t = $('#toast');
    t.textContent = msg;
    t.classList.add('is-on');
    clearTimeout(ttid);
    ttid = setTimeout(function () { t.classList.remove('is-on'); }, 1900);
  }

  /* ---------------------------------------------------------- 表单构件 */
  function f(label, path, type, hint) {
    var val = getPath(C, path);
    var inner;
    if (type === 'area') {
      inner = '<textarea data-path="' + path + '" rows="' + (hint ? 5 : 3) + '">' + esc(val) + '</textarea>';
    } else {
      inner = '<input type="text" data-path="' + path + '" value="' + esc(val) + '">';
    }
    return '<div class="f"><label>' + label + '</label><div class="in">' + inner +
      (hint ? '<div class="hint">' + hint + '</div>' : '') + '</div></div>';
  }
  function frow(a, b) {
    return '<div class="f"><label></label><div class="in row2">' + a + b + '</div></div>';
  }
  function fs(title) { return '<div class="fs"><div class="t">' + title + '</div>'; }
  function fse() { return '</div>'; }

  /* ---------------------------------------------------------- 视图：站点 */
  function viewSite() {
    var h = fs('基本信息');
    h += f('中文名', 'site.name');
    h += f('英文名', 'site.nameEn');
    h += f('身份标签', 'site.role', 'text', '显示在导航栏右侧');
    h += f('学校', 'site.school');
    h += f('求职方向', 'site.intent');
    h += fse();

    h += fs('首页大标题（三行）');
    for (var i = 0; i < 3; i++) h += f('第 ' + (i + 1) + ' 行', 'site.heroLines.' + i, 'text', i === 1 ? '这一行会显示为描边空心字，并向右缩进' : '');
    h += fse();

    h += fs('首屏标签（三组小字）');
    for (var j = 0; j < 3; j++) h += f('第 ' + (j + 1) + ' 组', 'site.metaTags.' + j);
    h += fse();

    h += fs('首屏介绍');
    h += f('介绍段落', 'site.lede', 'area', '建议 60—100 字，说清你是谁、做了哪几类作品');
    h += f('分类小标', 'site.indexLabel');
    h += fse();

    h += fs('拼贴与精选区标题');
    h += f('拼贴标题', 'site.selectedTitle', 'text', '用 <br> 或换行控制断行');
    h += f('拼贴说明', 'site.selectedNote', 'area');
    h += f('精选标题', 'site.featuredTitle', 'text', '用 <br> 或换行控制断行');
    h += f('精选说明', 'site.featuredNote', 'area');
    h += fse();

    h += fs('关于与封底');
    h += f('关于小标', 'site.aboutLabel');
    h += f('关于标题', 'site.aboutTitle', 'text', '用 <br> 控制断行');
    h += f('关于正文 1', 'site.aboutText1', 'area');
    h += f('关于正文 2', 'site.aboutText2', 'area');
    h += f('封底大标', 'site.closingTitle');
    h += f('封底副标', 'site.closingText');
    h += f('封底小字', 'site.closingNote');
    h += fse();

    h += fs('拼贴选图');
    var opts = (C.projects || []).map(function (p, i) {
      return '<option value="' + esc(p.id) + '">' + esc(p.title) + '</option>';
    }).join('');
    for (var k = 0; k < 5; k++) {
      h += '<div class="f"><label>第 ' + (k + 1) + ' 张</label><div class="in">' +
        '<select data-path="site.collageIds.' + k + '"><option value="">（不指定）</option>' + opts + '</select></div></div>';
    }
    h += f('过渡大图项目', 'site.dividerId', 'text', '填项目 id，例如 xiangcun；留空则自动选第三个');
    h += fse();

    return h;
  }

  /* ---------------------------------------------------------- 视图：作品 */
  function viewProjects() {
    if (state.sel >= C.projects.length) state.sel = 0;
    var p = C.projects[state.sel];
    if (!p) return '<div class="fs"><div class="t">还没有作品</div><button class="btn" data-act="addproj">＋ 新建第一个项目</button></div>';

    var list = '<div class="ed-list"><div class="ed-list__h">作品列表 · ' + C.projects.length + ' 项</div>';
    C.projects.forEach(function (it, i) {
      list += '<div class="pitem' + (i === state.sel ? ' is-on' : '') + '" data-sel="' + i + '">' +
        '<span class="n">' + String(i + 1).padStart(2, '0') + '</span>' +
        '<span class="tt">' + esc(it.title || '未命名') + '</span></div>';
    });
    list += '<div style="padding:12px 6px 0"><button class="btn" data-act="addproj" style="width:100%">＋ 新建项目</button></div></div>';

    var i = state.sel;
    var partOpts = (C.parts || []).map(function (pt) {
      return '<option value="' + esc(pt.id) + '"' + (pt.id === p.part ? ' selected' : '') + '>' + esc(pt.label) + '</option>';
    }).join('');

    var h = '<div class="ed-pane">';
    h += '<div style="display:flex;gap:8px;margin-bottom:18px;flex-wrap:wrap">' +
      '<button class="btn" data-act="up">↑ 上移</button>' +
      '<button class="btn" data-act="down">↓ 下移</button>' +
      '<button class="btn" data-act="dup">复制一份</button>' +
      '<a class="btn" href="index.html#/work/' + encodeURIComponent(p.id) + '" target="_blank">预览 ↗</a>' +
      '<button class="btn danger" data-act="del" style="margin-left:auto">删除这个项目</button></div>';

    h += fs('基本信息');
    h += f('中文标题', 'projects.' + i + '.title');
    h += f('英文标题', 'projects.' + i + '.en', 'text', '会自动转成大写显示，建议全大写填写');
    h += '<div class="f"><label>所属板块</label><div class="in"><select data-path="projects.' + i + '.part">' + partOpts + '</select></div></div>';
    h += frow(
      '<div><label class="hint">年份</label><input type="text" data-path="projects.' + i + '.year" value="' + esc(p.year) + '"></div>',
      '<div><label class="hint">规格 / 载体</label><input type="text" data-path="projects.' + i + '.size" value="' + esc(p.size) + '"></div>'
    );
    h += f('工具', 'projects.' + i + '.tools');
    h += f('角色', 'projects.' + i + '.role');
    h += f('链接 id', 'projects.' + i + '.id', 'text', '英文短名，决定链接地址，不要重复');
    h += fse();

    h += fs('文案');
    h += f('一句话主张', 'projects.' + i + '.tagline', 'text', '显示在卡片和详情页标题下');
    h += f('导语', 'projects.' + i + '.summary', 'area', '一到两句，说清这件作品解决什么问题');
    h += f('补充说明', 'projects.' + i + '.note', 'area', '练习作品/临摹来源请写在这里，会显示为高亮提示块；不需要就留空');
    h += fse();

    h += fs('分段说明');
    (p.blocks || []).forEach(function (b, bi) {
      h += '<div class="block">' +
        '<div class="block__h">' +
          '<input type="text" data-path="projects.' + i + '.blocks.' + bi + '.k" value="' + esc(b.k) + '">' +
          '<span class="sp"></span>' +
          '<button class="mini" data-act="bup" data-i="' + bi + '" title="上移">↑</button>' +
          '<button class="mini" data-act="bdel" data-i="' + bi + '" title="删除">×</button>' +
        '</div>' +
        '<textarea data-path="projects.' + i + '.blocks.' + bi + '.v" rows="3">' + esc(b.v) + '</textarea>' +
      '</div>';
    });
    h += '<button class="btn" data-act="badd">＋ 增加一段说明</button>';
    h += fse();

    h += fs('作品图（第一张作为封面）');
    h += '<div class="imgs">';
    (p.images || []).forEach(function (im, ii) {
      h += '<div class="imgcard">' +
        '<div class="imgcard__ph"><img src="' + esc(S.asset(im.src, '.')) + '" alt=""></div>' +
        '<div class="imgcard__b">' +
          '<button data-act="imgup" data-i="' + ii + '">←</button>' +
          '<button data-act="imgrep" data-i="' + ii + '">换</button>' +
          '<button data-act="imgdel" data-i="' + ii + '">×</button>' +
        '</div>' +
        '<div style="padding:0 7px 7px"><input type="text" data-path="projects.' + i + '.images.' + ii + '.cap" value="' + esc(im.cap || '') + '" placeholder="图注" style="font-size:11.5px;padding:4px 6px"></div>' +
      '</div>';
    });
    h += '<button class="imgadd" data-act="imgadd"><b>＋</b><span>上传图片</span></button>';
    h += '</div>';
    h += fse();

    /* 细节图版 */
    var dets = p.details || [];
    h += fs('细节图版 · ' + dets.length + ' 张');
    h += '<div class="hint" style="margin-bottom:12px">这些图是从原图自动裁出来的局部，左侧定位框会跟着自动算。可以改标题和说明；不需要的可以删。要新增，需在 data/content.js 里加一条（含原图中的裁切框）。</div>';
    dets.forEach(function (d, di) {
      h += '<div class="block">' +
        '<div class="block__h">' +
          '<img src="' + esc(S.asset(d.src, '.')) + '" style="width:74px;height:54px;object-fit:cover;border-radius:4px;flex:0 0 auto" alt="">' +
          '<input type="text" data-path="projects.' + i + '.details.' + di + '.title" value="' + esc(d.title) + '">' +
          '<span class="sp"></span>' +
          '<button class="mini" data-act="detdel" data-i="' + di + '" title="删除这张">×</button>' +
        '</div>' +
        '<textarea data-path="projects.' + i + '.details.' + di + '.note" rows="2">' + esc(d.note) + '</textarea>' +
      '</div>';
    });
    if (!dets.length) h += '<div class="hint">这个项目还没有细节图版。</div>';
    h += fse();

    h += '</div>';
    return { list: list, pane: h };
  }

  /* ---------------------------------------------------------- 视图：关于 */
  function viewAbout() {
    var h = fs('头像与自述');
    var hasP = !!(C.about.portrait && String(C.about.portrait).trim());
    h += '<div class="f"><label>照片</label><div class="in">' +
      '<div style="display:flex;gap:12px;align-items:flex-start">' +
        (hasP
          ? '<div class="imgcard" style="width:110px"><div class="imgcard__ph"><img src="' + esc(S.asset(C.about.portrait, '.')) + '" alt=""></div></div>'
          : '<div style="width:110px;aspect-ratio:1/1.2;border:1px dashed var(--line);border-radius:8px;display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:11.5px;text-align:center">未设置<br>照片</div>') +
        '<div style="display:flex;flex-direction:column;gap:8px">' +
          '<button class="btn" data-act="portrait">' + (hasP ? '更换照片' : '上传照片') + '</button>' +
          (hasP ? '<button class="btn danger" data-act="portraitdel">删除照片</button>' : '') +
        '</div>' +
      '</div><div class="hint">可以不放照片。不设置时，关于页会自动改成单列排版，不会留空框。</div></div></div>';
    h += f('自我介绍', 'about.intro', 'area', '两到三句，写你的来历与关注点');
    h += fse();

    h += fs('信息条目');
    (C.about.facts || []).forEach(function (x, i) {
      h += '<div class="block"><div class="block__h">' +
        '<input type="text" data-path="about.facts.' + i + '.k" value="' + esc(x.k) + '" style="flex:0 0 100px">' +
        '<span class="sp"></span><button class="mini" data-act="factdel" data-i="' + i + '">×</button></div>' +
        '<textarea data-path="about.facts.' + i + '.v" rows="2">' + esc(x.v) + '</textarea></div>';
    });
    h += '<button class="btn" data-act="factadd">＋ 增加一条</button>';
    h += fse();

    h += fs('实践线索（关于页时间线）');
    (C.about.timeline || []).forEach(function (t, i) {
      h += '<div class="block"><div class="block__h">' +
        '<input type="text" data-path="about.timeline.' + i + '.y" value="' + esc(t.y) + '" style="flex:0 0 80px">' +
        '<input type="text" data-path="about.timeline.' + i + '.t" value="' + esc(t.t) + '">' +
        '<span class="sp"></span><button class="mini" data-act="tldel" data-i="' + i + '">×</button></div>' +
        '<textarea data-path="about.timeline.' + i + '.d" rows="2">' + esc(t.d) + '</textarea></div>';
    });
    h += '<button class="btn" data-act="tladd">＋ 增加一条</button>';
    h += fse();
    return h;
  }

  /* ---------------------------------------------------------- 视图：联系 */
  function viewContact() {
    var h = fs('联系方式');
    h += f('姓名', 'contact.name');
    h += f('电话', 'contact.tel');
    h += f('邮箱', 'contact.email');
    h += f('微信', 'contact.wechat', 'text', '不需要就留空，空行不会显示');
    h += f('城市', 'contact.city');
    h += f('作品集来源', 'contact.source');
    h += fse();
    h += fs('页面 meta（影响分享与搜索）');
    h += f('网页标题', 'site.title');
    h += f('网页描述', 'site.desc', 'area');
    h += fse();
    return h;
  }

  /* ---------------------------------------------------------- 视图：板块 */
  function viewParts() {
    var h = fs('作品分类板块');
    (C.parts || []).forEach(function (p, i) {
      var n = C.projects.filter(function (x) { return x.part === p.id; }).length;
      h += '<div class="block"><div class="block__h">' +
        '<input type="text" data-path="parts.' + i + '.label" value="' + esc(p.label) + '" style="flex:0 0 130px">' +
        '<input type="text" data-path="parts.' + i + '.en" value="' + esc(p.en) + '">' +
        '<span class="sp"></span><button class="mini" data-act="partdel" data-i="' + i + '" title="删除">×</button></div>' +
        '<input type="text" data-path="parts.' + i + '.desc" value="' + esc(p.desc) + '" placeholder="一句话说明" style="margin-bottom:6px">' +
        '<div class="hint">id：' + esc(p.id) + ' · 已收录 ' + n + ' 个作品</div></div>';
    });
    h += '<button class="btn" data-act="partadd">＋ 增加板块</button>';
    h += fse();
    return h;
  }

  /* ---------------------------------------------------------- 发布到 GitHub */
  function viewPublish() {
    var P = window.PortfolioPublish;
    var c = (P && P.cfg()) || {};

    /* 没填过仓库时，用当前网址推断一个填进去（本机 file:// 打开时推断为空） */
    if (P && !c.repo) {
      var guess = P.guessRepo();
      if (guess) { c.repo = guess; P.saveCfg({ repo: guess, branch: c.branch || 'main', token: c.token || '' }); }
    }
    var h = '';

    h += '<p class="hint" style="margin:0 0 20px">填一次仓库信息，以后每次改完点「立即发布」。' +
         '内容会直接提交进 GitHub 仓库，网站大约 1 分钟后自动更新——不需要再导出文件、也不用重传图片。</p>';

    h += '<div class="f"><label>仓库</label><div class="in">' +
      '<input type="text" data-cfg="repo" placeholder="用户名/仓库名，例如 wuwenbo/wu-wenbo-portfolio" value="' + esc(c.repo || '') + '">' +
      '<div class="hint">可以直接粘 github.com 上那个完整网址，会自动识别</div>' +
    '</div></div>';

    h += '<div class="f"><label>分支</label><div class="in">' +
      '<input type="text" data-cfg="branch" placeholder="main" value="' + esc(c.branch || 'main') + '">' +
      '<div class="hint">一般就是 main，不确定就别动</div>' +
    '</div></div>';

    h += '<div class="f"><label>访问令牌</label><div class="in">' +
      '<input type="password" data-cfg="token" placeholder="github_pat_…" value="' + esc(c.token || '') + '">' +
      '<div class="hint">只保存在这台设备的浏览器里，不会发到 GitHub 以外的地方</div>' +
    '</div></div>';

    h += '<div class="pub-actions">' +
      '<button class="btn" data-pub="test">测试连接</button>' +
      '<button class="btn primary" data-pub="go">立即发布</button>' +
      '<button class="btn" data-pub="pull">载入线上最新</button>' +
    '</div>';

    h += '<div class="pub-log" id="pub-log">还没有操作。</div>';

    h += '<details class="pub-help"><summary>怎么生成令牌？（点开看）</summary><ol>' +
      '<li>打开 github.com/settings/personal-access-tokens/new</li>' +
      '<li><b>Token name</b> 随便写，比如 portfolio-editor</li>' +
      '<li><b>Expiration</b> 选 90 days 或更长</li>' +
      '<li><b>Repository access</b> 选 Only select repositories，只勾你这个作品集仓库</li>' +
      '<li><b>Permissions</b> 展开 Repository permissions：' +
        '<code>Contents</code> 设为 Read and write，<code>Pages</code> 设为 Read and write</li>' +
      '<li>点 Generate token，复制那串 github_pat_… 粘到上面</li>' +
      '</ol><p class="hint">令牌等于仓库的钥匙，贴进这里就够了，不要发到聊天、邮件或截图里。' +
      '换电脑或清过浏览器缓存后需要重新填一次。</p></details>';

    return h;
  }

  function bindPublish() {
    var P = window.PortfolioPublish;
    if (!P) {
      var box0 = $('#pub-log');
      if (box0) box0.innerHTML = '<div class="bad">发布模块没加载，检查 js/publish.js 是否存在</div>';
      return;
    }

    /* 配置随打随存 */
    $$('[data-cfg]').forEach(function (el) {
      el.addEventListener('input', function () {
        var c = P.cfg();
        c[el.dataset.cfg] = el.value.trim();
        P.saveCfg(c);
      });
    });

    var lines = [];
    function log(msg, cls) {
      lines.push({ m: msg, c: cls || '' });
      var box = $('#pub-log');
      if (!box) return;
      box.innerHTML = lines.map(function (l) {
        return '<div class="' + l.c + '">' + esc(l.m) + '</div>';
      }).join('');
      box.scrollTop = box.scrollHeight;
    }

    $$('[data-pub]').forEach(function (btn) {
      btn.addEventListener('click', async function () {
        if (btn.disabled) return;
        var act = btn.dataset.pub;
        var label = btn.textContent;

        if (act === 'go') {
          if (!confirm('把当前编辑的内容发布到线上？\n\n提交后大约 1 分钟，网站对外更新。')) return;
        }
        if (act === 'pull') {
          if (!confirm('用线上仓库的内容覆盖当前草稿？\n\n本地还没发布的改动会丢失。')) return;
        }

        btn.disabled = true;
        btn.textContent = '处理中…';
        if (act !== 'go') lines = [];

        try {
          if (act === 'test') {
            var cfgNow = P.cfg();
            log('仓库：' + (cfgNow.repo || '（未填写）'));
            log('分支：' + (cfgNow.branch || 'main'));
            var info = await P.check();
            log('连接成功 — ' + info.repo + ' @ ' + info.branch, 'ok');
            log('data/content.js 现有 ' + Math.round(info.contentSize / 1024) + ' KB');
            log('Pages：' + (info.pages ? '已启用' : '没检测到，去 Settings → Pages 打开'), info.pages ? 'ok' : 'warn');

          } else if (act === 'go') {
            var draft = JSON.parse(JSON.stringify(C));
            var r = await P.publish(draft, log);
            if (r.skipped) {
              log('线上内容与当前一致，没有提交。', 'ok');
            } else {
              C = draft;
              S.save(C);
              log('发布成功，提交号 ' + r.commit, 'ok');
              if (r.uploaded) log('本次新上传 ' + r.uploaded + ' 张图片');
              log('GitHub Pages 正在重建，约 1 分钟后刷新网站即可看到。');
              render();
            }

          } else if (act === 'pull') {
            var got = await P.pull();
            S.save(got.data);
            C = S.get(true);
            state.sel = 0;
            render();
            toast('已载入线上最新内容');
          }
        } catch (err) {
          log('失败：' + err.message, 'bad');
          if (err.status === 401) log('令牌无效或已过期，重新生成一个再填。', 'bad');
          if (err.status === 403) log('令牌权限不够，Contents 需要 Read and write。', 'bad');
          if (err.status === 404) log('仓库或分支找不到，检查用户名/仓库名是否写对。', 'bad');
          if (err.status === 409) log('线上刚被改动过。先点「载入线上最新」，确认后再发布。', 'bad');
        } finally {
          btn.disabled = false;
          btn.textContent = label;
        }
      });
    });
  }

  /* ---------------------------------------------------------- 渲染 */
  var NAV = [
    { id: 'site', label: '站点信息' },
    { id: 'projects', label: '作品' },
    { id: 'about', label: '关于页' },
    { id: 'parts', label: '作品分类' },
    { id: 'contact', label: '联系方式' },
    { id: 'publish', label: '发布' }
  ];

  function render() {
    $('#ed-nav').innerHTML = NAV.map(function (n) {
      var extra = n.id === 'projects' ? '<em>' + C.projects.length + '</em>' : '';
      return '<button data-view="' + n.id + '"' + (state.view === n.id ? ' class="is-on"' : '') + '>' +
        n.label + extra + '</button>';
    }).join('');

    var body = $('#ed-body');
    var title = $('#ed-title');
    var nav = NAV.filter(function (n) { return n.id === state.view; })[0];

    if (state.view === 'projects') {
      var v = viewProjects();
      title.innerHTML = '作品 <span>点左侧选一个项目，改完自动存草稿</span>';
      if (typeof v === 'string') { body.className = 'ed-body'; body.innerHTML = v; }
      else {
        body.className = 'ed-body split';
        body.innerHTML = v.list + v.pane;
      }
    } else {
      body.className = 'ed-body';
      title.innerHTML = nav.label + (state.view === 'site' ? ' <span>首页文案都在这里</span>' : '');
      if (state.view === 'site') body.innerHTML = viewSite();
      if (state.view === 'about') body.innerHTML = viewAbout();
      if (state.view === 'contact') body.innerHTML = viewContact();
      if (state.view === 'parts') body.innerHTML = viewParts();
      if (state.view === 'publish') body.innerHTML = viewPublish();
    }
    bindInputs();
    if (state.view === 'publish') bindPublish();
    paintState();
  }

  function bindInputs() {
    $$('[data-path]').forEach(function (el) {
      var ev = el.tagName === 'SELECT' ? 'change' : 'input';
      el.addEventListener(ev, function () {
        var path = el.dataset.path;
        var val = el.value;
        /* 板块 id 不可改，其余照写 */
        setPath(C, path, val);
        commit();
      });
    });
  }

  /* ---------------------------------------------------------- 图片 */
  var pending = null;

  function resize(file, cb) {
    var fr = new FileReader();
    fr.onload = function () {
      var im = new Image();
      im.onload = function () {
        var MAX = 1800;
        var s = Math.min(1, MAX / Math.max(im.width, im.height));
        var c = document.createElement('canvas');
        c.width = Math.round(im.width * s);
        c.height = Math.round(im.height * s);
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        cb(c.toDataURL('image/jpeg', .86), im.width, im.height);
      };
      im.src = fr.result;
    };
    fr.readAsDataURL(file);
  }

  $('#file-in').addEventListener('change', function () {
    var f = this.files && this.files[0];
    this.value = '';
    if (!f || !pending) return;
    var act = pending;
    pending = null;
    resize(f, function (data, w, h) {
      var p = C.projects[state.sel];
      if (act.type === 'add') {
        p.images = p.images || [];
        p.images.push({ src: data, w: w, h: h, cap: '' });
      } else if (act.type === 'replace') {
        var im = p.images[act.i];
        im.src = data; im.w = w; im.h = h;
      } else if (act.type === 'portrait') {
        C.about.portrait = data;
      }
      commit(true);
      render();
      toast('图片已加入草稿');
    });
  });

  /* ---------------------------------------------------------- 交互 */
  document.addEventListener('click', function (e) {
    var navBtn = e.target.closest('[data-view]');
    if (navBtn) { state.view = navBtn.dataset.view; render(); $('#ed-body').scrollTop = 0; return; }

    var sel = e.target.closest('[data-sel]');
    if (sel) { state.sel = +sel.dataset.sel; render(); return; }

    var b = e.target.closest('[data-act]');
    if (!b) return;
    var act = b.dataset.act;
    var i = b.dataset.i != null ? +b.dataset.i : 0;
    var p = C.projects[state.sel];

    switch (act) {
      case 'addproj':
        var np = {
          id: 'work-' + Date.now().toString().slice(-5),
          part: (C.parts[0] || {}).id || 'info',
          title: '新项目', en: 'NEW PROJECT', year: new Date().getFullYear() + '',
          tools: '', role: '', size: '', tagline: '', summary: '', note: '',
          blocks: [{ k: '设计动作', v: '' }],
          images: []
        };
        C.projects.push(np);
        state.sel = C.projects.length - 1;
        state.view = 'projects';
        commit(true); render(); toast('已新建项目，记得补作品图');
        break;
      case 'del':
        if (!confirm('删除「' + (p.title || '这个项目') + '」？本地草稿里将不再包含它。')) return;
        C.projects.splice(state.sel, 1);
        state.sel = Math.max(0, state.sel - 1);
        commit(true); render();
        break;
      case 'dup':
        var cp = JSON.parse(JSON.stringify(p));
        cp.id = p.id + '-copy';
        cp.title = p.title + '（副本）';
        C.projects.splice(state.sel + 1, 0, cp);
        state.sel++;
        commit(true); render();
        break;
      case 'up':
        if (state.sel > 0) { var a = C.projects[state.sel]; C.projects.splice(state.sel, 1); C.projects.splice(state.sel - 1, 0, a); state.sel--; commit(true); render(); }
        break;
      case 'down':
        if (state.sel < C.projects.length - 1) { var c2 = C.projects[state.sel]; C.projects.splice(state.sel, 1); C.projects.splice(state.sel + 1, 0, c2); state.sel++; commit(true); render(); }
        break;
      case 'badd':
        p.blocks = p.blocks || []; p.blocks.push({ k: '小标题', v: '' }); commit(true); render(); break;
      case 'bdel':
        p.blocks.splice(i, 1); commit(true); render(); break;
      case 'bup':
        if (i > 0) { var t = p.blocks[i]; p.blocks.splice(i, 1); p.blocks.splice(i - 1, 0, t); commit(true); render(); }
        break;
      case 'imgadd':
        pending = { type: 'add' }; $('#file-in').click(); break;
      case 'imgrep':
        pending = { type: 'replace', i: i }; $('#file-in').click(); break;
      case 'imgdel':
        p.images.splice(i, 1); commit(true); render(); break;
      case 'imgup':
        if (i > 0) { var im = p.images[i]; p.images.splice(i, 1); p.images.splice(i - 1, 0, im); commit(true); render(); }
        break;
      case 'detdel':
        if (!confirm('删除第 ' + (i + 1) + ' 张细节图版？（图片文件仍在 assets 里）')) return;
        p.details.splice(i, 1); commit(true); render();
        break;
      case 'portrait':
        pending = { type: 'portrait' }; $('#file-in').click(); break;
      case 'portraitdel':
        if (!confirm('删除关于页的照片？（原始照片在你自己的作品集 PPTX 里还有）')) return;
        C.about.portrait = '';
        commit(true); render(); toast('已移除照片');
        break;
      case 'factadd':
        C.about.facts.push({ k: '新条目', v: '' }); commit(true); render(); break;
      case 'factdel':
        C.about.facts.splice(i, 1); commit(true); render(); break;
      case 'tladd':
        C.about.timeline.push({ y: '', t: '', d: '' }); commit(true); render(); break;
      case 'tldel':
        C.about.timeline.splice(i, 1); commit(true); render(); break;
      case 'partadd':
        C.parts.push({ id: 'part-' + Date.now().toString().slice(-4), label: '新板块', en: 'NEW SECTION', desc: '', range: '' });
        commit(true); render(); break;
      case 'partdel':
        var pid = C.parts[i].id;
        var used = C.projects.filter(function (x) { return x.part === pid; }).length;
        if (used) { alert('这个板块下还有 ' + used + ' 个作品，先把它们改到别的板块再删。'); return; }
        C.parts.splice(i, 1); commit(true); render(); break;
    }
  });

  /* ---------------------------------------------------------- 顶部动作 */
  $('#btn-export').addEventListener('click', function () {
    S.save(C);
    S.exportContent();
    toast('已导出 content.js，用它覆盖 data/content.js 即可发布');
  });

  $('#btn-reset').addEventListener('click', function () {
    if (!confirm('清空本地草稿，恢复成 data/content.js 里的内容？')) return;
    S.reset();
    C = S.get();
    state.sel = 0;
    render();
    toast('已恢复默认内容');
  });

  $('#btn-import').addEventListener('click', function () { $('#json-in').click(); });
  $('#json-in').addEventListener('change', function () {
    var f = this.files && this.files[0];
    this.value = '';
    if (!f) return;
    var fr = new FileReader();
    fr.onload = function () {
      try {
        C = S.importSource(fr.result);
        state.sel = 0;
        render();
        toast('导入成功');
      } catch (err) {
        alert('导入失败：' + err.message);
      }
    };
    fr.readAsText(f);
  });

  /* ---------------------------------------------------------- 启动 */
  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 's') { e.preventDefault(); S.save(C); toast('已保存草稿'); }
  });
  window.addEventListener('beforeunload', function () { S.save(C); });

  var hash = (location.hash || '').replace('#', '');
  if (hash && NAV.some(function (n) { return n.id === hash; })) state.view = hash;

  render();
})();
