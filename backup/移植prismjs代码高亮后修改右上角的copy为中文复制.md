
### 简约版本

简约版本会生效，但是样式效果不太好而已，比如鼠标划过文字不会变色，文字不居中而已。

```+css
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


### 终极修正样式版本

```+css
/* 精简版：只负责中文显示、居中和基础划过变色 */
.code-toolbar .toolbar-item a {
    color: transparent !important;
    position: relative;
    display: inline-flex !important;
    align-items: center;
    justify-content: center;
    min-width: 50px; /* 宽度够放“复制”二字即可 */
    text-decoration: none !important;
}

.code-toolbar .toolbar-item a::before {
    content: "复制";
    color: #999; 
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 12px;
    white-space: nowrap;
    transition: color 0.2s;
}

/* 划过变色，让用户知道这是个能点的按钮 */
.code-toolbar .toolbar-item a:hover::before {
    color: #666 !important; 
}

```

用CSS的“障眼法”(伪元素替换法)，把css放到你自定义引用的css文件里面去就好了，文章页面css和头部引用的css都可以，主要是懒去源文件找这几个字修改…


为什么我会放两个版本？因为每个人的博客都不太一样，根据每个人的博客修改的样式主题对应的，所以都放上去，万一有那个网友刚刚好对得上，可以用到…