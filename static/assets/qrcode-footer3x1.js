
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


/*

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

*/


// prism-init.js —— 最终纯净版：只翻译Gmeek标记，不猜内容
document.addEventListener('DOMContentLoaded', () => {
  if (typeof Prism === 'undefined') return;

  // 语言简写映射（你习惯怎么写，我就怎么映射）
  const langMap = {
    js: 'javascript',
    ts: 'typescript',
    py: 'python',
    md: 'markdown',
    html: 'markup',
    xml: 'markup',
    sh: 'bash',
    bash: 'bash',

    // 你要的自定义简写映射
    cmd: 'powershell',   // 标记 cmd → 按 powershell 高亮
    nx: 'nginx',         // 标记 nx → 按 nginx 高亮

    ps1: 'powershell',
    bat: 'batch',
    yml: 'yaml',
    rb: 'ruby',
    rs: 'rust',
    go: 'go',
    java: 'java',
    c: 'c',
    cpp: 'cpp',
    php: 'php',
    css: 'css',
    json: 'json',
    sql: 'sql',
    ini: 'ini',
    docker: 'docker',
    nginx: 'nginx',
    git: 'git',
    batch: 'batch',
    powershell: 'powershell'
  };

  // 遍历 Gmeek 代码块
  document.querySelectorAll('div.highlight').forEach(block => {
    const langCls = Array.from(block.classList)
      .find(c => c.startsWith('highlight-source-'));
    if (!langCls) return;

    const gLang = langCls.replace('highlight-source-', '').toLowerCase();
    const lang = langMap[gLang] || gLang;

    const codeEl = block.querySelector('pre.notranslate > code.notranslate');
    if (!codeEl) return;
    const preEl = codeEl.parentElement;

    codeEl.classList.remove('notranslate');
    codeEl.classList.add(`language-${lang}`);
    preEl.classList.add('line-numbers');
  });

  Prism.highlightAll();
});
