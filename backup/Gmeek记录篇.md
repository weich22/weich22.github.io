##自定义优化首页CSS##，添加代码到config.json，请删除我写的中文和括号
```css
"indexStyle":"<style>a.blogTitle {display: inline-block !important;}【优化手机端不显示博客顶部LOGO文字】.d-flex {display: inline-block !important;}【调节文章标签到文章下】.Label, .label {line-height: 12px !important;}【文章标签背景颜色框缩小一点】.LabelTime {display: inline-block !important;}【调节文章标签到手机显示不全或者不显示后面的日期】</style>",
```


##添加友情链接##，添加代码到config.json
[参考地址](https://blog.meekdai.com/post/%E3%80%90Gmeek-jin-jie-%E3%80%91-you-shang-jiao-yuan-an-niu-pei-zhi.html#%E7%AB%99%E5%86%85%E9%93%BE%E6%8E%A5)
```
"singlePage":["link"],
```
上面菜单找到`Issues`点开——新建一个文章`New issue`在靠近右边屏幕，添加标签必须为`link`，然后发布保存，再去全局生成.



##Gmeek在GITHUB全局生成##，修改或者添加页面都需要做一次，发表文章除外，不过发生错误的时候也可以去全局生成试试.
在顶部菜单找到：`Actions`点开——左边的菜单找到【手机需要横屏或者也是在Actions页面找到`All workflows`下拉才能看到】`build Gmeek`点开——右边找到`Run workflow`点开下拉找到`Run workflow`点击，然后继续在Actions页面刷新等待查看处理好了没.



##Gmeek修改文章##
上面菜单占到`Issues`点开，找到要修改的文章标题点开，文章顶部有3个...点开找到`Edit`附近还有一个笔🖊一样的图标点开就可以修改文章了，修改完成后，文章底部有 Cancel 和 Save 的文字分别为 取消 和 保存.


##修改文件##，比如经常修改`config.json` 点开文件后找到文件上方的一个笔🖊型图标点开文字是： `Edit this file`修改完成了，在文件顶部找到 `GmeekCommit changes...`点开再找到`GmeekCommit changes`点击一次，修改Code里面的文件要去全部生成一次才会生效的.


##Gmeek安装##
【仅需一个Github账号，让文字在互联网中永生 超轻量级个人博客框架Gmeek-哔哩哔哩】 [https://b23.tv/LI3hM7E](https://b23.tv/LI3hM7E)

`Gmeek-html<iframe src="//player.bilibili.com/video/BV1GM4m1m7ZD?buvid=XUD3794D5CDC03ABC34466C3CAD7DF6E83071&from_spmid=main.my-history.0.0&is_story_h5=false&mid=gjLnfsZ8h7NDanyvv1XEs38FTQ/SZMtL1rElX6M3iMo=&p=1&plat_id=116&share_from=ugc&share_medium=android&share_plat=android&share_session_id=d1c4d298-5de7-412b-9021-6062ed3b9cc9&share_source=COPY&share_tag=s_i&spmid=united.player-video-detail.0.0&timestamp=1770372133&unique_k=LI3hM7E&up_id=316183842" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" width="100%" height="460px"></iframe>`
