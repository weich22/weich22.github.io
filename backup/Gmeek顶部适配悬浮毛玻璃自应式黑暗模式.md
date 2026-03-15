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