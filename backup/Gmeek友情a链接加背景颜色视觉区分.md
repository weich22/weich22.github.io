```js

```
代码太长了，先不放占位一下先…


并修正标注文字显示右边溢出

```css
   /*友情链接获取焦点显示标题*/

/* 让 .card-wrap 作为定位祖先（用于限制提示框宽度） */
.card-wrap {
    position: relative !important;
}

/* 移除链接自身的相对定位，让提示框相对于 .card-wrap 定位 */
#postBody a.tooltip-link {
  position: static !important;
}

/* 提示框样式：保留原有视觉效果，但覆盖定位和宽度等关键属性 */
#postBody a.tooltip-link::after {
  /* 原有内容与基础样式 */
  content: attr(data-title);
  position: absolute;
  top: 100%;
  margin-top: 6px;
  background: #333;
  color: #fff;
  padding: 0px 5px;
  border-radius: 4px;
  font-size: 13px;
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s;
  line-height: 1.5;

  /* 关键覆盖（来自 F12 有效代码，带 !important） */
  left: 0 !important;
  right: auto !important;
  width: max-content !important;      /* 短文字背景不浪费 */
  max-width: 100% !important;         /* 最长不超过父卡片宽度，永不右侧溢出 */
  white-space: normal !important;
  word-break: break-word !important;
  box-sizing: border-box !important;
}

/* 显示提示框 */
#postBody a.tooltip-link:hover::after,
#postBody a.tooltip-link:focus::after {
  opacity: 1;
  visibility: visible;
}

```


[原文章在这](https://g.weich.ee/post/9.html)
为什么要在这更新？因为添加背景颜色框添加了一个锚点（.card-wrap）修正的时候根据这个锚点定位的。