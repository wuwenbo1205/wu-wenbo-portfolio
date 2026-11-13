/* =========================================================================
   发布到 GitHub —— 把编辑器里的内容提交进仓库，由 GitHub Pages 自动上线
   -------------------------------------------------------------------------
   改动不进这里，只负责「写回仓库」这一件事：
     1. 把 content 里内嵌的 data:image 抽出来，单独上传成图片文件
     2. 用路径替换掉那些超长的 base64
     3. 提交 data/content.js
     4. GitHub Pages 收到提交后自动重建，约 1 分钟对外生效

   令牌只存在你自己浏览器的 localStorage 里，不会发到除 api.github.com 以外的地方。
   ========================================================================= */

(function () {
  'use strict';

  var CFG_KEY = 'wwb.gh.config.v1';
  var API = 'https://api.github.com';
  var CONTENT_PATH = 'data/content.js';
  var UPLOAD_DIR = 'assets/uploads';

  /* ------------------------------------------------------------ 配置 */
  function cfg() {
    try {
      var o = JSON.parse(localStorage.getItem(CFG_KEY) || '{}');
      return o && typeof o === 'object' ? o : {};
    } catch (e) { return {}; }
  }

  function saveCfg(o) {
    try { localStorage.setItem(CFG_KEY, JSON.stringify(o)); return true; }
    catch (e) { return false; }
  }

  /* 网址里的中文会变成 %E4%BD%9C... 这种转义，先还原成人能读的字符 */
  function decodeSafe(v) {
    try { return decodeURIComponent(v); }
    catch (e) { return v; }
  }

  /* 接受 "用户名/仓库名" 或直接粘 github.com 的网址 */
  function parseRepo(s) {
    s = String(s == null ? '' : s).trim();
    if (!s) return null;
    s = decodeSafe(s);
    var m = s.match(/github\.com\/([^\/\s]+)\/([^\/\s?#]+)/i);
    if (m) return { owner: m[1], repo: m[2].replace(/\.git$/i, '') };
    var p = s.replace(/^\/+|\/+$/g, '').split('/');
    if (p.length === 2 && p[0] && p[1]) return { owner: p[0], repo: p[1].replace(/\.git$/i, '') };
    return null;
  }

  /* 编辑器就部署在 <用户名>.github.io/<仓库名>/ 下面，
     所以仓库地址可以从当前网址直接推出来，省得手填、也避免拼错。 */
  function guessRepo() {
    var h = location.hostname;
    var parts = location.pathname.split('/').filter(Boolean);
    if (/\.github\.io$/i.test(h)) {
      var owner = h.split('.')[0];
      /* 仓库名可能含中文，网址里是百分号转义，必须还原后再用 */
      var repo = parts.length ? decodeSafe(parts[0]) : owner + '.github.io';
      return owner + '/' + repo;
    }
    return '';
  }

  /* ------------------------------------------------------------ 请求 */
  function req(method, url, token, body) {
    var h = { 'Accept': 'application/vnd.github+json' };
    if (token) h['Authorization'] = 'Bearer ' + token;
    if (body) h['Content-Type'] = 'application/json';

    return fetch(url, {
      method: method,
      headers: h,
      body: body ? JSON.stringify(body) : undefined
    }).then(function (r) {
      return r.text().then(function (t) {
        var j = null;
        try { j = JSON.parse(t); } catch (e) { /* 有些响应不是 JSON */ }
        if (r.ok) return j;
        var e = new Error((j && j.message) || ('HTTP ' + r.status));
        e.status = r.status;
        e.data = j;
        throw e;
      });
    });
  }

  function api(path, token) { return API + path; }

  /* 仓库名里可能有中文，拼路径时必须转义，否则请求会落到错的地址上 */
  function repoBase(repo) {
    return API + '/repos/' + encodeURIComponent(repo.owner) + '/' + encodeURIComponent(repo.repo);
  }

  /* ------------------------------------------------------------ 编码 */
  /* UTF-8 安全的 base64：btoa 只吃 latin1，中文直接塞会报错 */
  function b64encodeText(str) {
    var bytes = new TextEncoder().encode(str);
    var bin = '';
    var CH = 0x8000;
    for (var i = 0; i < bytes.length; i += CH) {
      bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CH));
    }
    return btoa(bin);
  }

  function b64decodeText(b64) {
    var bin = atob(String(b64).replace(/\s/g, ''));
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder('utf-8').decode(bytes);
  }

  /* 简易 FNV-1a，用来给图片生成稳定的文件名，避免重复上传 */
  function hashStr(s) {
    var h = 0x811c9dc5;
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
    }
    return ('0000000' + h.toString(16)).slice(-8);
  }

  function extOf(dataUrl) {
    var m = /^data:image\/([a-z0-9+.-]+)/i.exec(dataUrl);
    var t = m ? m[1].toLowerCase() : 'jpeg';
    if (t === 'jpeg') return 'jpg';
    if (t === 'svg+xml') return 'svg';
    return t;
  }

  /* ------------------------------------------------------------ 遍历 */
  /* 找出所有内嵌图片，并把它们换成给定映射里的路径 */
  function collectDataUrls(node, set) {
    if (typeof node === 'string') {
      if (/^data:image\//i.test(node)) set.add(node);
      return;
    }
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      for (var i = 0; i < node.length; i++) collectDataUrls(node[i], set);
      return;
    }
    for (var k in node) {
      if (Object.prototype.hasOwnProperty.call(node, k)) collectDataUrls(node[k], set);
    }
  }

  function replaceDataUrls(node, map) {
    if (typeof node === 'string') return map.has(node) ? map.get(node) : node;
    if (!node || typeof node !== 'object') return node;
    if (Array.isArray(node)) {
      for (var i = 0; i < node.length; i++) node[i] = replaceDataUrls(node[i], map);
      return node;
    }
    for (var k in node) {
      if (Object.prototype.hasOwnProperty.call(node, k)) node[k] = replaceDataUrls(node[k], map);
    }
    return node;
  }

  /* ------------------------------------------------------------ 基础操作 */
  function getFile(repo, path, branch, token) {
    var url = repoBase(repo) + '/contents/' + path + '?ref=' + encodeURIComponent(branch);
    return req('GET', url, token);
  }

  function putFile(repo, path, branch, token, contentB64, message, sha) {
    var url = repoBase(repo) + '/contents/' + path;
    var body = { message: message, content: contentB64, branch: branch };
    if (sha) body.sha = sha;
    return req('PUT', url, token, body);
  }

  /* 拿当前仓库状态，顺便验证仓库名、分支、令牌三样都对 */
  async function check() {
    var c = cfg();
    var repo = parseRepo(c.repo);
    if (!repo) throw new Error('仓库没填对。应该是「用户名/仓库名」，例如 wuwenbo/wu-wenbo-portfolio');
    if (!c.token) throw new Error('还没填访问令牌');
    var branch = c.branch || 'main';

    var info = await req('GET', repoBase(repo), c.token);

    var file = null;
    try {
      file = await getFile(repo, CONTENT_PATH, branch, c.token);
    } catch (e) {
      if (e.status !== 404) throw e;
    }

    return {
      repo: repo.owner + '/' + repo.repo,
      branch: branch,
      private: !!info.private,
      pages: info.has_pages !== false,
      contentSha: file ? file.sha : null,
      contentSize: file ? file.size : 0
    };
  }

  /* 把线上仓库里的 content.js 取回来，供「载入最新」用 */
  async function pull() {
    var c = cfg();
    var repo = parseRepo(c.repo);
    if (!repo) throw new Error('仓库没填对');
    if (!c.token) throw new Error('还没填令牌');
    var branch = c.branch || 'main';

    var file = await getFile(repo, CONTENT_PATH, branch, c.token);
    var text = b64decodeText(file.content);
    var m = text.match(/\{[\s\S]*\}/);
    if (!m) throw new Error('仓库里的 content.js 格式不对');
    return { data: JSON.parse(m[0]), sha: file.sha };
  }

  /* ------------------------------------------------------------ 发布 */
  async function publish(content, onLog) {
    var log = onLog || function () {};
    var c = cfg();
    var repo = parseRepo(c.repo);
    if (!repo) throw new Error('仓库没填对。应该是「用户名/仓库名」');
    if (!c.token) throw new Error('还没填访问令牌');
    var branch = c.branch || 'main';

    log('检查仓库…');
    var online = await getFile(repo, CONTENT_PATH, branch, c.token).catch(function (e) {
      if (e.status === 404) return null;
      throw e;
    });
    log('仓库连通，分支 ' + branch);

    /* 1. 抽出内嵌图片 */
    var set = new Set();
    collectDataUrls(content, set);
    var map = new Map();
    var list = Array.from(set);
    var uploaded = 0;
    var reused = 0;

    for (var i = 0; i < list.length; i++) {
      var dataUrl = list[i];
      var name = hashStr(dataUrl) + '.' + extOf(dataUrl);
      var path = UPLOAD_DIR + '/' + name;
      var raw = dataUrl.slice(dataUrl.indexOf(',') + 1);

      log('上传图片 ' + (i + 1) + '/' + list.length + '：' + name);

      var exist = await getFile(repo, path, branch, c.token).catch(function (e) {
        if (e.status === 404) return null;
        throw e;
      });

      if (exist && exist.sha) {
        reused++;
      } else {
        await putFile(repo, path, branch, c.token, raw, '上传图片 ' + name);
        uploaded++;
      }
      map.set(dataUrl, path);
    }

    if (list.length) {
      replaceDataUrls(content, map);
      log('图片处理完成：新上传 ' + uploaded + ' 张，已存在 ' + reused + ' 张');
    }

    /* 2. 提交 content.js */
    var src = buildSource(content);
    var sha = online ? online.sha : null;

    if (sha) {
      /* 先比一下线上内容，避免把别人（或另一台设备）刚发布的覆盖掉 */
      var onlineText = b64decodeText(online.content);
      var om = onlineText.match(/\{[\s\S]*\}/);
      if (om) {
        var onlineData = JSON.parse(om[0]);
        var same = JSON.stringify(onlineData) === JSON.stringify(content);
        if (same) {
          log('内容与线上完全一致，不需要提交。');
          return { skipped: true, uploaded: uploaded, reused: reused };
        }
      }
    }

    log('提交 data/content.js…');
    var res = await putFile(
      repo, CONTENT_PATH, branch, c.token, b64encodeText(src),
      '更新作品集内容 ' + new Date().toLocaleString('zh-CN'),
      sha
    );

    return {
      skipped: false,
      uploaded: uploaded,
      reused: reused,
      commit: res && res.commit ? res.commit.sha.slice(0, 7) : '',
      url: res && res.commit ? res.commit.html_url : ''
    };
  }

  /* 和 store.js 的 toSource 保持同一格式，避免每次提交都整文件重排 */
  function buildSource(o) {
    var head = [
      '/* =========================================================================',
      ' * 吴文博 · 设计作品集 — 全站唯一内容源',
      ' * 本文件由「发布到 GitHub」自动提交 ' + new Date().toLocaleString('zh-CN'),
      ' * ========================================================================= */',
      '',
      'window.SITE_CONTENT = '
    ].join('\n');
    return head + JSON.stringify(o, null, 2) + ';\n';
  }

  window.PortfolioPublish = {
    cfg: cfg,
    saveCfg: saveCfg,
    guessRepo: guessRepo,
    parseRepo: parseRepo,
    check: check,
    pull: pull,
    publish: publish
  };
})();
