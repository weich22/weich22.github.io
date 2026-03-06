```+css
/* 1. 设置文章条目的基础样式，准备过渡 */
.SideNav-item {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    border-left: 3px solid transparent !important; /* 预留左侧边框位 */
    background-color: transparent !important;
    border-radius: 6px !important;
    margin-bottom: 4px !important;
}

/* 2. 悬停时的浮起效果 */
.SideNav-item:hover {
    background-color: rgba(2, 122, 255, 0.05) !important; /* 极淡的蓝色背景 */
    transform: translateX(5px); /* 向右轻微平移，产生“被点中”的动感 */
    border-left: 3px solid #027aff !important; /* 左侧亮起主题蓝 */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* 淡淡的投影，产生浮起感 */
}

/* 3. 让文章标题在悬停时颜色也变一下 */
.SideNav-item:hover .SideNav-label {
    color: #027aff !important;
}

```