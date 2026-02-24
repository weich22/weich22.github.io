Typecho的CodeHighlighter基于 prismjs 的代码语法高亮插件如何移植到基于github用Gmeek做的博客用。

### 添加自定义修复js

```js
 
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

别的参考版本：
```js
  
document.addEventListener('DOMContentLoaded', () => {
  // ✅ 保持原选择器不变！因为之前这样高亮是正常的
  document.querySelectorAll('pre.notranslate > code.notranslate').forEach((codeEl) => {
    let lang = 'plaintext';
    const pre = codeEl.parentElement;
    
    // ✨ 新增：从Gmeek父级div提取语言（这才是关键！）
    const gmeekDiv = pre.parentElement; // 获取父级div
    if (gmeekDiv && gmeekDiv.classList) {
      for (const cls of gmeekDiv.classList) {
        // 匹配 highlight-source-xxx 格式
        const match = cls.match(/highlight-source-(\w+)/);
        if (match) {
          lang = match[1].toLowerCase();
          break; // 找到就停止
        }
      }
    }
    
    // ❌ 保留原逻辑但降级为备选（避免冲突）
    if (lang === 'plaintext') {
      if (pre.title) lang = pre.title.trim().toLowerCase();
      else if (pre.dataset.lang) lang = pre.dataset.lang.trim().toLowerCase();
      else if (codeEl.textContent.includes('<?php')) lang = 'php';
      else if (codeEl.textContent.startsWith('def ') || codeEl.textContent.includes('import ')) lang = 'python';
      else if (codeEl.textContent.includes('function ') || codeEl.textContent.includes('=>')) lang = 'javascript';
    }

    // ✅ 保持原class操作不变（这是高亮生效的关键！）
    codeEl.classList.remove('notranslate');
    codeEl.classList.add(`language-${lang}`);
    pre.classList.add('line-numbers');
  });

  // ✅ 保持原高亮触发不变！
  if (typeof Prism !== 'undefined') {
    Prism.highlightAll();
  }
});
  
```
另外一个参考：

``` 
document.addEventListener('DOMContentLoaded', () => {
  // ✅ 保持原有选择器：只处理 Gmeek 生成的 notranslate 结构
  document.querySelectorAll('pre.notranslate > code.notranslate').forEach((codeEl) => {
    let lang = 'plaintext';
    const pre = codeEl.parentElement;

    // 🔑【核心修复】优先从 Gmeek 的父级 div.highlight 中提取 language
    // 向上查找最近的 div.highlight（Gmeek 包裹容器）
    const highlightDiv = pre.closest('div.highlight');
    if (highlightDiv) {
      const sourceMatch = highlightDiv.className.match(/highlight-source-(\w+)/);
      if (sourceMatch) {
        lang = sourceMatch[1].toLowerCase();
      }
    }

    // 📌 降级策略：仍保留你原有的 title / data-lang / 内容关键词判断（兜底）
    if (!lang || lang === 'plaintext') {
      if (pre.title) lang = pre.title.trim().toLowerCase();
      else if (pre.dataset.lang) lang = pre.dataset.lang.trim().toLowerCase();
      else if (codeEl.textContent.includes('<?php')) lang = 'php';
      else if (codeEl.textContent.startsWith('def ') || codeEl.textContent.includes('import ')) lang = 'python';
      else if (codeEl.textContent.includes('function ') || codeEl.textContent.includes('=>')) lang = 'javascript';
    }

    // ✅ 保持原有 class 操作（安全、无副作用）
    codeEl.classList.remove('notranslate');
    codeEl.classList.add(`language-${lang}`);
    pre.classList.add('line-numbers'); // 行号保持开启
  });

  // ✅ 保持原有 Prism 调用（最稳妥）
  if (typeof Prism !== 'undefined' && typeof Prism.highlightAll === 'function') {
    Prism.highlightAll();
  }
});

```

### 添加自定义修复css

```css
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

好像这个css也要加，请自己实测。

```css
/*代码高亮 强行清空 Gmeek 自带样式 */
/* 
.copy-to-clipboard {
  position: absolute; top: 6px; right: 8px;
  background: rgba(0,0,0,0.2); border: none; color: #fff;
  padding: 2px 6px; border-radius: 4px; cursor: pointer;
  font-size: 12px; opacity: 0.7;
}
.copy-to-clipboard:hover { opacity: 1; }
 
*/

/* 核心修复：代码块不撑大页面，超长横向滚动 */
.article pre.line-numbers {
  position: relative !important;
  padding-left: 3.8em !important; /* 给行号预留固定空间 */
  margin: 1em 0 !important;
  overflow: auto !important;     /* 关键：让代码块自己滚动，不撑大页面 */
  white-space: pre !important;    /* 关键：代码不换行，保留原始格式 */
  word-wrap: normal !important;   /* 禁止自动折行 */
  max-width: 100% !important;     /* 限制最大宽度为父容器宽度 */
}
```

### 移植js和css源文件
去Typecho插件目录直接把文件拿过来上传并引用到Gmeek的config.json配置文件。
只需要prism.full.js（也可以是prism.js，只不过prism.full.js的更完整）和clipboard.min.js和你想要的主题文件coy.css也可以是别的主题文件css。

这样做可以和Gmeek自带的代码高亮共存，在代码高亮块开始三个点后面加代码是什么标识语言没有空格（随便添加比如：js或者JS或者html都可以，只要是你自己认识的或者需求的）就会是Gmeek自带的代码高亮，不加就是prism.js的代码高亮或者在开始三个点之后加一个符号比如加减后加代码标识都可以，或者加减之后再加个空格再加代码语言标识也是prism.js的代码高亮，应该算是破坏原来的代码高亮结构吧，总之最近简单的就是靠近三个点加文字代码标识就是Gmeek自带的高亮，三个点之间有别的或者直接不加就是prism.js的高亮，具体请实测，我实测腻了，头好大…


CodeHighlighter插件的相关文件位于Typecho安装目录的/usr/plugins/CodeHighlighter/下：

### 核心js文件目录：
/usr/plugins/CodeHighlighter/static/prism.js或prism.ful1.js（完整版功能更全）

### 主题CSS文件目录：
/usr/plugins/CodeHighlighter/static/styles/coy.css

### 复制插件目录：
/usr/plugins/CodeHighlighter/static/clipboard.min.js

我添加的自定义修复js文件名是：qrcode-footer3x1.js ，直接整合到原来已有并且已经引用的js文件里面的。
我添加的自定义修复css文件名是：zdy.css ，这个也是直接整合到原来已经的文件里面的。

移植后,打开博客首页和一篇文章页,检查代码块是否已正确着色,并且左侧显示行号。在手机上查看时,横向滚动条应正常工作。

### 移植步骤总结
1.找到文件:登录您的Typecho网站服务器,进入上述路径
2.下载文件:将这三个文件下载到本地
3.上传到Gmeek: 将文件上传到GitHub仓库的/assets/js/和 /assets/css/目录
4.配置引入:在 config. json 中通过allHead字段引入。


[参考地址对比看下是不是完美1比1复刻了](http://weich.ee/archives/69.html)