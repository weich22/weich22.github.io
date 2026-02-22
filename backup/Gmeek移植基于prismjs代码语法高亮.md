Typecho的CodeHighlighter基于 prismjs 的代码语法高亮插件如何移植到基于github用Gmeek做的博客。

### 添加自定义js
```
 
// prism-init.js —— 自动识别并标记 Gmeek 的代码块
document.addEventListener('DOMContentLoaded', () => {
  // 遍历所有 <pre><code class="notranslate">
  document.querySelectorAll('pre.notranslate > code.notranslate').forEach((codeEl) => {
    // 尝试从父级 pre 的 title、data-lang 或内容特征推测语言（简单版）
    let lang = 'plaintext';
    const pre = codeEl.parentElement;
    
    // 优先看 pre 的 title 属性（常见于 Gmeek 的手动标注，如 <pre title="php">）
    if (pre.title) lang = pre.title.trim().toLowerCase();
    
    // 或看 data-lang（如果你能在 Markdown 里写 `{.python}` 之类，Gmeek 可能转成 data-lang）
    else if (pre.dataset.lang) lang = pre.dataset.lang.trim().toLowerCase();
    
    // 简单关键词 fallback（可选，谨慎使用）
    else if (codeEl.textContent.includes('<?php')) lang = 'php';
    else if (codeEl.textContent.startsWith('def ') || codeEl.textContent.includes('import ')) lang = 'python';
    else if (codeEl.textContent.includes('function ') || codeEl.textContent.includes('=>')) lang = 'javascript';

    // 添加 Prism 所需的 class
    codeEl.classList.remove('notranslate');
    codeEl.classList.add(`language-${lang}`);
    pre.classList.add('line-numbers'); // 启用行号（需 coy.css 支持）
  });

  // ✨ 最后手动触发 Prism 高亮（关键！）
  if (typeof Prism !== 'undefined') {
    Prism.highlightAll();
  }
});
 ```
### 添加自定义css
``` 
/* =============== Prism 高亮终极兼容补丁（适配 Gmeek + zdy.css） =============== */
/* 👇 强制容器行为 */
pre[class*="language-"] {
  display: block !important;
  width: 100% !important;
  max-width: 100% !important;
  overflow-x: auto !important;
  -webkit-overflow-scrolling: touch !important;
  padding-left: 3.5em !important;
  margin: 0 !important;
  word-break: normal !important;
}

/* 👇 强制代码内容不撑宽 */
pre[class*="language-"] code {
  display: block !important;
  white-space: pre !important;
  overflow-x: auto !important;
  text-align: left !important;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace !important;
}

/* 👇 清除 Prism 内联 span 的干扰 */
pre[class*="language-"] code * {
  white-space: inherit !important;
  display: inline !important;
}

/* 👇 移动端防缩放 & 字体加固 */
@media (max-width: 768px) {
  pre[class*="language-"] {
    font-size: 0.875rem !important;
  }
  pre[class*="language-"] code {
    font-size: 0.95em !important;
  }
  pre[class*="language-"] code::before,
  pre[class*="language-"] code::after {
    content: none !important;
  }
}
 ```
### 移植js和css源文件
去Typecho插件目录直接把文件拿过来上传并引用到Gmeek的config.json配置文件。
只需要prism.full.js（也可以是prism.js，只不过prism.full.js的更完整）和clipboard.min.js和你想要的主题文件coy.css也可以是别的主题文件css。