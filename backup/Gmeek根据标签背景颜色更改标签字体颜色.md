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


1.这个JS对哪些页面生效?
由于在 Gmeek 中将其作为"全局引用JS"添加,它理论上会对全站生效。具体到页面类型:
·首页/列表页:最核心的生效场景。代码会处理文章列表下方的所有.listLabels 标签和日期。
·文章详情页:会对文章标题下方的分类标签(.post-tag)生效。
·搜索页归档页:代码中特意设置了 setInterval 定时执行,就是为了兼容搜索结果动态加载后,新出现的标签也能自动适配颜色。
2.代码是如何做到的?(实现逻辑)
·智能对比度算法(getAdaptiveColor): 它利用了亮度权重公式(0.299*R + 0.587*G + 0.114*B)。如果计算出的亮度超过0.6(偏浅色背景),文字会自动变黑;否则变白。这保证了无论标签背景是什么颜色,文字都能清晰可见。
·布局与内容分离:
·JS只管颜色:JS 遍历所有的标签类名
(如 .Label, .LabelName),只修改 color和text-shadoWo
·CSS 只管溢出:利用 flex-wrap:wrap 强制打破Gmeek 原生的 nowrap 限制,解决标签太多飞出屏幕的问题。

·动态监控:通过 Mutationobserver 监听网页根目录的属性变化。当你切换“暗黑模式"或”日间模式”时,JS会自动重新计算一次颜色。
3.需要注意什么?(避坑指南)
。性能考量:代码中使用了 setInterval(...,1500)。虽然1.5秒执行一次对现代手机性能影响微乎其微,但如果页面标签极多,可以观察是否有微小卡顿。

### 升级版本

这份升级版代码在保持文章中原有逻辑的基础上,加入了"性能锁”(防止重复计算)和更智能的"DOM 监听”*,这样甚至可以删掉那个1.5秒ー次的定时器,让代码运行得更优雅。


这样整合升级后的三大好处:
1.更省电/省资源:加入了 dataset.colorFixed 检查。原本的代码每1.5秒会强行计算一次所有标签,现在只要标签没变,它就会直接跳过计算,对手机浏览器非常友好。
2.响应更即时:通过contentobserver 监听 DOM 变化,只要搜索结果一出来,颜色会秒变,不需要等那1.5秒的定时器。
3.逻辑自闭环:颜色算法、模式切换、动态加载全部锁在一个闭包里,不会污染你博客的其他JS 变量。

```+js
(function() {
    // 1. 核心算法：根据背景色计算文字颜色
    function getAdaptiveColor(bg) {
        const rgb = bg.match(/\d+/g);
        if (!rgb || rgb.length < 3) return "#ffffff";
        const [r, g, b] = rgb.map(Number);
        const l = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return l > 0.6 ? "#000000" : "#ffffff";
    }

    // 2. 执行逻辑：适配颜色并标记，避免重复运算
    function syncLabelColors() {
        const selectors = '.Label, .LabelName, .post-tag, .listLabels span';
        document.querySelectorAll(selectors).forEach(el => {
            // 如果已经处理过且背景没变，就跳过（性能优化）
            if (el.dataset.colorFixed === "true" && !el.dataset.dirty) return;

            try {
                let bg = window.getComputedStyle(el).backgroundColor;
                if (bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') {
                    bg = window.getComputedStyle(el.parentElement).backgroundColor;
                }

                if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
                    const fg = getAdaptiveColor(bg);
                    const target = (el.tagName === 'A') ? el : (el.querySelector('a') || el);
                    
                    if (target && target.style) {
                        target.style.setProperty('color', fg, 'important');
                        target.style.setProperty('text-shadow', 'none', 'important');
                        el.dataset.colorFixed = "true"; // 标记已处理
                        delete el.dataset.dirty; 
                    }
                }
            } catch (e) {
                console.error("Gmeek颜色适配出错:", e);
            }
        });
    }

    // 3. 智能监听：不仅监听模式切换，还监听内容加载
    // 初始执行
    syncLabelColors();

    // 监听暗黑模式切换
    const themeObserver = new MutationObserver(() => {
        // 模式切换时，标记所有标签为“脏数据”，触发重新计算
        document.querySelectorAll('.Label, .LabelName').forEach(el => el.dataset.dirty = "true");
        syncLabelColors();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-color-mode'] });

    // 监听动态内容（如分页、搜索加载）
    const contentObserver = new MutationObserver(() => syncLabelColors());
    contentObserver.observe(document.body, { childList: true, subtree: true });

    // 保留一个低频补偿，防止极端情况（可选）
    setInterval(syncLabelColors, 3000);
})();

```


### 升级版js额外css补丁

每次打开搜索标签页面会看到一次标签文字"颜色闪动”
为了消除这种“闪动感”,我们要做的就是:在JS算好颜色之前,让文字先"隐身”或者保持透明。
这段代码会让标签文字默认“透明”,只有当我们的JS计算完颜色并加上 color 属性后,文字才会显现。这样你就只能看到"最终颜色”,而看不到"变色过程”。

不添加这个css补丁也可以，小细节修复而已，而且修复的效果也不是很大。

也可以用js版本1的，也就是升级之前的，但是又感觉影响性能…

```+css
/* 消除标签变色闪烁补丁 */
.Label, .LabelName, .post-tag, .listLabels span {
    color: transparent !important; /* 默认透明，等待 JS 处理 */
    transition: color 0.1s ease-in; /* 增加一个极短的过渡，让显现更自然 */
}
```


↓↓↓下面是不管用哪个版本js都要2选1，不然标签太多会右边溢出↓↓↓


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