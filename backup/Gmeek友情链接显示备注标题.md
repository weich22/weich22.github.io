也就是Markdown超链接的title标题拿来当备注显示…
链接title是当鼠标悬停在链接上时会出现的文字，这个title是可选的，它放在圆括号中链接地址后面，跟链接地址之间以空格分隔，如下：

```+Markdown
[无用功](https://weich22.github.io "没有用功努力，不做没用的功")。
```

既然原生自带的就有了还要折腾啥玩意？因为我觉得手机端浏览默认不显示，不方便，所以才有的这个文章。


1.手机长按一下就显示,拿开不会消失
靠的是:focus,只要焦点还在(下划线
还在),就一直显示
2.点别的地方才消失
焦点移走→自动隐藏
3.电脑 hover 直接显示
不用点、不用右键
4.只在 #postBody + link.html生效
按住→显示→拿开还显示→点别处才消失和原生焦点状态完全同步。

css部分：

```+css
<style>
/* 手机/电脑通用：只有焦点/hover 才显示，手指拿开依然保持显示 */
#postBody a.tooltip-link {
  position: relative;
  /* 下划线！保持原样 */
}

#postBody a.tooltip-link::after {
  content: attr(data-title);
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  background: #333;
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  white-space: nowrap;
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s;
}

/* 核心：hover 电脑可用 + focus 保持显示（手机点完不消失） */
#postBody a.tooltip-link:hover::after,
#postBody a.tooltip-link:focus::after {
  opacity: 1;
  visibility: visible;
}
</style>

```
js部分：

```+js
<script>
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
</script>
```

代码添加到之前引用到头部的自定义css和js文件里面就好了。