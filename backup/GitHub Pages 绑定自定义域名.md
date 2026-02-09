### 域名CNAME解析
在你购买域名的地方（运营商），子域名或者主域名（你用哪个就解析那个）解析做CNAME记录到你原来的Github Pages域名（一般都是你github用户名加.github.io，比如：xxx.github.io，xxx是你的github用户，除非你之前申请的是后面有仓库名，是哪个就绑定那个）。

### 绑定域名
再到github page 仓库处进入设置 ”settings“的Pages输入你刚刚CNAME到Github Pages的域名绑定，点击Save保存，后面Remove是删除，绑定错了可以删除再次绑定，或者以后你的域名到期了换域名也是可以删除再次绑定的，删除后就可以用原来的Github Pages域名访问，原来的Github Pages域名也是一直还在的，只不过是等GITHUB自动帮你把原来的原来的Github Pages域名301到了你绑定的域名，待几分钟才可以勾选开启https。

### 勾选开启https
勾选后github默认帮你申请免费的3个月的https，到时候自动帮你续https。

[参考：域名 DNS 解析到自己的 Github Page 页面（github page 绑定自己的域名）](https://www.cnblogs.com/xieqk/p/Github-Page-DNS.html)