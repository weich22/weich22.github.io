### 没有排除链接
```+js
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

```

### 带排除链接

```+js
// ======================================================
// 文章页+友情页：外部链接新窗口打开（排除自己主页）
// ======================================================
document.addEventListener('DOMContentLoaded', function () {
  const currentHost = window.location.host;
  const path = window.location.pathname;
  const needPage = path.startsWith('/post/') || path === '/link.html';

  // 只排除【旧GitHub域名】，其他都正常判断
  const excludeHosts = [
    'xxxx.github.io'  // 这里只写你原来的 github 域名
  ];

  if (needPage) {
    document.querySelectorAll('a').forEach(link => {
      if (!link.href || link.href.startsWith('javascript:')) return;
      try {
        const url = new URL(link.href);
        const isExternal = url.host !== currentHost;
        const isExcluded = excludeHosts.some(h => url.host.includes(h));

        if (isExternal && !isExcluded) {
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        }
      } catch (e) {}
    });
  }
});
// ====================== 结束 ==========================

```
直接放到你的博客已经引用的一个js文件里面去，打开js文件编写，放到最后面去，js文件不用script标签，多个js放到一个js文件里面去会少请求一个链接，网站性能会优化好一点，你可以单独另外创建一个JS文件直接放进去，然后引用链接到Gmeek的config.json配置文件里面去，比如：[Gmeek博客资源文件引用](https://g.weich.ee/post/1.html#资源链接引用方式推荐)