### 自定义优化首页CSS
添加代码到config.json，请删除我写的中文和括号

```+css
"indexStyle":"<style>a.blogTitle {display: inline-block !important;}【优化手机端不显示博客顶部LOGO文字】.d-flex {display: inline-block !important;}【调节文章标签到文章下】.Label, .label {line-height: 12px !important;}【文章标签背景颜色框缩小一点】.LabelTime {display: inline-block !important;}【调节文章标签到手机显示不全或者不显示后面的日期】</style>",
```


不限制博客首页最大宽度，直接添加在上面的</style>标签内

```css
body {max-width: initial !important;}
```



不限制文章页面最大宽度
```css
"style":"<style>body {max-width: initial !important;}</style>",
```

更新：后面我发现我需要是全局修改，于是我直接把代码统一整合写的到一个css文件里面去

```css
body {max-width: initial !important;}
a.blogTitle {display: inline-block !important;}/*优化手机端不显示博客顶部LOGO文字*/
.d-flex {display: inline-block !important;}/*调节文章标签到文章下*/
.Label, .label {line-height: 12px !important;}/*文章标签背景颜色框缩小一点*/
.LabelTime {display: inline-block !important;}/*调节文章标签到手机显示不全或者不显示后面的日期*/
```



然后上传到`static/assets/`文件夹内再添加代码到config.json引用就好了。

```html
"allHead":"<link rel=\"stylesheet\" href='https://weich22.github.io/assets/zdy.css'>",
```



### 资源链接引用方式推荐
推荐如下这样引用，为了预防以后更换域名，https问题很多现代浏览器不给你加载会发生错误，就是不要前面的域名以根目录斜杠 `/` 顶替你的域名，会自动帮你解析访问的本站绑定的域名上去。
```html
"allHead":"<link rel=\"stylesheet\" href='/assets/zdy.css'>",

```

