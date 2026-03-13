
```d
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


```dos
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
```dos
/* 版本二：智能换行补丁（推荐） */
.listLabels {
    white-space: normal !important;
    flex-wrap: wrap !important;
    display: flex !important;
}

/* 强制日期作为一个整体，不允许内部折断 */
.LabelTime {
    white-space: nowrap !important;
    display: inline-block !important;
}

.Label, .LabelName, .LabelTime {
    margin-bottom: 4px !important;
}

```