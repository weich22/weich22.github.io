原因是Gmeek在Issues里面写文章底部有个可以上传图片的，直接上传的话，文章图片链接是github.com开头的，容易抽风。

我就想通过js给用户在浏览器打开后缓存图片，但是好像无效，因为图片链接好像是有失效性的一样，没法缓存还是什么的，给图片链接加版本号都没用，后来我就想到实在不行把文章图片上传到仓库里面去也可以，就是到时候写文章是麻烦了点，然后我就把仓库里面的图片引用
（`https://weich22.github.io/imagesw/np11.webp`）到文章里面去，但是浏览器前端又解析成一个代理的图片地址，牛掰哈，链接是以camo.githubbusercontent.com开头的，没办法了只能这样先试试一段时间看那个稳定了。

为了预防把一些不必要的图片给缓存了，我就在后面又加了可以排除链接有关键词的就不缓存。


```
// ======================================================
// github（Gmeek）图片缓存
// 作用：给 Issues （Gmeek）写文章在文章底部上传的图片自动加版本号，让浏览器永久缓存
// 排除规则：图片链接里包含以下关键词，就不处理、不缓存
// ======================================================
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    document.querySelectorAll('img[src*="github"],img[src*="https://camo"]').forEach(img => {
      // 排除链接包含这些关键词的图片：qr、qrcode、code、api（二维码、动态API图等）
      if (img.src.includes('11qr11') || 
          img.src.includes('qrcode') || 
          img.src.includes('11code11') || 
          img.src.includes('11api11')) {
        return;
      }

      const url = new URL(img.src);
      url.searchParams.set('v', '202602'); // 缓存版本号，修改这里即可刷新所有图片
      img.src = url.toString();
    });
  }, 500);
});
```

