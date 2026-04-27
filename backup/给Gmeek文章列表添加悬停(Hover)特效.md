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
```


·非对称动效:通过translatex(5px)而不是简单的放大,视觉上会有一种"列表项向你招手"的感觉,非常符合阅读习惯。
·贝塞尔曲线(cubic-bezier):我特意使用了自定义的加速曲线,这比标准的 ease 看起来更灵动,更有"弹性”。
·低功耗:同样利用了 transform属性,直接交给 GPU渲染,即便文章列表很长,滑动起来也依然丝滑。


### 更新成金色传说效果

```+css
/* 文章条目：纯静态金黄色悬浮（无发黑感） */
.SideNav-item {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    border-left: 3px solid transparent !important;
    background-color: transparent !important;
    border-radius: 6px !important;
    margin-bottom: 4px !important;
}

.SideNav-item:hover {
    /* 使用亮金(#f1c40f)与黄金(#ffd700)组合，杜绝发黑 */
    background: linear-gradient(90deg, #f1c40f, #ffd700, #f1c40f) !important;
    
    /* 动作保留 */
    transform: translateX(5px) !important;
    border-left: 3px solid #027aff !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
}


```