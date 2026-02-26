
### 简约版本

简约版本会生效，但是样式效果不太好而已，比如鼠标划过文字不会变色，文字不居中而已。

```dos
/* 1. 强制隐藏原始文本 */
.code-toolbar .toolbar-item a {
    color: transparent !important; /* 让原文字透明 */
    position: relative;
    display: inline-block;
}

/* 2. 注入“复制”文字 */
.code-toolbar .toolbar-item a::before {
    content: "复制"; /* 默认显示的文字 */
    color: #bbb;    /* 这里的颜色可以根据你的主题调整 */
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    font-size: 12px; /* 调整为你希望的大小 */
    pointer-events: none; /* 确保点击能穿透到下层的 a 标签 */
}

/* 3. 当点击成功后（Prism 会自动切换状态），改变文字 */
.code-toolbar .toolbar-item a[data-copy-state="copy-success"]::before {
    content: "已复制!";
    color: #4caf50; /* 成功时显示绿色 */
}

```

