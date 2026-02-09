/**
 * 在新窗口打开链接功能
 * 适用于GitHub Pages的Gmeek博客框架
 * 为所有外部链接添加target="_blank"属性
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有文章内容区域的链接
    const contentLinks = document.querySelectorAll('.post-content a, .markdown-body a, .content a');
    
    // 遍历所有链接
    contentLinks.forEach(function(link) {
        // 检查是否为外部链接（非本站链接）
        if (link.hostname !== window.location.hostname) {
            // 为外部链接添加target="_blank"属性
            link.setAttribute('target', '_blank');
            // 添加rel="noopener"以提高安全性
            link.setAttribute('rel', 'noopener');
        }
    });
    
    // 处理通过AJAX或动态加载的内容
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // 元素节点
                    // 检查新添加的节点本身是否为链接
                    if (node.tagName === 'A' && node.hostname !== window.location.hostname) {
                        node.setAttribute('target', '_blank');
                        node.setAttribute('rel', 'noopener');
                    }
                    // 检查新添加节点内的链接
                    const newLinks = node.querySelectorAll && node.querySelectorAll('a');
                    if (newLinks) {
                        newLinks.forEach(function(link) {
                            if (link.hostname !== window.location.hostname) {
                                link.setAttribute('target', '_blank');
                                link.setAttribute('rel', 'noopener');
                            }
                        });
                    }
                }
            });
        });
    });
    
    // 监听整个文档的变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});

// 为兼容Gmeek框架，提供一个可直接调用的函数
function targetBlank(content) {
    // 创建临时DOM元素来处理HTML字符串
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    // 获取所有链接
    const links = tempDiv.querySelectorAll('a');
    
    // 为每个链接添加target="_blank"属性
    links.forEach(function(link) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener');
    });
    
    // 返回处理后的HTML
    return tempDiv.innerHTML;
}

// 导出函数以供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { targetBlank };
}
