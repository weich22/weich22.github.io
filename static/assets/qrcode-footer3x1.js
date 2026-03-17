
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

/*链接获取焦点显示标题*/

document.addEventListener('DOMContentLoaded', function () {
  // 只在链接页面生效
  if (window.location.pathname !== '/link.html') return;

  const postBody = document.getElementById('postBody');
  if (!postBody) return;

  // 只给 #postBody 里带 title 的链接生效
  postBody.querySelectorAll('a[title]').forEach(link => {
    link.classList.add('tooltip-link');
    link.dataset.title = link.title;
    link.removeAttribute('title');
    // 让手机 a 标签能真正获得焦点（关键！）
    link.setAttribute('tabindex', '0');
  });
});


/*代码高亮*/



// prism-init.js —— 自动识别并标记 Gmeek 的代码块（超级全语言+系统命令高亮）
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('pre.notranslate > code.notranslate').forEach((codeEl) => {
    let lang = 'plaintext';
    const pre = codeEl.parentElement;
    const text = codeEl.textContent.trimStart();

    // 优先从 title / data-lang 读取
    if (pre.title) lang = pre.title.trim().toLowerCase();
    else if (pre.dataset.lang) lang = pre.dataset.lang.trim().toLowerCase();

    // ————————————————————————————————————
    // 全语言内容识别（含系统命令、终端、配置）
    // ————————————————————————————————————
    else if (text.includes('<?php'))
      lang = 'php';
    else if (
      text.includes('document.') || text.includes('window.') ||
      text.includes('console.log') || text.includes('function') ||
      text.includes('const ') || text.includes('let ') || text.includes('=>') ||
      text.includes('var ') || text.includes('alert(') || text.includes('fetch(')
    )
      lang = 'javascript';
    else if (
      text.startsWith('def ') || text.includes('import ') ||
      text.includes('print(') || text.includes('self.')
    )
      lang = 'python';
    else if (
      text.includes('color:') || text.includes('margin:') ||
      text.includes('padding:') || text.includes('display:') ||
      text.includes('font-') || text.includes('@media')
    )
      lang = 'css';
    else if (
      text.includes('<div') || text.includes('<p>') || text.includes('<span') ||
      text.includes('<ul>') || text.includes('<!DOCTYPE') || text.includes('</')
    )
      lang = 'markup';

    // C / C++
    else if (text.includes('#include') || text.includes('int main') || text.includes('printf('))
      lang = 'c';
    else if (text.includes('std::') || text.includes('cout') || text.includes('cin'))
      lang = 'cpp';

    // Java / Go
    else if (text.includes('public class') || text.includes('static void') || text.includes('System.out.println'))
      lang = 'java';
    else if (text.includes('func ') || text.includes('package ') || text.includes('fmt.Println'))
      lang = 'go';

    // Linux / Unix Shell / 终端命令
    else if (
      text.includes('sudo ') || text.includes('apt ') || text.includes('yum ') ||
      text.includes('ls ') || text.includes('cd ') || text.includes('pwd ') ||
      text.includes('mkdir ') || text.includes('rm ') || text.includes('chmod ') ||
      text.includes('if [') || text.includes('for ') || text.includes('do ') ||
      text.includes('echo ') || text.includes('#!/bin/bash') || text.startsWith('$')
    )
      lang = 'bash';

    // Windows CMD / 批处理
    else if (
      text.includes('@echo') || text.includes('dir ') || text.includes('copy ') ||
      text.includes('del ') || text.includes('md ') || text.includes('rd ') ||
      text.includes('ipconfig') || text.includes('ping ') || text.startsWith('C:\\')
    )
      lang = 'batch';

    // Windows PowerShell
    else if (
      text.includes('Get-') || text.includes('Set-') || text.includes('New-') ||
      text.includes('Remove-') || text.includes('Write-') || text.includes('$PSVersionTable')
    )
      lang = 'powershell';

    // JSON / Markdown / YAML
    else if ((text.startsWith('{') || text.startsWith('[')) && text.includes(':') && text.includes(','))
      lang = 'json';
    else if (text.startsWith('# ') || text.startsWith('## ') || text.startsWith('- ') || text.includes('[]('))
      lang = 'markdown';
    else if (text.includes(': ') && !text.includes('{') && !text.includes(';'))
      lang = 'yaml';

    // SQL / Rust / Ruby / Kotlin / Swift / TypeScript
    else if (text.includes('SELECT ') || text.includes('FROM ') || text.includes('WHERE ') || text.includes('CREATE TABLE'))
      lang = 'sql';
    else if (text.includes('fn main') || text.includes('let mut') || text.includes('println!'))
      lang = 'rust';
    else if (text.includes('def ') && text.includes('end'))
      lang = 'ruby';
    else if (text.includes('fun ') || text.includes('class ') && text.includes('fun'))
      lang = 'kotlin';
    else if (text.includes('import ') && text.includes('struct') && text.includes('impl'))
      lang = 'swift';
    else if (text.includes('interface ') || text.includes('type ') || text.includes(': '))
      lang = 'typescript';

    // Nginx / Apache 配置
    else if (text.includes('server {') || text.includes('location ') || text.includes('listen 80') || text.includes('root '))
      lang = 'nginx';

    // 环境变量 / config / ini
    else if (text.includes('export ') || text.includes('PATH=') || (text.includes('=') && !text.includes(':') && !text.includes(';')))
      lang = 'ini';

    // Docker
    else if (text.includes('FROM ') || text.includes('RUN ') || text.includes('COPY ') || text.includes('CMD '))
      lang = 'docker';

    // Git 命令
    else if (text.includes('git ') && (text.includes('commit') || text.includes('push') || text.includes('pull') || text.includes('checkout')))
      lang = 'git';

    // 兜底
    else {
      lang = 'plaintext';
    }

    // 应用 Prism 类
    codeEl.classList.remove('notranslate');
    codeEl.classList.add(`language-${lang}`);
    pre.classList.add('line-numbers');
  });

  if (typeof Prism !== 'undefined') {
    Prism.highlightAll();
  }
});

