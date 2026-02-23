
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

 
  
// ✅ 100% 安全版：无视加载顺序，自动等待 Prism 就位
(function safePrismInit() {
  // 🌟 核心：用 MutationObserver 监听 DOM 变化 + 轮询 Prism
  const observer = new MutationObserver(() => {
    if (typeof Prism !== 'undefined' && Prism.highlightAll) {
      initGmeekPrism();
      observer.disconnect(); // 任务完成，停止监听
    }
  });

  // 🚀 立即检查 + 开启监听
  if (typeof Prism !== 'undefined' && Prism.highlightAll) {
    initGmeekPrism();
  } else {
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
    // 双保险：500ms 后强制检查（防极端情况）
    setTimeout(() => {
      if (typeof Prism !== 'undefined' && Prism.highlightAll) {
        initGmeekPrism();
        observer.disconnect();
      }
    }, 500);
  }

  function initGmeekPrism() {
    // ✅ 精准匹配 Gmeek 真实结构：<div class="highlight highlight-source-xxx">
    document.querySelectorAll('div.highlight').forEach(container => {
      const langMatch = container.className.match(/highlight-source-(\w+)/);
      if (!langMatch) return;

      const lang = langMatch[1].toLowerCase();
      const pre = container.querySelector('pre');
      const code = pre?.querySelector('code');

      if (code) {
        // 🧼 彻底清理 Gmeek 的干扰 class
        code.className = code.className
          .replace(/notranslate/g, '')
          .replace(/language-\S+/g, '')
          .trim();
        
        // ✨ 注入 Prism 灵魂 class
        code.classList.add(`language-${lang}`);
        pre.classList.add('line-numbers', `language-${lang}`);
      }
    });

    // 💥 终极高亮指令（Prism 亲儿子写法）
    Prism.highlightAllUnder(document.body);
  }
})();
 
