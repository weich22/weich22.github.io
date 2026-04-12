### 问题说明
昨晚去网吧通宵打游戏了，然后回来用电脑一通操作用adb禁用了很多应用，然后看到有个（人脸解锁）我也禁用了，脑子抽在想，这个手表又没有直接的人脸解锁，我要他干嘛？干就完了，然后重启显示第一屏（以前有3屏来算这是2屏），再显示开机动画，再到锁屏界面就是无法解锁输入密码，也进不去桌面，然后闪屏几次就再重启就会进下面的图片的rec，这个rec可选的只有两个（Try again，重试）和（Factory data reset，恢复出厂），我是拍照手机识屏的可能有的字母会错，我又不想恢复出厂…

![s100用adb禁用应用无法进入桌面重启或者开机之后到rec](https://weich22.github.io/imagesw/S6041210252881commeizumediaallery.webp)


### 解决办法
就是按电源按键确认点击重试，重启到第二屏动画吧，电脑会叮咚响一下，就输入如下adb命令,验证一下你的adb，可不可以用，不输入也可以，直接下一步，我建议还是要试一下…

```dos
adb version
```
如果显示的是一段数字后面另外显示device，恭喜你不用恢复出厂设置，其实还有别的办法，但是这种手表和正常手机按键不一样，我不知道按哪一个…


### 查看已禁用列表
过一下会再次自己重启到图片中的rec模式，
就输入下面的代码查看已经禁用的列表
```dos
adb shell pm list packages -d
```

比如我的输出禁用列表如下

```dos
package:com.divoiot.breathe
package:com.dw.launcher
package:com.watch.iotfriend.bind
package:com.watch.iotfriend.make
package:com.dw.music
package:com.dw.sleep
package:com.tmoon.divo.app_market_app
package:com.divoiot.ble
package:com.divoiot.sport
package:com.watch.iotchat
package:com.divoiot.sedentary
package:com.sprd.powersavemodelauncher
package:com.juphoon.cloud.vchat
package:com.dw.wifip2p
package:com.divo.clear
package:com.dwiot.dwstep
package:com.dw.iotcode
package:com.android.settings
package:com.dw.school
package:com.dw.family.contact
package:com.timuen.divo.weardialmarket
```
然后你可以想一下有怀疑禁用之后导致不开机的，单独恢复它就可以了，我比较懒，想直接全部恢复之后手表好了能开机进桌面了再次去禁用就好了，最后我发现应该是禁用（人脸解锁）导致的。


### 解除所有禁用应用

也是等它重启之后到图片中的rec，重试之后重启了，先把adb命令复制进去，手表到第二屏动画界面，听到电脑响了就按回车执行。
```dos
adb shell pm list packages -d | ForEach-Object { adb shell pm enable ($_ -replace 'package:','') }
```

上面命令很简单就先输出所有已经禁用的应用列表，再启动就好了，列表排除字段（package:），就是告诉系统说，前面那些不是应用的包名…

### 准备adb操作过程
1.将adb.exe 复制到C:\Windows文件夹。
2.在任意文件夹中,按住Shift键并右键单击空白处,选择“在此处打开命令窗口（需要管理权限）”。
3.在打开的CMD中直接输入adb 命令即可使用。