/*tag标签页面，用户选中标签切换效果点击哪个标签就去除它的css样式padding：4px*/

(function() {
  'use strict';

  if (!window.location.pathname.includes('tag.html')) return;

  function handleTagClick(event) {
    const button = event.target.closest('button.Label');
    if (!button) return;

    document.querySelectorAll('button.Label').forEach(btn => {
      btn.style.setProperty('padding', '4px', 'important');
    });
    button.style.setProperty('padding', '0', 'important');
  }

  const tagContainer = document.getElementById('taglabel');
  if (tagContainer) {
    tagContainer.addEventListener('click', handleTagClick);
  }

  function activateTagByHash() {
    const currentHash = decodeURIComponent(window.location.hash.substring(1));
    const allTags = document.querySelectorAll('button.Label');
    
    allTags.forEach(btn => {
      btn.style.setProperty('padding', '4px', 'important');
    });

    if (!currentHash) {
      const allBtn = Array.from(allTags).find(btn => 
        btn.textContent.trim().toLowerCase().startsWith('all')
      );
      if (allBtn) allBtn.style.setProperty('padding', '0', 'important');
      return;
    }

    const activeTag = Array.from(allTags).find(btn => 
      btn.textContent.trim().includes(currentHash.trim())
    );
    if (activeTag) activeTag.style.setProperty('padding', '0', 'important');
  }

  setTimeout(activateTagByHash, 1000);
  window.addEventListener('hashchange', activateTagByHash);
})();







/*文章里面显示标签和日期和上下一篇文章*/

