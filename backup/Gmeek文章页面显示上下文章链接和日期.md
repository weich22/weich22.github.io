### 1.代码的核心作用
这段代码的主要任务是为你的每一篇文章自动生成"页脚组件”,包含两个功能:
·发布日期:从系统数据中提取精准的发布时间。
·智能翻页:自动计算"上一篇"和"下一篇”的链接,方便你在手表上连续阅读,不用跳回首页。

### 2.数据是从哪里拿的?
代码并不是凭空产生数据的,它像一个"小爬虫”,在后台做了一次极速访问:
·目标文件:它会读取你博客根目录下的 /rss.xml文件。
rss.xml是Gmeek 必生成的标准文件。它里面按时间顺序排列了你所有的文章标题、链接和日期。
·匹配逻辑:代码获取 RSS 列表后,会将当前页面的网址(URL)与列表里的链接逐一比对。一旦对上了,它就知道"我是谁”,同时也知道了排在我前面和后面的是哪两篇文章。



### 3.性能表现:
我设计了*“哨兵机制"**:
·轮询监听:由于 Gmeek 的内容 (postBody) 是动态渲染的,代码设置了一个300ms 的“哨兵”。它每隔0.3秒看一眼页面:“文章加载完了吗?”
·即刻下班:一旦哨兵发现文章内容出现了,它会立即执行clearInterval。这就像哨兵接到了人就立刻撤岗,后续不再消耗任何CPU资源。

### 4.它是如何插入到页面的?
代码采用了**”智能定位插入”**:
·它首先寻找文章的主体区域 postBodyo
·特殊处理:如果你在文章末尾加了“转载请注明出处"之类的提示,代码会智能识别这些文字,并把日期和翻页放在这些提示的下面,确保排版符合直觉。


### 注意事项：

### 代码内部的路径修改
在 js 中,有一行代码是核心数据来源:
`xhr.open('GET','/rss.xml',true);`
·注意事项:开头的/代表网站的根目录。
·如何修改:如果你的博客就在二级域名的根目录下(例如访问 `g.weich.ee` 直接就是首页),那么这行代码不需要动,它会自动去 `g.weich.ee/rss.xml` 拿数据。
·特殊情况:如果你是放在二级域名的子目录下(如 
 `g.weich.ee/blog/` ),你必须把路径改成 `xhr.open('GET', '/blog/rss.xml', true);` 。


```+js
(function() {
    if (window.GmeekFooterDone) return;

    function initGmeekPlugins() {
        var postBody = document.getElementById('postBody');
        if (!postBody) return;

        clearInterval(footerInterval);
        window.GmeekFooterDone = true;

        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/rss.xml', true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    var xml = xhr.responseXML || new DOMParser().parseFromString(xhr.responseText, "text/xml");
                    var items = xml.getElementsByTagName("item");
                    var posts = [];
                    var curPath = window.location.pathname;
                    var currentIndex = -1;

                    // 1. 快速提取并定位当前文章
                    for (var i = 0; i < items.length; i++) {
                        var link = items[i].getElementsByTagName("link")[0].textContent;
                        var title = items[i].getElementsByTagName("title")[0].textContent;
                        var date = items[i].getElementsByTagName("pubDate")[0].textContent;
                        posts.push({title: title, link: link, date: date});
                        
                        if (currentIndex === -1 && (link.indexOf(curPath) !== -1 || curPath.indexOf(link) !== -1)) {
                            currentIndex = i;
                        }
                    }

                    if (currentIndex === -1) return;

                    // 2. 格式化日期
                    var d = new Date(posts[currentIndex].date);
                    var dateStr = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
                    
                    // 3. 构建极简 UI
                    var footerDiv = document.createElement('div');
                    footerDiv.style.cssText = "margin-top:30px; padding-top:20px; border-top:1px solid var(--color-border-default); clear:both; font-size:14px;";

                    var html = '<div style="color:var(--color-fg-muted); margin-bottom:15px;">📅 发布日期：' + dateStr + '</div>';
                    html += '<div style="display:flex; flex-direction:column; gap:10px;">';
                    
                    if (currentIndex > 0) {
                        html += '<a href="' + posts[currentIndex - 1].link + '" style="color:var(--color-accent-fg); text-decoration:none;">← 下一篇：' + posts[currentIndex - 1].title + '</a>';
                    }
                    if (currentIndex < posts.length - 1) {
                        html += '<a href="' + posts[currentIndex + 1].link + '" style="color:var(--color-accent-fg); text-decoration:none;">→ 上一篇：' + posts[currentIndex + 1].title + '</a>';
                    }
                    
                    html += '</div>';
                    footerDiv.innerHTML = html;

                    // 4. 精准插入位置
                    var target = postBody.nextElementSibling;
                    if (target && target.innerText && target.innerText.indexOf('转载') !== -1) {
                        target.parentNode.insertBefore(footerDiv, target.nextSibling);
                    } else {
                        postBody.parentNode.insertBefore(footerDiv, postBody.nextSibling);
                    }

                } catch (e) { console.error("Footer Mini Error:", e); }
            }
        };
        xhr.send();
    }

    var footerInterval = setInterval(initGmeekPlugins, 300);
})();

```



