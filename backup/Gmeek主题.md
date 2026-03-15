### 说明文档

这套代码的核心逻辑是**“结构重组 + 视觉模拟”**，将原本分散的网页元素包装成一个具有“窗口感”的整体布局。
以下是代码的功能总结：
🎨 CSS 部分：视觉重塑
 * 明暗模式自适应：通过 :root 和 [data-color-mode='dark'] 定义了两套颜色变量，确保窗口边框、背景和文字在深色主题下也能自动切换。
 * 全屏背景锁定：强制 html 和 body 使用浅灰色（或深色）背景，并消除边距，为模拟窗口提供一个干净的底层背景。
 * 模拟窗口三段式：
   * 头部 (#header)：模拟窗口标题栏，设置了圆角、背景色和边框，通过 margin-top 预留出顶部空间。
   * 主体 (#content)：通过 min-height: calc(100vh - 200px) 实现纵向拉伸，确保无论内容多少，窗口都能延伸至靠近屏幕底部。
   * 底部 (#footer)：作为窗口的收口，去掉了顶部边框，并与主体完美衔接，底部设置了圆角。
 * 组件细节优化：
   * 头像立体感：将 .avatar 向上移动并添加阴影，使其呈现出“悬浮”在窗口边缘的视觉效果。
   * 界面精简：隐藏了副标题、原生图标及多余的按钮，使整体视觉更加清爽。
⚙️ JavaScript 部分：逻辑重排
 * 动态节点搬运：由于 Gmeek 默认的 HTML 结构可能比较分散，这段脚本会自动寻找 #header、#content 和 #footer。
 * 结构合并：通过 insertBefore 逻辑，在页面加载时强行将这三个区块移动到一起，形成“头-身-尾”垂直排列的嵌套结构，这是实现“窗口一体化”效果的前提。
💡 维护小提示
 * 调整窗口长短：如果觉得窗口底部留白不合适，调整 CSS 中 #content 里的 200px 即可。
 * 调整宽度：目前的窗口宽度是屏幕的 95%（最大 900px），如需更改，调整 #header、#content、#footer 里的 width 值。
这套方案兼顾了原生美感和个性化定制，目前运行非常稳定。


删除所有自定义css和js，然后全局头部引用这个代码就好了。


### js代码

```+js
(function(){
    // 获取 Gmeek 原生的三个核心区块
    const h = document.querySelector("#header"),
          c = document.querySelector("#content") || document.querySelector(".main"),
          f = document.querySelector("#footer");
    
    // 如果头部和主体都存在，则进行结构重排
    if(h && c){
        // 将头部移到主体上方
        c.parentNode.insertBefore(h, c);
        // 如果有页脚，将其紧贴在主体下方
        if(f) c.parentNode.insertBefore(f, c.nextSibling);
    }
    console.log("Gmeek-SimWindow-Deployed");
})();

```

### css代码

```+css
/* 颜色变量定义 */
:root {--bg-main: #f0f2f5; --win-bg: #ffffff; --win-border: #999; --header-bg: #dee1e6; --text-p: #333;}
[data-color-mode='dark'] {--bg-main: #0d1117; --win-bg: #161b22; --win-border: #444; --header-bg: #30363d; --text-p: #adbac7;}

/* 整体背景拉伸 */
html, body, #main, .Gmeek-mainindex {background: var(--bg-main)!important; margin:0!important; height:auto!important; min-height:100vh!important;}

/* 模拟窗口头部：磁贴感 */
#header {display:flex!important; align-items:center!important; width:95%!important; max-width:900px!important; height:44px!important; margin:45px auto 0 auto!important; background:var(--header-bg)!important; border:1px solid var(--win-border)!important; border-radius:8px 8px 0 0!important; padding:0 15px!important; box-sizing:border-box!important; position:relative!important; z-index:1001!important}

/* 核心：拉伸白色主体填满屏幕 */
#content, .main, .list-content {display:block!important; width:95%!important; max-width:900px!important; margin:0 auto!important; background:var(--win-bg)!important; border-left:1px solid var(--win-border)!important; border-right:1px solid var(--win-border)!important; padding:20px!important; position:relative!important; z-index:1000!important; min-height:calc(100vh - 200px)!important; height:auto!important;}

/* 底部收口 */
#footer {display:block!important; width:95%!important; max-width:900px!important; margin:0 auto 60px auto!important; background:var(--win-bg)!important; border:1px solid var(--win-border)!important; border-top:none!important; border-radius:0 0 8px 8px!important; padding:20px!important; box-sizing:border-box!important; z-index:1000!important}

/* 原生组件微调：头像凸出与标题加粗 */
.SideNav {display:block!important; background:transparent!important; border:none!important; min-width:auto!important;}
.avatar {width:46px!important; height:46px!important; margin-right:12px!important; margin-top:-20px!important; border:2px solid var(--win-border)!important; background:var(--win-bg)!important; border-radius:8px!important; z-index:1002!important; box-shadow:0 4px 8px rgba(0,0,0,0.2)!important}
.blogTitle {display:inline-block!important; font-size:16px!important; color:var(--text-p)!important; margin-top:10px!important; font-weight:bold!important}
.subTitle, .SideNav-icon, .title-right .btn-octicon:first-child {display:none!important}

```


### 翻车了重做

原因是大屏整体视觉不太好，歪一边，是直接替换全部代码的。


🎨 CSS (视觉定义者)
​放置位置： zdy.css
核心逻辑：
这是解决你之前“大屏偏左”和“内容塌缩”问题的关键。
​全局宽度与居中：通过 max-width: 97% 让窗口在所有设备上都尽可能铺满，同时用 margin: 0 auto 强制让这 97% 的内容在屏幕正中央对齐。
​消除塌缩：使用 display: block 确保主体区域在大屏幕下不会收缩成一个窄条。
​首页与文章页统一：同时对 .main（首页列表）和 #content（文章正文）应用样式，保证全站风格一致，不会出现首页正常但文章页“歪掉”的情况。


###css

```+css
/* 颜色变量定义 */

:root {--bg-main: #f0f2f5; --win-bg: #ffffff; --win-border: #999; --header-bg: #dee1e6; --text-p: #333;}

[data-color-mode='dark'] {--bg-main: #0d1117; --win-bg: #161b22; --win-border: #444; --header-bg: #30363d; --text-p: #adbac7;}


/* 整体背景：设定 body 统一为 97% 并居中 */

html, body, #main, .Gmeek-mainindex {

background: var(--bg-main)!important; 

margin:0 auto!important; 

height:auto!important; 

min-height:100vh!important; 

display: block!important;

max-width: 97% !important; 

}


/* 模拟窗口头部：统一 97% 逻辑 */

#header {

display:flex!important; 

align-items:center!important; 

width:100%!important; /* 填满父级 body 的 97% */

height:44px!important; 

margin:45px auto 0 auto!important; 

background:var(--header-bg)!important; 

border:1px solid var(--win-border)!important; 

border-radius:8px 8px 0 0!important; 

padding:0 15px!important; 

box-sizing:border-box!important; 

position:relative!important; 

z-index:1001!important;

}


/* 模拟窗口主体：内容随外壳一起拉伸至 97% */

#content, .main, .list-content {

display:block!important; 

width:100%!important; 

margin:0 auto!important; 

background:var(--win-bg)!important; 


```
### js

​🛠️核心逻辑:由于 Gmeek原生的 HTML结构中,页头(#header)、主体(#content/.main)和页脚(#footer)是相互独立的。JS的作用是在页面加载时,把它们按顺序移动到一起,形成一个“盒子"。

```dos
(function(){

// 获取 Gmeek 原生的三个核心区块

const h = document.querySelector("#header"),

c = document.querySelector("#content") || document.querySelector(".main"),

f = document.querySelector("#footer");

// 如果头部和主体都存在，则进行结构重排

if(h && c){

// 将头部移到主体上方

c.parentNode.insertBefore(h, c);

// 如果有页脚，将其紧贴在主体下方

if(f) c.parentNode.insertBefore(f, c.nextSibling);

}

console.log("Window-Layout-Deployed-1200px");

})();


```

✅ 修改后的最终成效
​大屏幕：窗口拉伸到屏幕的 97% 宽度，左右各留 1.5% 的极细缝隙，视觉非常开阔且居中。
​内容一致性：无论是看文章列表还是具体的文章正文，宽度、边框和位置都完全重合，不会有跳变感。
​移动端：依然保持了 97% 的比例，在手机上看起来非常厚实且充满屏幕感。


### 又翻车文章标题太长溢出

更新修复一下，直接替换全部代码

### css

```dos
/* 1. 颜色变量 */
:root {--bg-main: #f0f2f5; --win-bg: #ffffff; --win-border: #999; --header-bg: #dee1e6; --text-p: #333;}
[data-color-mode='dark'] {--bg-main: #0d1117; --win-bg: #161b22; --win-border: #444; --header-bg: #30363d; --text-p: #adbac7;}

/* 2. 全局容器：统一 97% 宽度并居中 */
html, body, #main, .Gmeek-mainindex {
    background: var(--bg-main)!important; 
    margin: 0 auto!important; 
    height: auto!important; 
    min-height: 100vh!important; 
    display: block!important;
    max-width: 97% !important; 
}

/* 3. 模拟窗口头部：高度自适应 + 右侧预留空隙 */
#header {
    display: block!important; 
    width: 100%!important; 
    min-height: 44px!important; 
    height: auto!important; 
    margin: 45px auto 0 auto!important; 
    background: var(--header-bg)!important; 
    border: 1px solid var(--win-border)!important; 
    border-radius: 8px 8px 0 0!important; 
    padding: 10px 95px 10px 15px!important; /* 右侧 95px 为按钮禁区 */
    box-sizing: border-box!important; 
    position: relative!important; 
    z-index: 1001!important;
}

/* 4. 标题样式：自适应字号 + 自动换行 */
.blogTitle, .postTitle {
    display: block!important; 
    font-size: clamp(14px, 3.8vw, 17px)!important; /* 手机端自动缩小 */
    color: var(--text-p)!important; 
    font-weight: bold!important;
    white-space: normal!important; 
    word-break: break-all!important; 
    line-height: 1.3!important;
    margin: 0!important;
    text-align: left!important;
}

/* 5. 按钮组：固定在右上角，不随标题移动 */
.title-right {
    position: absolute!important; 
    right: 10px!important; 
    top: 10px!important; 
    display: flex!important; 
    gap: 5px!important;
}

/* 6. 主体内容与页脚：全站统一适配 */
#content, .main, .list-content {
    display: block!important; 
    width: 100%!important; 
    margin: 0 auto!important; 
    background: var(--win-bg)!important; 
    border-left: 1px solid var(--win-border)!important; 
    border-right: 1px solid var(--win-border)!important; 
    padding: 20px!important; 
    box-sizing: border-box!important;
    min-height: calc(100vh - 200px)!important;
}

#footer {
    display: block!important; 
    width: 100%!important; 
    margin: 0 auto 60px auto!important; 
    background: var(--win-bg)!important; 
    border: 1px solid var(--win-border)!important; 
    border-top: none!important; 
    border-radius: 0 0 8px 8px!important; 
    padding: 20px!important; 
    box-sizing: border-box!important;
}

/* 7. 原生组件清理 */
.subTitle, .SideNav-icon, .title-right .btn-octicon:first-child {display: none!important;}
.avatar {width: 46px!important; height: 46px!important; margin-right: 12px!important; margin-top: -20px!important; border: 2px solid var(--win-border)!important; background: var(--win-bg)!important; border-radius: 8px!important; z-index: 1002!important; box-shadow: 0 4px 8px rgba(0,0,0,0.2)!important;}

```
### js

```dos
(function(){
    // 1. 获取 头部、主体、底部 元素
    const h = document.querySelector("#header"),
          c = document.querySelector("#content") || document.querySelector(".main"),
          f = document.querySelector("#footer");
    
    if(h && c){
        // 2. 将头部搬运到主体上方
        c.parentNode.insertBefore(h, c);
        
        // 3. 【关键改动】将右侧按钮组挪到 header 的末尾，方便 CSS 绝对定位固定它
        const tr = h.querySelector(".title-right");
        if(tr) h.appendChild(tr);
        
        // 4. 将底部搬运到主体下方
        if(f) c.parentNode.insertBefore(f, c.nextSibling);
    }
})();

```

✅ 最终效果确认
​长标题：在窄屏上字体会轻微缩小，若仍装不下则自动换行，且绝对不会遮挡右侧图标。
​全站统一：首页和文章页都遵循 97% 宽度居中原则，看起来像一个完整的应用窗口。
​性能：移除了冗余的 flex 计算，直接使用盒模型 padding 保护，渲染更稳定。
​上线代码后如果在某些极窄的设备（如 300px 以下）还有微调需求，我们可以再调整 clamp 的最小值。