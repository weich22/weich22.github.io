### 标签带有空格无效

```+js
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
### 空格无效版带调试信息

包含f12控制台调试信息输出，因为我发现标签有空格的会没有效果，和上面的差不多，多了调试脚本，未到匹配的…

```+js
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

### 全部有效版本，空格也有效

这个版本所有页面监听点击事件，就是说你从别的页面点击过来也是有效果的，但是我感觉会不会浪费性能…

```+js
(function() {
  'use strict';

  setTimeout(function() {
    const tagButtons = document.querySelectorAll('button.Label');

    if (tagButtons.length === 0) return;

    tagButtons.forEach(button => {
      button.addEventListener('click', function() {
        tagButtons.forEach(btn => {
          btn.style.setProperty('padding', '4px', 'important');
        });
        this.style.setProperty('padding', '0', 'important');
      });
    });

    const currentHash = decodeURIComponent(window.location.hash.substring(1));
    if (currentHash) {
      const activeTag = Array.from(tagButtons).find(btn => 
        btn.textContent.trim().includes(currentHash.trim())
      );
      if (activeTag) {
        activeTag.style.setProperty('padding', '0', 'important');
      }
    }
  }, 1000);
})();

```



### 包含调试脚本的版本

```+js
// 调试版：带详细日志，用于定位问题
(function() {
  'use strict';

  // 延迟执行，确保 DOM 加载完成
  setTimeout(function() {
    console.log('=== 标签选中调试脚本开始 ===');

    // 1. 查找所有标签按钮
    const tagButtons = document.querySelectorAll('button.Label');
    console.log('找到的标签按钮数量:', tagButtons.length);

    if (tagButtons.length === 0) {
      console.error('未找到任何 button.Label 元素！');
      console.log('页面中所有 button 元素:', document.querySelectorAll('button'));
      return;
    }

    // 2. 为每个按钮绑定点击事件
    tagButtons.forEach((button, index) => {
      button.addEventListener('click', function() {
        console.log(`按钮 #${index} 被点击:`, this.textContent.trim());

        // 先恢复所有按钮的 padding
        tagButtons.forEach((btn, i) => {
          btn.style.setProperty('padding', '4px', 'important');
          console.log(`恢复按钮 #${i} 的 padding`);
        });

        // 再移除当前按钮的 padding
        this.style.setProperty('padding', '0', 'important');
        console.log(`移除按钮 #${index} 的 padding`);
      });
    });

    // 3. 页面加载时，根据 URL hash 自动激活对应标签
    const currentHash = decodeURIComponent(window.location.hash.substring(1));
    console.log('当前 URL hash:', currentHash);

    if (currentHash) {
      const activeTag = Array.from(tagButtons).find((btn, i) => {
        const btnText = btn.textContent.trim();
        const match = btnText.includes(currentHash.trim());
        console.log(`匹配按钮 #${i}: "${btnText}" 包含 "${currentHash}"?`, match);
        return match;
      });

      if (activeTag) {
        activeTag.style.setProperty('padding', '0', 'important');
        console.log('自动激活标签:', activeTag.textContent.trim());
      } else {
        console.warn('未找到与 hash 匹配的标签');
      }
    }

    console.log('=== 标签选中调试脚本加载完成 ===');
  }, 1000); // 延迟1秒，确保所有DOM都加载好
})();

```

### 最终版本仅tag.html页面

```+js
(function() {
  'use strict';

  if (!window.location.pathname.includes('tag.html')) {
    return;
  }

  function handleTagClick(event) {
    const button = event.target.closest('button.Label');
    if (!button) return;

    document.querySelectorAll('button.Label').forEach(btn => {
      btn.style.setProperty('padding', '4px', 'important');
    });

    button.style.setProperty('padding', '0', 'important');
  }

  const tagContainer = document.getElementById('taglabel');
  if (tagContainer) {
    tagContainer.addEventListener('click', handleTagClick);
  }

  function activateTagByHash() {
    const currentHash = decodeURIComponent(window.location.hash.substring(1));
    if (currentHash) {
      document.querySelectorAll('button.Label').forEach(btn => {
        btn.style.setProperty('padding', '4px', 'important');
      });
      const activeTag = Array.from(document.querySelectorAll('button.Label')).find(btn => 
        btn.textContent.trim().includes(currentHash.trim())
      );
      if (activeTag) {
        activeTag.style.setProperty('padding', '0', 'important');
      }
    }
  }

  setTimeout(activateTagByHash, 1000);
  window.addEventListener('hashchange', activateTagByHash);
})();

```
1.新增 activateTagByHash 函数:专门负责根据当前 URL hash 找到并激活对应标签。
2.监听 hashchange 事件:每次URL 中的hash 发生变化(比如点击标签、前进后退),都会自动调用
activateTagByHash,确保选中状态始终同步。
3.刷新后自动激活:页面刷新
时,setTimeout 会延迟执行一次,保证DOM 加载完成后再根据 hash激活标签。
这样,无论是刷新页面、点击标签,还是使用浏览器的前进后退按钮,选中状态都会一直保持正确,不会再出现失效的情况。


我比较懒，也不像加太多东西，所以效果就是点击那个标签就直接去它的css样式（padding:4px），这样一来背景直接缩小，效果还是蛮明显能区分的…