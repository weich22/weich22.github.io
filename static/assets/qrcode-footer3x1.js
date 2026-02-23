
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

 
  
 
 
// 安全初始化：兼容 DOM 加载时机 & Prism 依赖
document.addEventListener('DOMContentLoaded', () => {
  // 1️⃣ 优先匹配 Gmeek 的 div.highlight 结构（最精准！）
  document.querySelectorAll('div.highlight').forEach(div => {
    const langMatch = div.className.match(/highlight-source-(\w+)/i);
    if (!langMatch) return;
    
    const userLang = langMatch[1].toLowerCase(); // 直接获取用户标注（如 "css"）
    const codeEl = div.querySelector('code.notranslate');
    if (!codeEl) return;

    // 2️⃣ 关键修复：保留用户原始标注格式（不转成 Prism 标准名）
    codeEl.dataset.userLang = userLang; // 存储用户标注到 data 属性
    codeEl.classList.add(`language-${userLang}`); // 保留小写格式（如 language-css）
    codeEl.classList.remove('notranslate');
    
    // 3️⃣ 同步给 pre 元素（兼容 Prism 主题）
    const pre = codeEl.parentElement;
    pre.classList.add(`language-${userLang}`, 'line-numbers');
    pre.classList.remove('notranslate');
  });

  // 4️⃣ ✨ 最后一步：覆盖 Prism 默认语言标签显示
  if (typeof Prism !== 'undefined') {
    // 自定义语言显示逻辑（核心！）
    Prism.hooks.add('complete', env => {
      const code = env.element;
      const userLang = code.dataset.userLang;
      
      if (userLang && env.highlightedCode) {
        // 在代码块右上角插入用户标注（替换默认的 "CSS"）
        const langSpan = document.createElement('span');
        langSpan.className = 'language-label';
        langSpan.textContent = userLang; // 直接显示用户标注（如 "css"）
        
        // 清理旧标签（避免重复）
        const oldLabel = code.parentElement.querySelector('.language-label');
        if (oldLabel) oldLabel.remove();
        
        // 插入新标签（右上角定位）
        code.parentElement.style.position = 'relative';
        langSpan.style.cssText = `
          position: absolute; top: 0.5em; right: 0.5em;
          background: rgba(0,0,0,0.5); color: #fff; 
          padding: 0.1em 0.4em; border-radius: 3px;
          font-size: 0.8em; pointer-events: none;
        `;
        code.parentElement.appendChild(langSpan);
      }
    });
    
    // 5️⃣ 安全触发高亮（防重复）
    if (!window.__prism_init_done) {
      Prism.highlightAll();
      window.__prism_init_done = true;
    }
  }
});
 