(function() {
    let checkCount = 0;
    const run = () => {
        const c = document.getElementById('cmButton');
        // 等待评论按钮出现，最多尝试 10 秒
        if (!c) {
            if (checkCount++ < 20) setTimeout(run, 500); 
            return;
        }
        if (document.getElementById('customLabels')) return;

        const p = window.location.pathname;
        const u = window.location.href;

        // 1. 抓取 RSS：日期与上下篇
        fetch("/rss.xml").then(r => r.text()).then(x => {
            const d = new DOMParser().parseFromString(x, "text/xml");
            const items = Array.from(d.querySelectorAll("item"));
            let idx = -1;

            // 采用最稳的双向匹配逻辑
            for (let i = 0; i < items.length; i++) {
                const link = items[i].querySelector("link").textContent;
                if (link.indexOf(p) !== -1 || p.indexOf(link) !== -1 || link === u) {
                    idx = i;
                    break;
                }
            }

            if (idx === -1) return;

            const pub = new Date(items[idx].querySelector("pubDate").textContent);
            const dt = pub.getFullYear() + '-' + (pub.getMonth() + 1) + '-' + pub.getDate();

            const box = document.createElement('div');
            // 设置整体容器样式
            box.style.cssText = "margin-top:30px;padding-top:20px;border-top:1px solid var(--color-border-default);clear:both;font-size:14px;";
            
            let h = '<div style="color:var(--color-fg-muted);margin-bottom:15px;">📅 发布日期：' + dt + '</div><div style="display:flex;flex-direction:column;gap:10px;">';
            
            // 索引越小越新，索引越大越旧
            if (idx > 0) {
                h += '<div><span style="color:var(--color-fg-muted);">← 上一篇：</span><a href="' + items[idx - 1].querySelector("link").textContent + '" style="color:var(--color-accent-fg);text-decoration:none;">' + items[idx - 1].querySelector("title").textContent + '</a></div>';
            }
            if (idx < items.length - 1) {
                h += '<div><span style="color:var(--color-fg-muted);">→ 下一篇：</span><a href="' + items[idx + 1].querySelector("link").textContent + '" style="color:var(--color-accent-fg);text-decoration:none;">' + items[idx + 1].querySelector("title").textContent + '</a></div>';
            }
            h += '</div>';
            box.innerHTML = h;
            c.before(box);

            // 2. 抓取标签：使用严格后缀匹配，修正个位数 ID 错误
            const s = (url) => {
                fetch(url).then(r => r.text()).then(ht => {
                    const doc = new DOMParser().parseFromString(ht, "text/html");
                    const pathName = p.split('/').pop();
                    
                    // 核心修复：使用 [href$='/3.html'] 这种结尾匹配，防止误抓 33.html
                    const exactSelector = "a[href$='/" + pathName + "']";
                    const postEntry = doc.querySelector(exactSelector);
                    const container = postEntry ? postEntry.closest('.SideNav-item') : null;
                    
                    if (container) {
                        const b = document.createElement('div');
                        b.id = "customLabels";
                        // 修正：增加 margin-top: 15px 让标签和上面的链接分开
                        b.style.cssText = "margin-top:15px;margin-bottom:15px;display:flex;flex-wrap:wrap;gap:8px;";
                        
                        container.querySelectorAll("span[class*='Label']").forEach(l => {
                            const t = l.innerText.trim();
                            if (t && !/^\d{4}/.test(t)) {
                                const a = document.createElement('a');
                                a.href = "/tag.html#" + t;
                                a.innerText = t;
                                
                                // 克隆样式获取颜色
                                const temp = document.body.appendChild(l.cloneNode(true));
                                temp.style.display = "none";
                                const bg = window.getComputedStyle(temp).backgroundColor;
                                document.body.removeChild(temp);
                                
                                a.style.cssText = "background-color:" + bg + ";color:#fff;padding:2px 10px;border-radius:20px;font-size:12px;text-decoration:none;display:inline-block;";
                                b.appendChild(a);
                            }
                        });
                        if (b.children.length > 0) c.before(b);
                    } else {
                        // 没找到就翻下一页
                        const n = doc.querySelector('.pagination a:last-child, a[rel="next"]');
                        if (n && n.getAttribute('href') && n.getAttribute('href') !== url) s(n.getAttribute('href'));
                    }
                });
            };
            s("/index.html");
        });
    };
    run();
})();




/*首页和搜索标签页面和文章页面根据标签背景颜色更改标签字体颜色*/


(function() {
    // 1. 核心算法：根据背景 RGB 计算亮度，决定字体颜色
    function getAdaptiveColor(bg) {
        const rgb = bg.match(/\d+/g);
        if (!rgb || rgb.length < 3) return "#ffffff";
        const [r, g, b] = rgb.map(Number);
        // 使用亮度感知算法
        const l = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return l > 0.6 ? "#000000" : "#ffffff";
    }

    // 2. 执行颜色同步
    function syncLabelColors() {
        // 覆盖首页、搜索页、标签页、以及文章内注入的所有标签选择器
        const selectors = '.Label, .LabelName, .post-tag, .listLabels span, .listLabels a, #customLabels a';
        document.querySelectorAll(selectors).forEach(el => {
            // 如果已经处理过且没有被标记为需要重算，则跳过
            if (el.dataset.colorFixed === "true" && !el.dataset.dirty) return;
            
            try {
                let bg = window.getComputedStyle(el).backgroundColor;
                // 如果当前元素透明，则尝试抓取父元素的背景色
                if (bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') {
                    bg = window.getComputedStyle(el.parentElement).backgroundColor;
                }
                
                if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
                    const fg = getAdaptiveColor(bg);
                    const target = (el.tagName === 'A') ? el : (el.querySelector('a') || el);
                    
                    if (target && target.style) {
                        target.style.setProperty('color', fg, 'important');
                        target.style.setProperty('text-shadow', 'none', 'important');
                        el.dataset.colorFixed = "true";
                        delete el.dataset.dirty; 
                    }
                }
            } catch (e) {}
        });
    }

    // --- 执行逻辑 ---

    // 初始执行：前 5 秒高频检测，确保内容加载出来后能第一时间变色
    syncLabelColors();
    let count = 0;
    const initTimer = setInterval(() => {
        syncLabelColors();
        if (++count > 10) clearInterval(initTimer);
    }, 500);

    // 模式切换监听：点击“太阳/月亮”切换主题时，强制所有标签重新计算
    if (document.documentElement) {
        new MutationObserver(() => {
            document.querySelectorAll('.Label, .LabelName, .post-tag, .listLabels span, #customLabels a').forEach(el => {
                el.dataset.dirty = "true";
            });
            syncLabelColors();
        }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-color-mode'] });
    }

    // 兜底检查：每 3 秒检查一次（处理如翻页、评论区加载等新产生的标签）
    setInterval(syncLabelColors, 3000);
})();

