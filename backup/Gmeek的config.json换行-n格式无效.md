
config.json是Gmeek的配置文件，用的json格式，json格式非常严格，多一个或者少一个标点符号都会报错，然后Actions编译报错红色×。


Gmeek 框架将 subTitle 的内容直接渲染在了一个带有 style="margin-bottom: 16px;" 的 <div> 标签内。
在 HTML 中，普通 <div> 会忽略文本里的换行符（回车），所以 \n 会被解析成一个普通的空格，导致所有文字挤在一起。
要解决这个问题，最简单的办法是在 zdy.css（自定义 CSS 文件）中添加一行样式规则。
解决方案：修改 CSS
我在 zdy.css 文件中添加以下代码：

```+css
/* 针对首页内容区顶部的描述文字（个性签名）进行换行处理 */
#content > div[style*="margin-bottom: 16px"] {
    white-space: pre-wrap !important;
}
```


原理说明：
 * white-space: pre-wrap：这个属性的作用是让浏览器“保留”文本中的换行符。这样你在 JSON 里写的 \n 就会生效，文字会自动换行。
 * !important：确保这个样式优先级最高，不会被框架默认样式覆盖。
操作建议：
 * 保持 JSON 不变：在 config.json 中继续使用 \n，例如：


  ```+json
   "subTitle": "没有用功努力,不做没用的功!\nweich22.github.io\nGmeek群: 308721893"
```
 * 更新 CSS：将上面的代码加入 zdy.css 并提交到 GitHub。
 * 强制刷新：网页更新后，在浏览器按 Ctrl + F5 强制刷新即可看到效果。
这样处理的好处是：你不需要破坏 JSON 的结构，也不需要尝试不确定的 HTML 标签（br或者直接回车，实测直接回车报错），直接通过样式控制显示效果。
