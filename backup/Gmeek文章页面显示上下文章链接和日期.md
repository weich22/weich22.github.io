```js
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