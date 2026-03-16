### 小屏居中


版本 A：经典居中限宽版 (Max-Width 1000px)
​特点：保留了 1000px 的最大宽度限制，在大屏上会保持居中长条状，视觉重心更集中，适合文字阅读。

```dos
/* --- Gmeek 页面样式格式化 --- */

/* 顶部标题栏 */
#header {
    background: #f1f3f4 !important;
    padding: 12px 15px !important;
    border: 1px solid #c1c1c1 !important;
    border-bottom: none !important;
    border-radius: 8px 8px 0 0 !important;
    width: 95% !important;
    max-width: 1000px !important;
    margin: 45px auto 0 auto !important; /* 顶部外边距 */
    box-sizing: border-box !important;
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important; /* 垂直居中对齐 */
}

/* 正文内容区 */
#content, .main {
    background: #fff !important;
    border: 1px solid #c1c1c1 !important;
    border-top: none !important;
    border-bottom: none !important;
    width: 95% !important;
    max-width: 1000px !important;
    margin: 0 auto !important;
    padding: 40px 30px !important;
    box-sizing: border-box !important;
    min-height: 70vh !important;
}

/* 底部栏 */
#footer {
    background: #fff !important;
    border: 1px solid #c1c1c1 !important;
    border-top: none !important;
    border-radius: 0 0 8px 8px !important;
    width: 95% !important;
    max-width: 1000px !important;
    margin: 0 auto 30px auto !important;
    padding: 20px 0 !important;
    box-shadow: 0 8px 20px rgba(0,0,0,0.1) !important;
}

/* 暗色模式适配 */
[data-color-mode='dark'] #header {
    background: #2d333b !important;
    border-color: #444c56 !important;
}

[data-color-mode='dark'] #content, 
[data-color-mode='dark'] .main, 
[data-color-mode='dark'] #footer {
    background: #22272e !important;
    border-color: #444c56 !important;
}

/* 博客标题样式 */
.blogTitle {
    display: block !important;
    font-size: 24px !important;
    font-weight: bold !important;
    color: #24292f !important;
    text-decoration: none !important;
}

[data-color-mode='dark'] .blogTitle {
    color: #adbac7 !important;
}

/* 右侧图标组（搜索、天气等） */
.title-right {
    display: flex !important;
    gap: 12px !important;
    z-index: 9999 !important;
    pointer-events: auto !important;
}

/* 隐藏冗余元素 */
.subTitle, .SideNav-icon {
    display: none !important;
}

```

### 大屏


版本 B：大屏全适配版 (Max-Width Unlocked)
​特点：彻底解除 900px 的限制，让页面在超宽屏幕上也能占据 95% 的宽度，适合喜欢极致大视野的用户。

```dos
/* --- Gmeek 全局大屏适配与 UI 修正 --- */


/* 1. 解除 body 宽度限制，适配大屏并恢复顶部间距 */

body {

width: 95% !important;

max-width: none !important; /* 核心：拆除 900px 限制墙 */

margin: 45px auto 0 auto !important; /* 恢复顶部 45px 间距，解决靠顶问题 */

padding: 0 !important;

}


/* 2. 标题栏：填满 body 宽度并实现垂直居中 */

#header {

background: #f1f3f4 !important;

padding: 12px 15px !important;

border: 1px solid #c1c1c1 !important;

border-bottom: none !important;

border-radius: 8px 8px 0 0 !important;

width: 100% !important;

box-sizing: border-box !important;

display: flex !important;

justify-content: space-between !important;

align-items: center !important; /* 图标与标题垂直中心对齐 */

}


/* 3. 正文内容区：同步 body 宽度 */

#content, .main {

background: #fff !important;

border: 1px solid #c1c1c1 !important;

border-top: none !important;

border-bottom: none !important;

width: 100% !important;

padding: 40px 30px !important;

box-sizing: border-box !important;

min-height: 70vh !important;

}

```



📋 总结对比
​两个版本都修复了 45px 的顶部间距，解决了页面死贴边缘的问题。
​均采用 flex 布局并设置 align-items: center，确保图标不会上下错位。
​主要区别在于 max-width：版本 A 随屏幕无限变宽，版本 B 锁定在 1000px 以内。