### 添加友情链接
添加代码到config.json
[参考地址](https://blog.meekdai.com/post/%E3%80%90Gmeek-jin-jie-%E3%80%91-you-shang-jiao-yuan-an-niu-pei-zhi.html#%E7%AB%99%E5%86%85%E9%93%BE%E6%8E%A5)

```
"singlePage":["link"],
```
上面菜单找到`Issues`点开——新建一个文章`New issue`在靠近右边屏幕，添加标签必须为`link`，然后发布保存，再去全局生成.



### Gmeek在GITHUB全局生成
修改或者添加页面都需要做一次，发表文章除外，不过发生错误的时候也可以去全局生成试试.
在顶部菜单找到：`Actions`点开——左边的菜单找到【手机需要横屏或者也是在Actions页面找到`All workflows`下拉才能看到】`build Gmeek`点开——右边找到`Run workflow`点开下拉找到`Run workflow`点击，然后继续在Actions页面刷新等待查看处理好了没。
特别是：修改了config.json后，
通过Actions->build Gmeek->Run workflow->里面的按钮全局重新生成一次，不然配置不生效。

![Gmeek修改配置之后需要全局生成](https://github.com/user-attachments/assets/7b38e795-b4a5-4483-a084-d99b04ee71a1)

### Gmeek修改文章
上面菜单占到`Issues`点开，找到要修改的文章标题点开，文章顶部有3个...点开找到`Edit`附近还有一个笔🖊一样的图标点开就可以修改文章了，修改完成后，文章底部有 Cancel 和 Save 的文字分别为 取消 和 保存，查看Issues写的文章历史修改，点开文章顶部有文字是： `Edits` ，能看到下面图片的话，就是图片标准的下方往左边一点。

![Gmeek在Issues直接修改文章](https://github.com/user-attachments/assets/9a8d9b2c-0f20-49e2-a052-712a79030ef1)

### 修改文件
比如经常修改`config.json` 点开文件后找到文件上方的一个笔🖊型图标点开文字是： `Edit this file`（手机页面显示是：In placee ，后面有个e字）修改完成了，在文件顶部找到 `GmeekCommit changes...`点开再找到`GmeekCommit changes`点击一次，修改Code里面的文件要去全部生成一次才会生效的.


### Gmeek安装
【仅需一个Github账号，让文字在互联网中永生 超轻量级个人博客框架Gmeek-哔哩哔哩】 
视频：[https://b23.tv/LI3hM7E](https://b23.tv/LI3hM7E)
图文：[https://b23.tv/ikbKm1j](https://b23.tv/ikbKm1j)
github：[Gmeek项目和说明](https://github.com/Meekdai/meekdai.github.io/issues/39)

`Gmeek-html<iframe src="//player.bilibili.com/player.html?isOutside=true&aid=1305790042&bvid=BV1GM4m1m7ZD&cid=1588230883&p=1&autoplay=0" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>`


### Gmeek嵌入外部网站视频
比如b站
主要代码：
```html
`Gmeek-htmlxxx`
```
其中的xxx是改成if的嵌入代码，比如b站的嵌入代码，又在哪找呢？
用电脑网页打开一个b站视频，找到视频下面的分享就有`嵌入代码`了，如果是手机编写文章的话，也可以用浏览器请求打开电脑页面也是一样，具体看你用的是哪个浏览器，有的手机电脑浏览好了直接有电脑模式什么的。


禁止自动播放方法很简单，就是在视频 url 链接最后加上 `&autoplay=0`，例如：
```+html
<iframe src="//player.bilibili.com/player.html?isOutside=true&aid=1305790042&bvid=BV1GM4m1m7ZD&cid=1588230883&p=1&autoplay=0"
```
后面还有一段原复制的嵌入代码，那个不算视频url链接，应该是说属于参数而已吧。


### Gmeek UI增强插件
[参考：Gmeek UI 增强插件](https://code.buxiantang.top/post/🍎 Gmeek UI -zeng-qiang-cha-jian-shi-yong-jiao-cheng.html)
也就是添加一个css和一个js文件并引用到：`Code`的`config.json`文件内

```+html
"allHead":"<link rel=\"stylesheet\" href=\"https://weich22.github.io/assets/GmeekBaseTheme.css\"><script src=\"https://weich22.github.io/assets/GmeekCustomizeCss.js\"></script><script src='https://weich22.github.io/assets/GmeekVercount.js'></script>",
```
`GmeekBaseTheme.css`和`GmeekCustomizeCss.js`文件，也可以自己本地化两个文件保存下来上传到项目的`static/assets`文件夹内，没有这个文件夹的自己创建，创建`static`文件夹的时候在后面加个斜杠就是文件夹了，`assets`也是一样的，`static/assets/`斜杠最后随便创建个文件比如`123.txt`也可以，创建好了再去删除那个不用的TXT文件就好了，引用的地址是你的 `主链接` 加 `忽略static文件夹` 之后的 `assets文件夹` `加文件名` 作为地址就好了，其实我也不知道有多大用，先加了再说…
更新：已经去除，但是保留文件。

### 添加文章目录和文章图片灯箱

[参考：文件目录和文章图片灯箱插件](https://blog.meekdai.com/post/【Gmeek-jin-jie-】-cha-jian-gong-neng-de-shi-yong.html#articletoc)

文章目录是articletoc.js和文章图片灯箱lightbox.js两个文件
我用的文章目录是 `articletoc` 的，因为我觉得这个在文章右下角只有一个图标需要的时候点开好点。
也是可以本地化，如上面的上转到一个文件夹可以引用，我的也是本地化了，预防别人项目不在了或者改变了，自己的还在，但是别人更新了，只能自己再去下载上传。

```+html
"script":"<script src='https://weich22.github.io/assets/articletoc.js'></script><script src='https://weich22.github.io/assets/lightbox.js'></script>",
```
### 评论区自动展开
添加代码到config.json，实测会影响到文章目录和返回顶部这两个功能。

```js
"script":"<script>document.getElementById('cmButton').click();</script>",
```

### 添加返回顶部按钮
这个是ArticleTOC文章目录集成返回顶部一起的,注意文件名大小写，我改名文件后面加top：ArticleTOCtop，为了方便记住多加了一个返回顶部功能用的，这个打开文章的文章目录默认是打开状态的，然后返回顶部按钮在文章目录表下面的。
[ArticleTOC](https://cdn.jsdelivr.net/gh/EchoZap/echozap.github.io/static/plugins/ArticleTOC.js)

还发现一个返回顶部的独立版本，这个版本的话独立再文章目录上面的。
[backtop](https://github.com/tiengming/tiengming.github.io/blob/main/static/assets/backtop.js)

### 修改文章链接

默认是：
```
"urlMode":"pinyin",
```
上面默认（虽然配置文件没有填写）文章链接会以文章标题拼音为链接，有的人文章标题有图标，拿到别的地方解析不出来，链接又太长，所以改成下面简短issue数字编号。

没有就直接添加，已经有上面就修改成如下：
```
"urlMode":"issue",
```
添加到Gmeek里面的配置文件：config.json里面去。

### 添加主页链接
不添加的话你绑定自定义域名后，博客上面菜单栏的主页家园图标链接会是原来github新建时候的链接，里面的链接改成你的链接，然后添加到Gmeek的配置文件config.json里面去。

```
"homeUrl":"https://g.weich.ee",
```

### 给Gmeek自带代码高亮加边框

```+css
.markdown-body pre {border: 1px solid #cdcaca}
```