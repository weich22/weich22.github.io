/**
 * Gmeek博客框架外部链接处理器
 * 自动为Markdown生成的外部链接添加target="_blank"和rel="noopener"
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 定义需要处理的链接选择器
    const linkSelectors = [
        '.post-content a',      // 文章内容区域链接
        '.markdown-body a',     // Markdown渲染区域链接
        '.content a',           // 通用内容区域链接
        '.post-body a',         // 文章主体链接
        '.article-content a'    // 文章内容链接
    ];
    
    // 处理所有匹配的链接
    linkSelectors.forEach(selector => {
        const links = document.querySelectorAll(selector);
        links.forEach(processLink);
    });
    
    // 创建MutationObserver监听动态内容
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // 元素节点
                    // 处理新添加的链接节点
                    if (isLinkElement(node)) {
                        processLink(node);
                    }
                    // 处理新添加节点内的链接
                    const nestedLinks = node.querySelectorAll && node.querySelectorAll('a');
                    if (nestedLinks) {
                        nestedLinks.forEach(processLink);
                    }
                }
            });
        });
    });
    
    // 开始监听DOM变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});

/**
 * 检查元素是否为链接
 * @param {Element} element - 要检查的元素
 * @return {boolean} 是否为链接元素
 */
function isLinkElement(element) {
    return element.tagName === 'A' && element.href;
}

/**
 * 处理单个链接元素
 * @param {Element} link - 链接元素
 */
function processLink(link) {
    // 确保链接有href属性且为外部链接
    if (!link.href || link.hostname === window.location.hostname) {
        return;
    }
    
    // 检查是否已经处理过
    if (link.getAttribute('data-external-processed')) {
        return;
    }
    
    // 添加新窗口打开属性
    link.setAttribute('target', '_blank');
    
    // 添加安全属性
    if (!link.getAttribute('rel')) {
        link.setAttribute('rel', 'noopener');
    } else if (!link.getAttribute('rel').includes('noopener')) {
        link.setAttribute('rel', link.getAttribute('rel') + ' noopener');
    }
    
    // 标记已处理
    link.setAttribute('data-external-processed', 'true');
}

/**
 * 处理HTML字符串中的链接（用于动态内容处理）
 * @param {string} htmlContent - HTML内容字符串
 * @return {string} 处理后的HTML内容
 */
function processHtmlLinks(htmlContent) {
    // 创建临时DOM元素
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // 获取所有链接并处理
    const links = tempDiv.querySelectorAll('a');
    links.forEach(processLink);
    
    // 返回处理后的HTML
    return tempDiv.innerHTML;
}

// 导出函数供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        processLink,
        processHtmlLinks
    };
}