#### 更新细节版本

这个修改的核心逻辑是将原本包裹在 <a>标签内的"-下一篇"和"←上一篇"文本提取出来,放在 <span>标签中,这样它们就不会被视为链接的一部分,且不会有点击效果。

修改说明:
1.结构拆解:原代码中←上一篇:是放在 <a>标签里的。现在我为每一行加了一个<div>包裹,并将→下一篇:放在了 <span>标签内。
2.视觉统一:给 <span>加了
color:var(--color-fg-muted);,使其颜色与发布日期的灰色保持一致,这样只有文章标题是蓝色的链接色,整体更清爽。
3.独立性:现在鼠标悬停在”下一篇”上时不会出现下划线,也不会触发链接,只有点击标题才会跳转。

本次变动:
1.文字与链接解耦:←上一篇:和→下一篇:现在包裹在 <span>中,不会变色,也不会响应点击。2. 顺序对调:
·currentIndex -1(数组中靠前的,即最新的)现在对应ー上一篇。
·currentIndex +1(数组中靠后的,即旧的)现在对应一下一篇。
这样就符合“新文章在旧文章上方”的逻辑顺序了。


这个问题以前我在用 Typecho程序 的时候跟别人争议过，就差点没干起来了，我现在才想起来所以更新一下变动，我的想法是第二种就是现在这种更新之后的方式。


```+js
(function() {
    if (window.GmeekFooterDone) return;

    function initGmeekPlugins() {
        var postBody = document.getElementById('postBody');
        if (!postBody) return;

        clearInterval(footerInterval);
        window.GmeekFooterDone = true;

        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/rss.xml', true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    var xml = xhr.responseXML || new DOMParser().parseFromString(xhr.responseText, "text/xml");
                    var items = xml.getElementsByTagName("item");
                    var posts = [];
                    var curPath = window.location.pathname;
                    var currentIndex = -1;

                    for (var i = 0; i < items.length; i++) {
                        var link = items[i].getElementsByTagName("link")[0].textContent;
                        var title = items[i].getElementsByTagName("title")[0].textContent;
                        var date = items[i].getElementsByTagName("pubDate")[0].textContent;
                        posts.push({title: title, link: link, date: date});
                        
                        if (currentIndex === -1 && (link.indexOf(curPath) !== -1 || curPath.indexOf(link) !== -1)) {
                            currentIndex = i;
                        }
                    }

                    if (currentIndex === -1) return;

                    var d = new Date(posts[currentIndex].date);
                    var dateStr = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
                    
                    var footerDiv = document.createElement('div');
                    footerDiv.style.cssText = "margin-top:30px; padding-top:20px; border-top:1px solid var(--color-border-default); clear:both; font-size:14px;";

                    var html = '<div style="color:var(--color-fg-muted); margin-bottom:15px;">📅 发布日期：' + dateStr + '</div>';
                    html += '<div style="display:flex; flex-direction:column; gap:10px;">';
                    
                    // 索引较小 (currentIndex - 1) 的是更新的文章，即“上一篇”
                    if (currentIndex > 0) {
                        html += '<div><span style="color:var(--color-fg-muted);">← 上一篇：</span><a href="' + posts[currentIndex - 1].link + '" style="color:var(--color-accent-fg); text-decoration:none;">' + posts[currentIndex - 1].title + '</a></div>';
                    }
                    // 索引较大 (currentIndex + 1) 的是更旧的文章，即“下一篇”
                    if (currentIndex < posts.length - 1) {
                        html += '<div><span style="color:var(--color-fg-muted);">→ 下一篇：</span><a href="' + posts[currentIndex + 1].link + '" style="color:var(--color-accent-fg); text-decoration:none;">' + posts[currentIndex + 1].title + '</a></div>';
                    }
                    
                    html += '</div>';
                    footerDiv.innerHTML = html;

                    var target = postBody.nextElementSibling;
                    if (target && target.innerText && target.innerText.indexOf('转载') !== -1) {
                        target.parentNode.insertBefore(footerDiv, target.nextSibling);
                    } else {
                        postBody.parentNode.insertBefore(footerDiv, postBody.nextSibling);
                    }

                } catch (e) { console.error("Footer Mini Error:", e); }
            }
        };
        xhr.send();
    }

    var footerInterval = setInterval(initGmeekPlugins, 300);
})();

```

