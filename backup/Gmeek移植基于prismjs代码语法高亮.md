Typecho的CodeHighlighter基于 prismjs 的代码语法高亮插件如何移植到基于github用Gmeek做的博客用。

### 添加自定义修复js

```+js
 
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



### 推荐升级版本
支持更多语言识别，代码里现在一共支持 28 种语言/格式：
 
1. 前端
 
1. markup（HTML / XML / SVG）
2. css
3. javascript
4. typescript
 
2. 编程语言
 
5. python
6. php
7. c
8. cpp
9. java
10. go
11. rust
12. ruby
13. kotlin
14. swift
 
3. 数据与文档
 
15. json
16. yaml
17. markdown
18. sql
 
4. 配置文件
 
19. ini（.env / .ini / 配置）
20. nginx
21. docker
22. git
 
5. 系统命令（你特别要的）
 
23. bash（Linux / macOS 终端）
24. batch（Windows CMD / 批处理）
25. powershell（Windows PowerShell）
 
6. 兜底
 
26. plaintext（纯文本）
27. 所有未识别的自动走通用高亮
 




```+js
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
```


### 添加自定义修复css

```+css
/* =============== Prism 高亮终极兼容补丁（适配 Gmeek + zdy.css） =============== */
/* 👇 强制容器行为 */
pre[class*="language-"] {
  display: block !important;
  width: 100% !important;
  max-width: 100% !important;
  /*电脑页面内容没有溢出也显示上下拉坚条overflow-x: auto !important;*/
  -webkit-overflow-scrolling: touch !important;
  /*padding-left: 3.5em !important;这个看个人因为我后期修改了别的导致行号前面留白*/
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

好像这个css可以不加重复了吧，因为我改来改去，忘了这个css也还在里面，预防万一在某些地方可以用到细节修复就拿出来了，请自己实测。

```+css
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


上面三个文件下载回来再上传然后再引用到Gmeek配置文件，引用标签为：allHead
```
<link rel=\"stylesheet\" href='/assets/coy.css'>
<script src='/assets/clipboard.min.js'></script>
<script src='/assets/prism.full.js'></script>
```

我添加的自定义修复js文件名是：qrcode-footer3x1.js ，直接整合到原来已有并且已经引用的js文件里面的。
我添加的自定义修复css文件名是：zdy.css ，这个也是直接整合到原来已经的文件里面的。

移植后,打开博客首页和一篇文章页,检查代码块是否已正确着色,并且左侧显示行号。在手机上查看时,横向滚动条应正常工作。

### 移植步骤总结
1.找到文件:登录您的Typecho网站服务器,进入上述路径
2.下载文件:将这三个文件下载到本地
3.上传到Gmeek: 将文件上传到GitHub仓库的/assets/js/和 /assets/css/目录
4.配置引入:在 config. json 中通过allHead字段引入。


[参考地址对比看下是不是完美1比1复刻了](http://weich.ee/archives/69.html)