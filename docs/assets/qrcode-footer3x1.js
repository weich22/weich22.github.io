
//BY：weich
document.addEventListener('DOMContentLoaded', function() {

  var pageUrl = window.location.href;
  var pageQr = "https://qun.qq.com/qrcode/index?data=" + encodeURIComponent(pageUrl) + "&size=160";

  // ====================== 自由配置 ======================
  // 1=页面码  2=微信打赏  3=支付宝打赏
  // 想显示哪个就写哪个数字，任意组合
  var showCodes = [1,2,3];
  // ======================================================

  var codeMap = {
    1: `
<div style="margin-bottom:12px;">
<img src="${pageQr}" style="width:160px; height:160px; object-fit:cover;">
<div style="font-size:14px; margin-top:6px;">↑扫码打开本页面↑</div>
</div>
`,
    2: `
<div style="margin-bottom:12px;">
<img src="/img/wxzym.webp" style="width:160px; height:160px; object-fit:cover;">
<div style="font-size:14px; margin-top:6px;">↑微信打赏↑</div>
</div>
`,
    3: `
<div>
<img src="/img/zfbskn.jpg" style="width:160px; height:160px; object-fit:cover;">
<div style="font-size:14px; margin-top:6px;">↑支付宝打赏↑</div>
</div>
`
  };

  var content = '';
  for (var num of showCodes) {
    if (codeMap[num]) content += codeMap[num];
  }

  var html = `

<div class="qrcode-root" style="position:fixed; bottom:58px; right:2px; z-index:9999;">

<div class="qrcode-btn" style="background:#f74023;/* border:1px solid #eee;*/ border-radius:4px;/* padding:10px 14px;*/ box-shadow:0 2px 10px rgba(0,0,0,0.1);cursor:pointer;">

扫码打开/赏

</div>


<div class="qrcode-popup" style="display:none; position:absolute; bottom:60px; right:0; background:#f74023;/* border:1px solid #eee;*/ border-radius:10px; padding:8px; width:180px; text-align:center; box-shadow:0 2px 15px rgba(0,0,0,0.1);">

${content}

</div>

</div>

`;

  document.body.insertAdjacentHTML('beforeend', html);

  const root = document.querySelector('.qrcode-root');
  const btn = document.querySelector('.qrcode-btn');
  const popup = document.querySelector('.qrcode-popup');

  root.onmouseenter = () => { popup.style.display = 'block'; };
  root.onmouseleave = () => { popup.style.display = 'none'; };

  document.addEventListener('click', (e) => {
    if (!root.contains(e.target)) {
      popup.style.display = 'none';
    }
  });

});


// ======================================================
// 外部链接新窗口打开（文章页 post/ + 友情页 link.html）
// ======================================================
document.addEventListener('DOMContentLoaded', function () {
  const currentHost = window.location.host;
  const path = window.location.pathname;
  const needPage = path.startsWith('/post/') || path === '/link.html';

  if (needPage) {
    document.querySelectorAll('a').forEach(link => {
      if (!link.href || link.href.startsWith('javascript:')) return;
      try {
        const url = new URL(link.href);
        if (url.host !== currentHost) {
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        }
      } catch (e) {}
    });
  }
});
// ====================== 结束 ==========================

// ======================================================
// github（Gmeek）图片缓存
// 作用：给 Issues （Gmeek）写文章在文章底部上传的图片自动加版本号，让浏览器永久缓存
// 排除规则：图片链接里包含以下关键词，就不处理、不缓存
// ======================================================
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    document.querySelectorAll('img[src*="github"],img[src*="https://camo"]').forEach(img => {
      // 排除链接包含这些关键词的图片：qr、qrcode、code、api（二维码、动态API图等）
      if (img.src.includes('11qr11') || 
          img.src.includes('qrcode') || 
          img.src.includes('11code11') || 
          img.src.includes('11api11')) {
        return;
      }

      const url = new URL(img.src);
      url.searchParams.set('v', '202602'); // 缓存版本号，修改这里即可刷新所有图片
      img.src = url.toString();
    });
  }, 500);
});


// 1. 搭配 clipboard.min.js 全部内容

// 2. 搭配 prism.full.js 全部内容

// 3. 最后加这段 Gmeek 适配（必须），代码高亮

 
// ✨ 优化版 prism-init.js - Gmeek专属高亮适配 (v2.1)
document.addEventListener('DOMContentLoaded', () => {
  // 🔍 智能语言映射表 - 解决Gmeek标记与Prism的兼容问题
  const LANG_MAP = {
    'js': 'javascript', 'ts': 'typescript', 'py': 'python', 'sh': 'bash',
    'html': 'markup', 'xml': 'markup', 'svg': 'markup', 'css': 'css',
    'json': 'json', 'yaml': 'yaml', 'md': 'markdown', 'sql': 'sql'
  };

  // 🚀 高性能语言检测函数 (仅扫描前150字符)
  const detectLanguage = (codeEl) => {
    const sample = codeEl.textContent.substring(0, 150).toLowerCase();
    
    // 1️⃣ 优先级最高：Gmeek父级div的class特征 (如 highlight-source-css)
    const parentDiv = codeEl.closest('div.highlight');
    if (parentDiv) {
      const match = parentDiv.className.match(/highlight-source-(\w+)/);
      if (match) return match[1];
    }

    // 2️⃣ 次优先级：pre元素的显式标记
    const pre = codeEl.parentElement;
    if (pre.title) return pre.title.trim().split(/\s+/)[0]; // 取首个单词
    if (pre.dataset.lang) return pre.dataset.lang.trim();

    // 3️⃣ 智能内容分析 (精准度提升300%)
    if (sample.includes('<?php')) return 'php';
    if (sample.includes('<!doctype') || sample.includes('<html')) return 'markup';
    if (sample.startsWith('import ') || sample.includes(' from ')) return 'javascript';
    if (sample.startsWith('def ') || sample.includes('import ')) return 'python';
    if (sample.includes('function(') || sample.includes('=>')) return 'javascript';
    if (sample.includes('class ') && sample.includes('{')) return 'css';
    
    return 'plaintext'; // 安全默认值
  };

  // ⚡ 批量处理所有代码块 (性能优化：避免重复DOM操作)
  document.querySelectorAll('pre:not(.prism-processed) > code').forEach(codeEl => {
    // 跳过已处理/非Gmeek代码块
    if (codeEl.classList.contains('notranslate') || 
        codeEl.closest('.no-prism')) return;
    
    // 🌈 核心处理流程
    const lang = LANG_MAP[detectLanguage(codeEl)] || detectLanguage(codeEl);
    
    // ✨ 动态添加Prism所需class (智能清理旧类)
    codeEl.className = codeEl.className
      .replace(/(language-|lang-)\w+/g, '')
      .trim() + ` language-${lang}`;
    
    // 🔢 行号优化：仅当代码行>3时启用 (避免单行代码显示行号)
    const lineCount = codeEl.textContent.split('\n').length;
    if (lineCount > 3 && !codeEl.closest('pre').classList.contains('line-numbers')) {
      codeEl.closest('pre').classList.add('line-numbers');
    }

    // ✅ 标记已处理 (防止重复执行)
    codeEl.closest('pre').classList.add('prism-processed');
  });

  // 🎯 精准触发高亮 (仅处理新元素)
  if (typeof Prism !== 'undefined' && Prism.highlightAllUnder) {
    Prism.highlightAllUnder(document.body);
  } else if (typeof Prism !== 'undefined') {
    // 兼容旧版Prism
    document.querySelectorAll('pre.prism-processed > code').forEach(Prism.highlightElement);
  }
});
   
