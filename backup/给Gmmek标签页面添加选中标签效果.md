```dos
document.addEventListener('DOMContentLoaded', function() {
  const tagButtons = document.querySelectorAll('button.Label');

  tagButtons.forEach(button => {
    button.addEventListener('click', function() {
      // 先恢复所有标签的 padding
      tagButtons.forEach(btn => {
        btn.style.padding = '4px';
      });
      // 再移除当前点击标签的 padding
      this.style.padding = '0';
    });
  });
});

```
包含f12控制台调试信息输出，因为我发现标签有空格的会没有效果，未到匹配的…
```dos
// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  console.log('脚本已加载');

  // 保存原始函数
  if (window.updateShowTag) {
    const originalUpdateShowTag = window.updateShowTag;

    // 重写函数
    window.updateShowTag = function(tag) {
      console.log('updateShowTag 被调用，参数：', tag);
      
      // 先执行原来的逻辑
      originalUpdateShowTag(tag);

      // 选择所有标签按钮
      const tagButtons = document.querySelectorAll('button.Label');
      console.log('找到的标签数量：', tagButtons.length);

      // 恢复所有标签的 padding
      tagButtons.forEach(btn => {
        btn.style.padding = '4px';
        console.log('恢复 padding: ', btn.textContent.trim());
      });

      // 找到当前点击的标签
      const activeTag = Array.from(tagButtons).find(btn => {
        const btnText = btn.textContent.trim().split(/\s+/)[0];
        return btnText === tag;
      });

      if (activeTag) {
        activeTag.style.padding = '0';
        console.log('设置 padding: 0 给：', activeTag.textContent.trim());
      } else {
        console.log('未找到匹配的标签：', tag);
      }
    }

    // 页面加载时，根据 URL hash 自动激活对应标签
    const currentHash = window.location.hash.substring(1);
    if (currentHash) {
      console.log('检测到 hash：', currentHash);
      window.updateShowTag(currentHash);
    }
  } else {
    console.error('未找到 updateShowTag 函数！');
  }
});

```