 ### 全局引用js

```+js
(function() {

function getAdaptiveColor(bg) {

const rgb = bg.match(/\d+/g);

if (!rgb || rgb.length < 3) return "#ffffff";

const [r, g, b] = rgb.map(Number);

const l = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

return l > 0.6 ? "#000000" : "#ffffff";

}


function syncLabelColorsOnly() {

// 仅抓取标签相关的类名

const selectors = '.Label, .LabelName, .post-tag, .listLabels span';

document.querySelectorAll(selectors).forEach(el => {

try {

// 读取背景

let bg = window.getComputedStyle(el).backgroundColor;

if (bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') {

bg = window.getComputedStyle(el.parentElement).backgroundColor;

}


if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {

const fg = getAdaptiveColor(bg);

// 精准定位文字容器

const target = (el.tagName === 'A') ? el : (el.querySelector('a') || el);

// 只修改颜色和阴影，不修改任何布局相关的 style 属性

if (target && target.style) {

target.style.setProperty('color', fg, 'important');

target.style.setProperty('text-shadow', 'none', 'important');

}

}

} catch (e) {}

});

}


// 初始与定时执行（定时是为了兼容搜索页动态生成的标签）

syncLabelColorsOnly();

setInterval(syncLabelColorsOnly, 1500);


// 监听暗黑模式切换

const observer = new MutationObserver(syncLabelColorsOnly);

observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-color-mode'] });

})();
```

### 修补css说明
添加js后用下面的css修复上面的补丁，因为标签太多不会换行，往右边溢出，扩大整个页面。

这确实不是JS逻辑的问题,而是 Gmeek原生 CSS 样式的一个冲突配置:
·.listLabels 容器被设置了display: flex;。
·同时,它还被设置了white-space: nowrap;(这就是罪魁祸首)。
nowrap 会强制让容器内的所有标签横向排成一排,绝不换行,所以当你的标签变多时,它们就直接”飞"出了屏幕边缘。
为什么没有加这个js之前没发现?
可能是因为之前标签文字颜色和背景混在一起,或者之前某个旧的样式表(比如 我自己加的自定义zdy.css)刚好覆盖了这个属性,而现在由于 Actions 重新构建或者JS刷新的原因,这个nowrap重新获得了最高优先级。


为什么分两个版本:因为有些用户喜欢极简(版本一)，
而有些用户为了日期美观(版本二)不希望日期被中间截断，统一日期都在后面，而且日期的颜色都是统一一样的。
建议先用 版本二试试（我用的版本一，没办法因为我没有限制网页最大宽度…）,因为它能保证日期的统一完整性,看起来更专业。


### 修补版本一：
所有标签（含日期）都会自动换行
​这个版本最彻底，只要空间不够，任何标签（包括日期）都会自动掉到下一行，确保绝对不溢出屏幕。
​代码如下：


```+css
/* 版本一：全局换行补丁 */
.listLabels {
    white-space: normal !important;
    flex-wrap: wrap !important;
    display: flex !important;
}

.Label, .LabelName, .LabelTime {
    margin-bottom: 4px !important; /* 给换行后的标签留一点上下间距 */
}

```



### 版本二(日期锁定+智能右靠版)
这个版本不限制px,而是利用 margin-left: auto确保日期留在第一行,并给它一个舒适的背景色区分,让它看起来像是一个固定的“挂件”。

```+css
/* 容器：允许标签换行 */
.listLabels {
    display: flex !important;
    flex-wrap: wrap !important;
    white-space: normal !important;
    align-items: center !important;
}

/* 日期：利用 margin-left: auto 锁定第一行末尾 */
.LabelTime {
    white-space: nowrap !important;
    flex-shrink: 0 !important;      /* 绝对不许压缩日期 */
    margin-left: auto !important;    /* 核心：把它推到当前行的最右侧 */
    padding-left: 10px !important;   /* 留出左边距 */
    order: 99 !important;           /* 确保视觉上排在最后 */
}

/* 普通标签：空间不够时自动换行 */
.Label, .LabelName {
    flex-shrink: 1 !important;
    margin-bottom: 4px !important;
    margin-right: 4px !important;
}

```