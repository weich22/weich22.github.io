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
    function getAdaptiveColor(bg) {
        const rgb = bg.match(/\d+/g);
        if (!rgb || rgb.length < 3) return "#ffffff";
        const [r, g, b] = rgb.map(Number);
        const l = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return l > 0.6 ? "#000000" : "#ffffff";
    }

    function syncLabelColors() {
        const selectors = '.Label, .LabelName, .post-tag, .listLabels span, .listLabels a';
        document.querySelectorAll(selectors).forEach(el => {
            // 如果已经处理过且没有脏标记，跳过
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
                        el.dataset.colorFixed = "true";
                        delete el.dataset.dirty; 
                    }
                }
            } catch (e) {}
        });
    }

    // 1. 初始执行：前 5 秒内高频检测（解决搜索/标签页加载慢的问题）
    syncLabelColors();
    let count = 0;
    const initTimer = setInterval(() => {
        syncLabelColors();
        if (++count > 10) clearInterval(initTimer); // 5秒后停止高频
    }, 500);

    // 2. 监听：模式切换（强制重算）
    const themeObserver = new MutationObserver(() => {
        document.querySelectorAll('.Label, .LabelName, .post-tag, .listLabels span').forEach(el => {
            el.dataset.dirty = "true";
        });
        syncLabelColors();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-color-mode'] });

    // 3. 监听：动态内容加载
    const contentObserver = new MutationObserver(() => syncLabelColors());
    contentObserver.observe(document.body, { childList: true, subtree: true });

    // 4. 兜底：低频检查
    setInterval(syncLabelColors, 3000);
})();

```


### 升级版js额外css补丁

每次打开搜索标签页面会看到一次标签文字"颜色闪动”
为了消除这种“闪动感”,我们要做的就是:在JS算好颜色之前,让文字先"隐身”或者保持透明。
这段代码会让标签文字默认“透明”,只有当我们的JS计算完颜色并加上 color 属性后,文字才会显现。这样你就只能看到"最终颜色”,而看不到"变色过程”。

不添加这个css补丁也可以，小细节修复而已，而且修复的效果也不是很大，而且还有别的弊端就是网络和性能慢的话，标签上面空白很久文字透明看不到…

也可以用js版本1的，也就是升级之前的，但是又感觉影响性能…

```+css
/* 消除标签变色闪烁补丁 */
.Label, .LabelName, .post-tag, .listLabels span {
    color: transparent !important; /* 默认透明，等待 JS 处理 */
    transition: color 0.1s ease-in; /* 增加一个极短的过渡，让显现更自然 */
}
```

### 再次更新js版本


修改说明:
1. 根治控制台报错:彻底去掉了
contentobserver.obse-ve(document.body, ...)。在link.html 这种自定义页面或Gmeek 脚本加载极快的情况下,document.body往往还是 nul1,删掉它是最直接的减法。
2.性能优化:原代码监控了整个页面的 subtree,对性能
有一定开销。现在的3秒一次循环(第4步)完全能覆盖动态加载需求,且由于有
dataset.colorFixed 标记,不会重复计算,非常轻量。
3.兼容性:保留了所有的标签颜色自适应逻辑,无论是文章页还是友情链接页都能正常工作。
上线后,刷新页面查看控制台,那个红色的 TурeError 报错应该就彻底消失了，我实测是消失了，但是得具体看个人博客，有的有可能不太一样，所以还是建议去看看。

```+js
(function() {
    function getAdaptiveColor(bg) {
        const rgb = bg.match(/\d+/g);
        if (!rgb || rgb.length < 3) return "#ffffff";
        const [r, g, b] = rgb.map(Number);
        const l = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return l > 0.6 ? "#000000" : "#ffffff";
    }

    function syncLabelColors() {
        const selectors = '.Label, .LabelName, .post-tag, .listLabels span, .listLabels a';
        document.querySelectorAll(selectors).forEach(el => {
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
                        el.dataset.colorFixed = "true";
                        delete el.dataset.dirty; 
                    }
                }
            } catch (e) {}
        });
    }

    // 1. 初始执行：前 5 秒内高频检测
    syncLabelColors();
    let count = 0;
    const initTimer = setInterval(() => {
        syncLabelColors();
        if (++count > 10) clearInterval(initTimer);
    }, 500);

    // 2. 监听：模式切换（强制重算）
    const themeObserver = new MutationObserver(() => {
        document.querySelectorAll('.Label, .LabelName, .post-tag, .listLabels span').forEach(el => {
            el.dataset.dirty = "true";
        });
        syncLabelColors();
    });
    
    // 增加防御性判断，确保 html 节点存在
    if (document.documentElement) {
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-color-mode'] });
    }

    // --- 删除了原本导致报错的第 3 步监听 (document.body) ---

    // 4. 兜底：低频检查（每 3 秒处理一次新加载的内容，不再报错）
    setInterval(syncLabelColors, 3000);
})();

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

###修补版本一部分优化