### 结论:

建议全局引用(放在 config.json 的 healer 中，不是直接把代码放进去config.json，也可以通过外部js文件然后在 healer 引用的意思)虽然这段代码的最终效果只在文章页面显示,但将其作为全局引用是目前最稳妥、也是 Gmeek 框架默认推荐的做法。原因如下:
代码已经自带”智能识别"功能
在代码的开头,有一行关键的逻辑判断，这个不用另外加进去，上面已经有了:


```+js
var postBody = document.getElementById('postBody');
if (!postBody) return;

```

·它的作用:当你在首页、标签页(tag.html)或关于页时,脚本虽然会加载,但它发现页面上没有 postBody(正文容器),就会立即停止运行(return)。
·性能影响:这种判断在毫秒级就能完成,对非文章页面的性能消耗微乎其微。



### 更新加在文章内显示标签


是直接替换原来的全部代码。

```dos
(function() {
    let checkCount = 0;
    const run = () => {
        const c = document.getElementById('cmButton');
        // 等待评论按钮出现，最多尝试 10 秒
        if (!c) {
            if (checkCount++ < 20) setTimeout(run, 500); 
            return;
        }
        if (document.getElementById('customLabels')) return;

        const p = window.location.pathname;
        const u = window.location.href;

        // 1. 抓取 RSS：日期与上下篇
        fetch("/rss.xml").then(r => r.text()).then(x => {
            const d = new DOMParser().parseFromString(x, "text/xml");
            const items = Array.from(d.querySelectorAll("item"));
            let idx = -1;

            // 采用最稳的双向匹配逻辑
            for (let i = 0; i < items.length; i++) {
                const link = items[i].querySelector("link").textContent;
                if (link.indexOf(p) !== -1 || p.indexOf(link) !== -1 || link === u) {
                    idx = i;
                    break;
                }
            }

            if (idx === -1) return;

            const pub = new Date(items[idx].querySelector("pubDate").textContent);
            const dt = pub.getFullYear() + '-' + (pub.getMonth() + 1) + '-' + pub.getDate();

            const box = document.createElement('div');
            // 设置整体容器样式
            box.style.cssText = "margin-top:30px;padding-top:20px;border-top:1px solid var(--color-border-default);clear:both;font-size:14px;";
            
            let h = '<div style="color:var(--color-fg-muted);margin-bottom:15px;">📅 发布日期：' + dt + '</div><div style="display:flex;flex-direction:column;gap:10px;">';
            
            // 索引越小越新，索引越大越旧
            if (idx > 0) {
                h += '<div><span style="color:var(--color-fg-muted);">← 上一篇：</span><a href="' + items[idx - 1].querySelector("link").textContent + '" style="color:var(--color-accent-fg);text-decoration:none;">' + items[idx - 1].querySelector("title").textContent + '</a></div>';
            }
            if (idx < items.length - 1) {
                h += '<div><span style="color:var(--color-fg-muted);">→ 下一篇：</span><a href="' + items[idx + 1].querySelector("link").textContent + '" style="color:var(--color-accent-fg);text-decoration:none;">' + items[idx + 1].querySelector("title").textContent + '</a></div>';
            }
            h += '</div>';
            box.innerHTML = h;
            c.before(box);

            // 2. 抓取标签：使用严格后缀匹配，修正个位数 ID 错误
            const s = (url) => {
                fetch(url).then(r => r.text()).then(ht => {
                    const doc = new DOMParser().parseFromString(ht, "text/html");
                    const pathName = p.split('/').pop();
                    
                    // 核心修复：使用 [href$='/3.html'] 这种结尾匹配，防止误抓 33.html
                    const exactSelector = "a[href$='/" + pathName + "']";
                    const postEntry = doc.querySelector(exactSelector);
                    const container = postEntry ? postEntry.closest('.SideNav-item') : null;
                    
                    if (container) {
                        const b = document.createElement('div');
                        b.id = "customLabels";
                        // 修正：增加 margin-top: 15px 让标签和上面的链接分开
                        b.style.cssText = "margin-top:15px;margin-bottom:15px;display:flex;flex-wrap:wrap;gap:8px;";
                        
                        container.querySelectorAll("span[class*='Label']").forEach(l => {
                            const t = l.innerText.trim();
                            if (t && !/^\d{4}/.test(t)) {
                                const a = document.createElement('a');
                                a.href = "/tag.html#" + t;
                                a.innerText = t;
                                
                                // 克隆样式获取颜色
                                const temp = document.body.appendChild(l.cloneNode(true));
                                temp.style.display = "none";
                                const bg = window.getComputedStyle(temp).backgroundColor;
                                document.body.removeChild(temp);
                                
                                a.style.cssText = "background-color:" + bg + ";color:#fff;padding:2px 10px;border-radius:20px;font-size:12px;text-decoration:none;display:inline-block;";
                                b.appendChild(a);
                            }
                        });
                        if (b.children.length > 0) c.before(b);
                    } else {
                        // 没找到就翻下一页
                        const n = doc.querySelector('.pagination a:last-child, a[rel="next"]');
                        if (n && n.getAttribute('href') && n.getAttribute('href') !== url) s(n.getAttribute('href'));
                    }
                });
            };
            s("/index.html");
        });
    };
    run();
})();

```
### 说明和注意事项



