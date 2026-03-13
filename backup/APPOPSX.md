[APPOPSX1.2.5](https://github.com/8enet/AppOpsX/releases)

[备用下载](https://apkfab.com/zh/appopsx/com.zzzmode.appopsx)

### Android 9 系统反馈优化成功方案

---

### 1. 关闭锁屏与解锁音效
该命令用于彻底消除按下电源键锁屏以及成功解锁进入桌面时的系统提示音。
```+bash
adb shell settings put system lockscreen_sounds_enabled 0
```

### 2. 关闭锁屏密码输入与指纹识别振动
该命令通过关闭系统级“触摸反馈”总开关，解决锁屏界面输入密码时的振动以及指纹识别成功后的反馈。
```+bash
adb shell settings put system haptic_feedback_enabled 0
```

### 3. AppOpsX 权限进阶管理（参考 Weich.ee 方案）
对于系统级更顽固的振动反馈，可通过 AppOpsX 进行底层拦截。

**启动步骤：**
1. 手机安装 AppOpsX 客户端。
2. 在 ADB 终端输入以下命令激活服务：
```+bash
adb shell sh /sdcard/Android/data/com.zzzmode.appopsx/opsx.sh
```

**权限操作：**
* **操作目标：** 在 AppOpsX 列表中找到“Android 系统” (Android System)。
* **拦截项目：** 找到“控制振动” (VIBRATE) 选项。
* **处理方式：** 将其设置为“关闭/拒绝”，可彻底压制系统底层的指纹等硬件反馈振动。

---

### 4. 充电动画组件说明（已知受限项）
针对 com.dw.launcher 桌面自带的充电特效组件，目前的测试结论如下：
* **目标组件：** com.dw.launcher.activity.ChargeEffectActivity
* **结论：** 该组件受系统固件底层保护，执行 pm disable 报错。建议通过物理固定磁吸头或在“互动屏保”设置中尝试关闭，避免由于磁吸不稳导致的频繁弹窗。
