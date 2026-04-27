### 详细问题说明


Gmeek前台文章全部不见了

可以到Github Pages里面的Code看下是不是没有了backup文件夹，里面有文章的md文件。

再次去docs/post里面看看是不是也没有生成的文章html或者直接post文件夹也没有？

然后去Github Pages里面的Issues是不是文章都还在？Actions里面全局生成也绿色打勾没有发生错误，然后编辑一个文章，提交文章之后就红色X报错。

我是上面的那种情况的


然后我去手动新建添加backup文件夹，backup/11.txt 加11.txt是避免Github Pages把backup文件夹当成文件了，然后我去Actions全局生成，再去前台查看文章回来了，但是缺少了旧文章id为11-1的，然后再去Actions全局生成，发现情况又和前面的一样，文章全部不见了，backup文件夹我不见了。

### 解决办法

修改Gmeek.yml,在运行 Python 前强制创建日录(最稳妥)

在 .github/workflows/Gmcek.yml中,找到 -name:Generate new html 这一节,在 cd /opt/Gmeek/之后、
python Gmeek.py 之前,增加一行 mkdir -p backup。修
改后如下:

```dos
- name: Generate new html
  run: |
    cp -r ./* /opt/Gmeek/
    cd /opt/Gmeek/
    mkdir -p backup          # 新增这一行
    python Gmeek.py ${{ secrets.GITHUB_TOKEN }} ${{ github.repos[0].owner }}/Gmeek
    cp -a /opt/Gmeek/docs ${{ github.workspace }}
    cp -a /opt/Gmeek/backup ${{ github.workspace }}
    cp /opt/Gmeek/blogBase.json ${{ github.workspace }}
```
记得提交修改，然后去Actions全局生成，我生成之后发现之前缺少的文章id为11-1的还是少了。


### 解决文章缺少

删除缓存文件,强制全量重建
删除 blogBase.json 和 postList.json(如果存在),让Gmeek 忘记历史记录,重新扫描所有 Issues.
删除: blogBase.json(在仓库根目录,通常是 main分支)
1.进入仓库首页,确保当前分支是 main(或master)。
2.在文件列表中找到blogBase.json,点击它。3.点击右上角的垃圾桶图标(或..→Deletefile)。
4.输入提交信息,例如 Delete blogBase.json,点击Commit changes.
删除 postL ist.json(可能在根目录和/或 docs/文件夹下)

再次去Actions全局生成，然后去检查一下是不是全部文章回来了。

### 重新触发全局生成
1.进入仓库 Actions 页面。
2.点击左侧 build Gmeek 工作流。
3.点击右侧 Run workflow→确认分支为 main→绿色按钮运行。
4.等待约 30-60 秒,状态变为绿色打勾。

