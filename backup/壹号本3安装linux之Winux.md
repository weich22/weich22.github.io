
 ### Ventoy启动盘制作
 u盘用Ventoy 刻录启动，把Winux的系统包放在 Ventoy 的文件夹内。

插到电脑USB上面。


### 启动到主板设置
手动点击进入，启动原来的win系统
1.点击键盘左下角的 开始菜单。
2.点击 电源按钮。
3.关键动作:先用左手按住键盘上的 Shift 键不要松开,同时右手用鼠标点击“重启”。
4. 等屏幕变蓝:屏幕变蓝并出现"请稍候”字样后,再松开Shift键。
5.在出现的蓝色菜单中,依次点击:
·疑难解答(Troubleshoot)
·高级选项 (Advanced options)
·UEFI 固件设置 (UEFl Firmware Settings)
·点击 重启。
就自动进去壹号本3的主板设置了，

### 从主板设置启动u盘Ventoy
进入 BIOS 后如何启动U盘?
壹号本3的 BIOS界面通常是横过来的(旋转90度),请歪头查看:
1.使用键盘方向键移动U Save & Exit(保存并退出)选项卡。
2.在下方你会看到一个Boot Override (启动覆盖)的列表。
3.在这里直接选择你的U盘名称(比如 Kingston, SanDisk等),按回车。
4.电脑就会立即从U盘启动,而不会修改你原本的硬盘启动顺序。
温馨提示:
如果你的U盘是为了重装系统,进入BIOS 后建议顺便把Fast Boot (快速启动)设置为 Disabled,这样以后开机时按Fn+F7或Fn+Del就会好按很多了!

从选择u盘启动 Ventoy 之后，按键盘L按键切换到中文语言，按键盘返回键回到主菜单选择刚刚你下载的系统启动进去以后会是英文的。


电脑右下角链接WiFi，

按下键盘 Ctrl+ Alt + T ，启动命令窗口。



### 中文化
因为你已经开启了持久化模式,我们直接用"暴力”一点的命令行方式把这些缺少的包补全:
1.联网并更新列表
首先,确保你的壹号本已经连上 WiFi。打开终端(Terminal),输入:

```
sudo apt update
```
2.一键安装缺失的中文组件
直接复制并运行下面这条命令,它会把图片里提示缺失的包一次性补齐:

```
sudo apt install -ylanguage-pack-zh-hanslanguage-pack-gnome-zh-hans fonts-wqy-zenheifonts-arphic-uming fcitx5fcitx5-chinese-addons
```

3.强制刷新区域设置
安装完后,执行以下命令让系统"承认”中文:


```
sudo locale-gen zh_CN.UTF-8
sudo update-locale LANG-zh_CN.UTF-8
```

然后按笔记本电脑电源按键，注销，再登陆就好了，登陆密码为空，但是必须把鼠标点到输入框内，再按回车键按键登陆。

中文语言弄好了，开始弄屏幕转向方向，如下图点进去找到有个屏幕方向图标随便选合适你的，我是选择倒数图标2：


### 更改屏幕方向
![找到设置图标](https://weich22.github.io/imagesw/02123207_com.meizu.media.gallery.webp)


![找到Disolay点进去设置](https://weich22.github.io/imagesw/02112231_com.meizu.media.gallery.webp)