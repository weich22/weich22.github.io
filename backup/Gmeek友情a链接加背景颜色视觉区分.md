### 友情链接加背景颜色框

这个是新添加进去的

```+js
/**
 * Gmeek 链接卡片化脚本（无额外容器版）
 * 作用：将 /link.html 页面中 #content 内的链接（及前面的图标）用圆角卡片框起来
 * 不影响导航栏，不添加 .card-container 容器，卡片自然换行
 */
document.addEventListener('DOMContentLoaded', function() {
    // 只在 /link.html 或 link.html 页面执行
    if (location.pathname !== '/link.html' && location.pathname !== 'link.html') return;

    try {
        // 1. 注入卡片样式（移除了 .card-container 定义）
        const style = document.createElement('style');
        style.textContent = `
            /* 卡片样式：包裹图标和链接 */
            .card-wrap {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                background: #f6f8fa;
                border: 1px solid #d0d7de;
                border-radius: 40px;
                padding: 6px 18px 6px 14px;
                transition: .2s;
                margin: 0 4px 8px 0;
            }
            .card-wrap:hover {
                background: #0969da;
            }
            .card-wrap:hover a,
            .card-wrap:hover .card-icon {
                color: #fff;
            }
            /* 图标样式 */
            .card-icon {
                font-size: 1.2rem;
                line-height: 1;
            }
            /* 链接文字样式 */
            .card-wrap a {
                text-decoration: none;
                color: #0969da;
                font-size: .9rem;
                font-weight: 500;
            }
            /* 深色模式适配 */
            @media (prefers-color-scheme: dark) {
                .card-wrap {
                    background: #21262d;
                    border-color: #30363d;
                }
                .card-wrap a {
                    color: #4493f8;
                }
            }
        `;
        document.head.appendChild(style);

        // 2. 匹配常见 emoji 的正则表达式
        const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}]/u;

        // 3. 只处理 #content 区域内的所有链接（避免影响导航栏）
        const contentLinks = document.querySelectorAll('#content a');
        contentLinks.forEach(link => {
            // 避免重复处理已经被包裹过的链接
            if (link.parentElement?.classList?.contains('card-wrap')) return;

            let icon = null;

            // 3.1 检查链接前面的文本节点（可能包含图标）
            let prev = link.previousSibling;
            // 跳过空白的文本节点并删除它们
            while (prev && prev.nodeType === 3 && (!prev.textContent || prev.textContent.trim() === '')) {
                const toRemove = prev;
                prev = prev.previousSibling;
                toRemove.remove();
            }

            if (prev && prev.nodeType === 3 && prev.textContent) {
                // 尝试匹配文本开头的 emoji
                const match = prev.textContent.match(new RegExp('^[\\s]*' + emojiRegex.source, 'u'));
                if (match) {
                    icon = match[0].trim(); // 提取到的图标
                    const rest = prev.textContent.replace(match[0], '').trim();
                    if (rest && !/^[\d\s\W]+$/.test(rest)) {
                        // 保留有意义的剩余文本（不是纯数字/符号）
                        prev.textContent = rest;
                    } else {
                        // 剩余内容无意义，直接删除该文本节点
                        prev.remove();
                    }
                }
            }

            // 3.2 如果前面没有文本节点图标，检查前面的元素节点（比如 <span>📖</span>）
            if (!icon) {
                const prevEl = link.previousElementSibling;
                if (prevEl && prevEl.textContent && emojiRegex.test(prevEl.textContent.trim())) {
                    icon = prevEl.textContent.trim();
                    prevEl.remove(); // 删除原来的图标元素
                }
            }

            // 3.3 创建卡片容器，将图标和链接一起框起来
            const wrapper = document.createElement('span');
            wrapper.className = 'card-wrap';

            if (icon) {
                const iconSpan = document.createElement('span');
                iconSpan.className = 'card-icon';
                iconSpan.textContent = icon;
                wrapper.appendChild(iconSpan);
            }

            // 将原链接移动到卡片容器内
            link.parentNode.insertBefore(wrapper, link);
            wrapper.appendChild(link);
        });

        // 4. 清理可能残留的空白文本节点（针对卡片父级）
        document.querySelectorAll('.card-wrap').forEach(wrapper => {
            const parent = wrapper.parentNode;
            // 如果父级内只有一个子节点（卡片本身）且没有其他文本节点，则不需要处理
            if (parent.children.length === 1 && parent.childNodes.length === 1) return;

            let prev = parent.previousSibling;
            while (prev && prev.nodeType === 3 && (!prev.textContent || prev.textContent.trim() === '')) {
                const toRemove = prev;
                prev = prev.previousSibling;
                toRemove.remove();
            }
        });

        // 注意：不再创建 .card-container，卡片直接以 inline-flex 排列，自然换行
    } catch(e) {
        // 静默失败，不干扰页面
    }
});
```



### 并修正标注文字显示右边溢出

```+css
   /*友情链接获取焦点显示标题*/

/* 让 .card-wrap 作为定位祖先（用于限制提示框宽度） */
.card-wrap {
    position: relative !important;
}

/* 移除链接自身的相对定位，让提示框相对于 .card-wrap 定位 */
#postBody a.tooltip-link {
  position: static !important;
}

/* 提示框样式：保留原有视觉效果，但覆盖定位和宽度等关键属性 */
#postBody a.tooltip-link::after {
  /* 原有内容与基础样式 */
  content: attr(data-title);
  position: absolute;
  top: 100%;
  margin-top: 6px;
  background: #333;
  color: #fff;
  padding: 0px 5px;
  border-radius: 4px;
  font-size: 13px;
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s;
  line-height: 1.5;

  /* 关键覆盖（来自 F12 有效代码，带 !important） */
  left: 0 !important;
  right: auto !important;
  width: max-content !important;      /* 短文字背景不浪费 */
  max-width: 100% !important;         /* 最长不超过父卡片宽度，永不右侧溢出 */
  white-space: normal !important;
  word-break: break-word !important;
  box-sizing: border-box !important;
}

/* 显示提示框 */
#postBody a.tooltip-link:hover::after,
#postBody a.tooltip-link:focus::after {
  opacity: 1;
  visibility: visible;
}

```

这个如果有了原文章的代码的话，就直接全部替换进去

[原文章在这](https://g.weich.ee/post/9.html)
为什么要在这更新？因为添加背景颜色框添加了一个锚点（.card-wrap）修正的时候根据这个锚点定位的。