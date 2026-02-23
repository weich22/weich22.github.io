
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

 
  
  
// ✅ 完美适配 Gmeek 的终极方案 (直接替换你原来的 prism-init.js)
document.addEventListener('DOMContentLoaded', () => {
  // 核心逻辑：只修改标注，不破坏原有高亮流程！
  document.querySelectorAll('pre.notranslate').forEach(pre => {
    let lang = 'plaintext';
    
    // 🔥 优先从 Gmeek 的 div 父容器提取语言 (这才是关键！)
    const divHighlight = pre.parentElement;
    if (divHighlight?.classList.contains('highlight')) {
      const match = divHighlight.className.match(/highlight-source-(\w+)/);
      if (match) lang = match[1].toLowerCase();
    }
    
    // 备用方案：如果 div 没标注，再看 pre 的 title/data-lang
    if (lang === 'plaintext' && pre.title) {
      lang = pre.title.trim().toLowerCase();
    }
    if (lang === 'plaintext' && pre.dataset.lang) {
      lang = pre.dataset.lang.trim().toLowerCase();
    }

    // ✨ 重点来了！只修改标注，不碰高亮类！
    const codeEl = pre.querySelector('code.notranslate');
    if (codeEl) {
      // 1. 保留 Prism 的高亮类 (不动它！)
      const hasPrismClass = [...codeEl.classList].some(c => c.startsWith('language-'));
      
      // 2. 只添加/更新标注类 (用于显示语言名称)
      if (!hasPrismClass) {
        codeEl.classList.add(`language-${lang}`);
      } else {
        // 如果已有高亮类，只更新标注部分 (避免重复)
        codeEl.classList.forEach(c => {
          if (c.startsWith('language-')) {
            codeEl.classList.replace(c, `language-${lang}`);
          }
        });
      }
      
      // 3. 保留 notranslate 类 (Gmeek 需要)
      codeEl.classList.add('notranslate');
      pre.classList.add('notranslate');
    }
  });

  // ✅ 安全触发高亮 (Prism 已加载时才执行)
  if (typeof Prism !== 'undefined' && Prism.highlightAll) {
    // 延迟 1 帧确保 DOM 更新完成
    requestAnimationFrame(Prism.highlightAll);
  }
});
 
