// Gmeek 全局文章底部插入打赏按钮
document.addEventListener('DOMContentLoaded', function () {
  // 只在文章页插入（判断是否有文章容器）
  const article = document.querySelector('article') || document.querySelector('.post') || document.querySelector('.post-content');
  if (!article) return;

  const rewardHtml = `
<!--打赏开始-->
<div style="width:100%; font-size:16px; text-align:center; margin:30px 0 20px;">
  <button id="rewardButton" style="padding:8px 16px; cursor:pointer; border:none; border-radius:6px; background:#ff7676; color:#fff; font-size:16px;">
    <span>↓☞打赏☜↓</span>
  </button>
  <div id="QR" style="display:none; margin-top:16px;">
    <div style="display:inline-block; margin:0 10px;">
      <img src="/assets/img/wxzym.webp" alt="微信" style="width:160px; height:160px; object-fit:cover;"><br>↑微信↑
    </div>
    <div style="display:inline-block; margin:0 10px;">
      <img src="/assets/img/zfbskn.jpg" alt="支付宝" style="width:160px; height:160px; object-fit:cover;"><br>↑支付宝↑
    </div>
  </div>
</div>
<!--打赏结束-->
  `;

  // 插入到文章底部
  article.insertAdjacentHTML('beforeend', rewardHtml);

  // 点击显示/隐藏打赏码
  const btn = document.getElementById('rewardButton');
  const qr = document.getElementById('QR');
  btn.addEventListener('click', function () {
    qr.style.display = qr.style.display === 'none' ? 'block' : 'none';
  });
});