🛠️ 技术实现原理
​1. 数据从哪来？
​日期与上下篇：从 /rss.xml 获取。RSS 是 Gmeek 自动生成的，里面包含了所有文章的标题、链接和发布日期。
​彩色标签：从 /index.html（或翻页后的首页）获取。脚本会模拟访问首页，找到对应的文章条目，并克隆其标签样式。
​2. 是如何做的？
​异步抓取 (Fetch)：脚本在后台悄悄访问 RSS 和首页，不会刷新页面或影响用户阅读。
​严格后缀匹配：使用 a[href$='/ID.html']。$ 符号代表“以...结尾”，确保 100% 匹配到正确的文章 ID。
​隐身样式提取：将首页标签克隆到内存中，用 getComputedStyle 偷取它的背景色，然后再应用到文章页的标签上。
​⚠️ 后期维护注意事项（防坑指南）
​文件名规范：
​尽量不要修改 Gmeek 默认的 post/ID.html 命名规则。如果你手动改了文件名，脚本可能需要根据新的路径规则调整匹配逻辑。
​首页标签显示数量：
​脚本是去首页“找”标签。如果你在 Gmeek 设置里让首页完全不显示标签，那么文章页也就抓不到颜色了。
​性能开销：
​无需担心。目前的脚本带有 checkCount < 20 的自毁机制。如果在 10 秒内没找到位置，它会自动停止运行，不会持续消耗设备的 CPU 或电池。
​间距调整：
​如果以后觉得标签和上面的链接还是太近或太远，搜索代码中的 margin-top:15px;。调大数字（如 25px）间距就会变大。

如果发现某些新标签颜色没变怎么办？
​修改点：在自适应字体脚本中，找到 const l = '...' 这一行，在后面添加该标签的 CSS 类名（用逗号隔开）。