```dos
(function(){
    // 获取 Gmeek 原生的三个核心区块
    const h = document.querySelector("#header"),
          c = document.querySelector("#content") || document.querySelector(".main"),
          f = document.querySelector("#footer");
    
    // 如果头部和主体都存在，则进行结构重排
    if(h && c){
        // 将头部移到主体上方
        c.parentNode.insertBefore(h, c);
        // 如果有页脚，将其紧贴在主体下方
        if(f) c.parentNode.insertBefore(f, c.nextSibling);
    }
    console.log("Gmeek-SimWindow-Deployed");
})();

```
```dos
/* 颜色变量定义 */
:root {--bg-main: #f0f2f5; --win-bg: #ffffff; --win-border: #999; --header-bg: #dee1e6; --text-p: #333;}
[data-color-mode='dark'] {--bg-main: #0d1117; --win-bg: #161b22; --win-border: #444; --header-bg: #30363d; --text-p: #adbac7;}

/* 整体背景拉伸 */
html, body, #main, .Gmeek-mainindex {background: var(--bg-main)!important; margin:0!important; height:auto!important; min-height:100vh!important;}

/* 模拟窗口头部：磁贴感 */
#header {display:flex!important; align-items:center!important; width:95%!important; max-width:900px!important; height:44px!important; margin:45px auto 0 auto!important; background:var(--header-bg)!important; border:1px solid var(--win-border)!important; border-radius:8px 8px 0 0!important; padding:0 15px!important; box-sizing:border-box!important; position:relative!important; z-index:1001!important}

/* 核心：拉伸白色主体填满屏幕 */
#content, .main, .list-content {display:block!important; width:95%!important; max-width:900px!important; margin:0 auto!important; background:var(--win-bg)!important; border-left:1px solid var(--win-border)!important; border-right:1px solid var(--win-border)!important; padding:20px!important; position:relative!important; z-index:1000!important; min-height:calc(100vh - 200px)!important; height:auto!important;}

/* 底部收口 */
#footer {display:block!important; width:95%!important; max-width:900px!important; margin:0 auto 60px auto!important; background:var(--win-bg)!important; border:1px solid var(--win-border)!important; border-top:none!important; border-radius:0 0 8px 8px!important; padding:20px!important; box-sizing:border-box!important; z-index:1000!important}

/* 原生组件微调：头像凸出与标题加粗 */
.SideNav {display:block!important; background:transparent!important; border:none!important; min-width:auto!important;}
.avatar {width:46px!important; height:46px!important; margin-right:12px!important; margin-top:-20px!important; border:2px solid var(--win-border)!important; background:var(--win-bg)!important; border-radius:8px!important; z-index:1002!important; box-shadow:0 4px 8px rgba(0,0,0,0.2)!important}
.blogTitle {display:inline-block!important; font-size:16px!important; color:var(--text-p)!important; margin-top:10px!important; font-weight:bold!important}
.subTitle, .SideNav-icon, .title-right .btn-octicon:first-child {display:none!important}

```