```dos
/* 1. 只给文章列表页的标签容器加顶部间距（拉开标签标题距离） */
.listLabels {
    margin-top: 14px !important;
}

/* 2. 只有在列表容器里的标签，才应用微小的底部正边距，防止标签换行打架 */
.listLabels .Label, 
.listLabels .LabelName, 
.listLabels .LabelTime {
    margin-bottom: 4px !important; 
}

/* 3. 针对文章列表项整体缩减底部内边距（标题下标签的底部距离缩小），从视觉上把整体往上提，不用负数 margin */
.SideNav-item {
    padding-bottom: 8px !important;
}

/* 4. 单独强制标签云保持默认或自己喜欢的样式，互不干扰 */
#taglabel .Label {
    margin-bottom: 8px !important; /* 标签云建议留大一点，方便手指点击 */
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

###  更新加支持文章标签字体适配颜色

用的是（再次更新js版本号修改的，直接替换这个的全部代码就行）


```dos
(function() {
    // 1. 核心算法：根据背景 RGB 计算亮度，决定字体颜色
    function getAdaptiveColor(bg) {
        const rgb = bg.match(/\d+/g);
        if (!rgb || rgb.length < 3) return "#ffffff";
        const [r, g, b] = rgb.map(Number);
        // 使用亮度感知算法
        const l = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return l > 0.6 ? "#000000" : "#ffffff";
    }

    // 2. 执行颜色同步
    function syncLabelColors() {
        // 覆盖首页、搜索页、标签页、以及文章内注入的所有标签选择器
        const selectors = '.Label, .LabelName, .post-tag, .listLabels span, .listLabels a, #customLabels a';
        document.querySelectorAll(selectors).forEach(el => {
            // 如果已经处理过且没有被标记为需要重算，则跳过
            if (el.dataset.colorFixed === "true" && !el.dataset.dirty) return;
            
            try {
                let bg = window.getComputedStyle(el).backgroundColor;
                // 如果当前元素透明，则尝试抓取父元素的背景色
                if (bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') {
                    bg = window.getComputedStyle(el.parentElement).backgroundColor;
                }
                
                if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
                    const fg = getAdaptiveColor(bg);
                    const target = (el.tagName === 'A') ? el : (el.querySelector('a') || el);
                    
                    if (target && target.style) {
                        target.style.setProperty('color', fg, 'important');
                        target.style.setProperty('text-shadow', 'none', 'important');
                        el.dataset.colorFixed = "true";
                        delete el.dataset.dirty; 
                    }
                }
            } catch (e) {}
        });
    }

    // --- 执行逻辑 ---

    // 初始执行：前 5 秒高频检测，确保内容加载出来后能第一时间变色
    syncLabelColors();
    let count = 0;
    const initTimer = setInterval(() => {
        syncLabelColors();
        if (++count > 10) clearInterval(initTimer);
    }, 500);

    // 模式切换监听：点击“太阳/月亮”切换主题时，强制所有标签重新计算
    if (document.documentElement) {
        new MutationObserver(() => {
            document.querySelectorAll('.Label, .LabelName, .post-tag, .listLabels span, #customLabels a').forEach(el => {
                el.dataset.dirty = "true";
            });
            syncLabelColors();
        }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-color-mode'] });
    }

    // 兜底检查：每 3 秒检查一次（处理如翻页、评论区加载等新产生的标签）
    setInterval(syncLabelColors, 3000);
})();

```


​📝 核心原理：它是怎么工作的？
​亮度感知算法 (Luma)：
​代码通过读取标签的背景 RGB 值，利用公式：L = 0.299R + 0.587G + 0.114B 来计算亮度。
​结论：如果亮度值超过 0.6（偏浅色），字体强行转为黑色；否则，保持白色。这比固定的颜色配置要聪明得多。
​多重监测机制：
​初次高频：前 5 秒内每 0.5 秒扫一次，确保刚打开页面时标签就能变色。
​模式监听：用了 MutationObserver。当你点击切换“深色/浅色”模式时，它会瞬间察觉并重新计算所有标签。
​低频兜底：每 3 秒扫一次，防止以后有异步加载的评论标签或翻页内容漏掉。
​⚠️ 后期维护注意事项
​选择器扩展：
​目前代码里包含了 .Label, .post-tag, #customLabels a 等常见类名。如果你以后修改了 CSS 类名，或者新增了某种样式的标签，只需在代码最前面的 const l = '...' 字符串里把新的类名加进去即可。
​性能优化：
​代码中使用了 dataset.colorFixed 标记。这意味着： 已经处理过且背景没变的标签，脚本不会重复计算，这极大节省了手表微弱的 CPU 资源。
​优先级冲突：
​脚本使用了 .setProperty('color', f, 'important')。这具有最高优先级，能覆盖绝大多数 Gmeek 原生的 CSS 定义，所以一般不需要再去修改 CSS 文件。



​🚀 不消耗性能？（三大护法）
​“已处理”标记位（最重要的拦截）
​代码里有一句 if (e.dataset.colorFixed === "true" && !e.dataset.dirty) return;。
​原理：每个标签只要被计算过一次，就会被打上一个“已搞定”的标签（colorFixed）。下次循环扫描到它时，脚本一看标记，直接跳过，连 1 微秒的计算都不浪费。
​智能监听 (MutationObserver)
​它不是靠不停刷屏来检测主题切换的。只有当你手动点击了太阳/月亮图标，改变了网页的 data-color-mode 属性时，它才会“醒来”把标签标记为 dirty（脏数据），触发一次重新计算。平时这个监听器是静默的，完全不占 CPU。
​极低频的“捡漏”机制
​最后的 setInterval(s, 3000) 频率只有 3 秒一次。对于现代浏览器（哪怕是手表上的内核）来说，这种频率的简单 DOM 遍历（而且还是被标记位秒杀拦截的遍历）就像呼吸一样轻量。
​⚠️ 注意事项（后期维护）
​唯一需要重算的情况：如果你之后用其他 JS 动态生成了全新的标签（比如点开某个折叠菜单后才出来的标签），这 3 秒一次的“捡漏”机制就会派上用场。
​不要轻易删掉 !important：Gmeek 自身的 CSS 权重很高，代码里的 !important 保证了我们的自适应颜色能稳稳压住系统默认颜色，不会出现“闪烁”的情况。