// Gmeek博客外部链接新窗口打开，自动适配Github Pages
document.addEventListener('DOMContentLoaded', function() {
  // 匹配Gmeek文章内容区所有链接，避免修改导航栏等非文章链接
  const linkElements = document.querySelectorAll('article a, .post-content a, .article-content a');
  if (linkElements.length === 0) return;

  linkElements.forEach(link => {
    // 过滤无效链接、本站链接、锚点、邮件链接
    const linkHref = link.getAttribute('href') || '';
    const isEffectiveLink = linkHref && !linkHref.startsWith('javascript:');
    const isExternalLink = isEffectiveLink 
                          && !linkHref.includes(window.location.hostname) 
                          && !linkHref.startsWith('#') 
                          && !linkHref.startsWith('mailto:') 
                          && !linkHref.startsWith('tel:');

    if (isExternalLink) {
      link.target = '_blank';
      // 安全属性必加，兼容所有浏览器
      link.rel = 'noopener noreferrer nofollow';
      // 可选：添加外部链接图标提示（鼠标悬浮/视觉区分，无需额外CSS）
      link.title = link.title ? `${link.title} (新窗口打开)` : '新窗口打开';
    }
  });
});
