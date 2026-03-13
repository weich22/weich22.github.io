
```d
(function() {
    function getAdaptiveColor(bg) {
        const rgb = bg.match(/\d+/g);
        if (!rgb || rgb.length < 3) return "#ffffff";
        const [r, g, b] = rgb.map(Number);
        // 插件里的 0.6 阈值逻辑
        const l = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return l > 0.6 ? "#000000" : "#ffffff";
    }

    function solveAllLabels() {
        // 核心：增加对顶部标签云的选择支持 (.subnav-item, .listLabels span 等)
        const selectors = '.Label, .LabelName, .post-tag, .subnav-item, .listLabels span, .listLabels a';
        
        document.querySelectorAll(selectors).forEach(el => {
            try {
                // 1. 获取背景色（如果自身透明就抓父级）
                let bg = window.getComputedStyle(el).backgroundColor;
                if (bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') {
                    bg = window.getComputedStyle(el.parentElement).backgroundColor;
                }

                if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
                    const fg = getAdaptiveColor(bg);
                    
                    // 2. 深度适配文字目标
                    // 如果自己是 A 或 Button 直接改；否则找里面的 A；再找不到就改自己
                    const target = (el.tagName === 'A' || el.tagName === 'BUTTON') 
                                   ? el 
                                   : (el.querySelector('a') || el);
                    
                    if (target && target.style) {
                        target.style.setProperty('color', fg, 'important');
                        target.style.setProperty('text-shadow', 'none', 'important');
                    }
                }
            } catch (e) {
                // 针对动态加载的静默处理
            }
        });
    }

    // 初始化与循环监听
    solveAllLabels();
    setInterval(solveAllLabels, 1500); // 应对搜索页顶部的动态刷新
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