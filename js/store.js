/* =========================================================================
   内容仓库：默认数据 → 本地草稿 → 导出
   -------------------------------------------------------------------------
   优先级：localStorage 草稿 > data/content.js 默认数据
   编辑模式下的所有改动都先落在草稿里，点「导出」才生成新的 content.js。
   ========================================================================= */

(function () {
  'use strict';

  var KEY = 'wwb.portfolio.draft.v1';
  var clone = function (o) { return JSON.parse(JSON.stringify(o)); };

  function defaults() {
    return clone(window.SITE_CONTENT || { site: {}, contact: {}, about: {}, parts: [], projects: [] });
  }

  function readDraft() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var o = JSON.parse(raw);
      if (!o || !o.projects) return null;
      return o;
    } catch (e) { return null; }
  }

  function writeDraft(o) {
    try { localStorage.setItem(KEY, JSON.stringify(o)); return true; }
    catch (e) {
      alert('草稿保存失败：浏览器存储空间已满。\n常见原因是上传的图片太大，建议先把图片压到 1MB 以内再上传。');
      return false;
    }
  }

  /* useDraft = false 时强制用文件内容（供前台正常浏览使用）
     这样浏览器里残留的旧草稿永远不会影响访客看到的内容 */
  function get(useDraft) {
    if (useDraft === false) return defaults();
    return readDraft() || defaults();
  }

  function saveAll(o) { return writeDraft(o); }

  function set(path, val) {
    var o = get();
    var seg = String(path).split('.');
    var cur = o;
    for (var i = 0; i < seg.length - 1; i++) {
      var k = seg[i];
      if (cur[k] == null) cur[k] = /^\d+$/.test(seg[i + 1]) ? [] : {};
      cur = cur[k];
    }
    cur[seg[seg.length - 1]] = val;
    writeDraft(o);
    return o;
  }

  function reset() {
    try { localStorage.removeItem(KEY); } catch (e) {}
  }

  function isDirty() { return !!readDraft(); }

  /* 生成可独立运行的 content.js 文本 */
  function toSource(o) {
    var head = [
      '/* =========================================================================',
      ' * 吴文博 · 设计作品集 — 全站唯一内容源',
      ' * 本文件由站内编辑器导出 ' + new Date().toLocaleString('zh-CN'),
      ' * 直接用本文件覆盖 data/content.js 即可发布。',
      ' * ========================================================================= */',
      '',
      'window.SITE_CONTENT = '
    ].join('\n');
    return head + JSON.stringify(o, null, 2) + ';\n';
  }

  function download(filename, text) {
    var blob = new Blob([text], { type: 'text/javascript;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 400);
  }

  function exportContent() {
    download('content.js', toSource(get()));
  }

  function exportJSON() {
    download('portfolio-content.json', JSON.stringify(get(), null, 2));
  }

  /* 从导出的文件回灌（供编辑器「导入」使用） */
  function importSource(text) {
    var m = String(text).match(/\{[\s\S]*\}/);
    if (!m) throw new Error('没有在文件里找到数据对象');
    var o = JSON.parse(m[0]);
    if (!o.projects || !o.projects.length) throw new Error('数据结构不对：缺少 projects');
    writeDraft(o);
    return o;
  }

  /* 相对路径 → 实际可用地址（兼容 data: 与 http） */
  function asset(p, base) {
    if (!p) return '';
    if (/^(data:|blob:|https?:)/.test(p)) return p;
    return (base || '.') + '/' + p.replace(/^\.?\//, '');
  }

  window.PortfolioStore = {
    KEY: KEY,
    get: get,
    set: set,
    save: saveAll,
    reset: reset,
    isDirty: isDirty,
    exportContent: exportContent,
    exportJSON: exportJSON,
    importSource: importSource,
    toSource: toSource,
    download: download,
    asset: asset
  };
})();
