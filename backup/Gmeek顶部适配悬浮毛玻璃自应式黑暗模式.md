```dos
/* --- A线程：全屏贯穿+自动适配明暗模式的导航栏 --- */
#header {
    /* 1. 基础布局：强制全屏贯穿 */
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 65px !important;
    display: flex !important;
    align-items: center !important;
    padding: 0 20px !important;
    z-index: 9999 !important;
    box-sizing: border-box !important;
    transition: all 0.3s ease !important; /* 让颜色切换更丝滑 */
    
    /* 2. 默认明亮模式样式 (白色毛玻璃) */
    background: rgba(255, 255, 255, 0.8) !important;
    backdrop-filter: blur(15px) !important;
    -webkit-backdrop-filter: blur(15px) !important;
    border: none !important;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08) !important;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05) !important;
}

/* --- 3. 核心：黑暗模式适配 --- */
/* 当 Gmeek 检测到黑暗模式时，会自动给 html 加上这个属性 */
[data-color-mode="dark"] #header {
    background: rgba(13, 17, 23, 0.8) !important; /* 深黑色半透明 */
    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4) !important;
}

/* 黑暗模式下的文字和图标颜色微调 */
[data-color-mode="dark"] .blogTitle, 
[data-color-mode="dark"] .title-right {
    color: #f0f6fc !important;
}

/* --- 4. 解决遮挡问题 --- */
/* 确保文章内容向下移动，不被固定的导航栏挡住 */
#content, .main {
    margin-top: 85px !important;
}

```

### 更新修复长标题溢出

替换全部css

```dos
/* --- A 线程：全屏毛玻璃悬浮 (由 B 线程布局优化) --- */
#header {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    min-height: 65px !important;
    height: auto !important;
    /* 核心视觉：A 线程的毛玻璃 */
    background: rgba(255,255,255,0.7) !important;
    backdrop-filter: blur(12px) !important;
    -webkit-backdrop-filter: blur(12px) !important;
    padding: 12px 20px !important;
    border-bottom: 1px solid rgba(0,0,0,0.1) !important;
    /* 核心布局：B 线程的 Flex 避让，彻底甩掉 JS */
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    z-index: 9999 !important;
    box-sizing: border-box !important;
}

/* 黑暗模式：保持 A 线程的通透感 */
[data-color-mode='dark'] #header {
    background: rgba(13,17,23,0.7) !important;
    border-color: rgba(255,255,255,0.1) !important;
}

/* 标题逻辑：支持换行且不挤压按钮 */
.blogTitle, .postTitle {
    display: block !important;
    font-size: clamp(18px, 5vw, 24px) !important;
    font-weight: bold !important;
    color: #24292f !important;
    text-decoration: none !important;
    word-break: break-all !important;
    line-height: 1.3 !important;
    margin: 0 !important;
    flex: 1 !important;
    padding-right: 15px !important;
}

[data-color-mode='dark'] .blogTitle, [data-color-mode='dark'] .postTitle {
    color: #adbac7 !important;
}

/* 按钮组：靠 CSS 守住右侧，不位移 */
.title-right {
    display: flex !important;
    gap: 12px !important;
    flex-shrink: 0 !important;
    z-index: 10000 !important;
}

/* 内容区：移除所有 B 线程的边框窗口效果，回归纯净布局 */
#content, .main {
    margin: 85px auto 0 auto !important;
    padding: 0 20px !important;
    width: auto !important;
    max-width: 900px !important;
    background: transparent !important; /* 移除 B 的白背景 */
    border: none !important; /* 彻底移除 B 的边框线 */
}

.subTitle, .SideNav-icon { display: none !important; }

```


第二个版本css要用的话也是全部替换，差不多的，最大区别就是去除了多余宽度限制大小。


```dos
/* --- A 线程修复：全屏毛玻璃 (彻底移除 B 的宽度限制) --- */
#header {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    min-height: 65px !important;
    height: auto !important;
    background: rgba(255,255,255,0.7) !important;
    backdrop-filter: blur(12px) !important;
    -webkit-backdrop-filter: blur(12px) !important;
    padding: 12px 20px !important;
    border-bottom: 1px solid rgba(0,0,0,0.1) !important;
    z-index: 9999 !important;
    box-sizing: border-box !important;
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
}

[data-color-mode='dark'] #header {
    background: rgba(13,17,23,0.7) !important;
    border-color: rgba(255,255,255,0.1) !important;
}

/* 标题布局优化 */
.blogTitle, .postTitle {
    display: block !important;
    font-size: clamp(18px, 5vw, 24px) !important;
    font-weight: bold !important;
    color: #24292f !important;
    text-decoration: none !important;
    word-break: break-all !important;
    line-height: 1.3 !important;
    margin: 0 !important;
    flex: 1 !important;
    padding-right: 15px !important;
}

[data-color-mode='dark'] .blogTitle, [data-color-mode='dark'] .postTitle {
    color: #adbac7 !important;
}

.title-right {
    display: flex !important;
    gap: 12px !important;
    flex-shrink: 0 !important;
    z-index: 10000 !important;
}

/* --- 回归图1布局：移除 width 95% 和 max-width --- */
#content, .main {
    margin: 85px auto 0 auto !important;
    padding: 0 20px !important;
    width: auto !important; /* 恢复自动宽度 */
    max-width: none !important; /* 彻底移除宽度上限 */
    background: transparent !important;
    border: none !important;
}

.subTitle, .SideNav-icon { display: none !important; }

```