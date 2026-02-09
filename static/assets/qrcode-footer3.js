document.addEventListener('DOMContentLoaded', function() {
  var pageUrl = window.location.href;
  var pageQr = "https://qun.qq.com/qrcode/index?data=" + encodeURIComponent(pageUrl) + "&size=160";

  var html = `
<div class="qrcode-root" style="position:fixed; bottom:20px; right:20px; z-index:9999;">
  <div class="qrcode-btn" style="background:#fff; border:1px solid #eee; border-radius:8px; padding:10px 14px; box-shadow:0 2px 10px rgba(0,0,0,0.1);cursor:pointer;">
    扫码 / 打赏
  </div>

  <div class="qrcode-popup" style="display:none; position:absolute; bottom:60px; right:0; background:#fff; border:1px solid #eee; border-radius:8px; padding:15px; width:180px; text-align:center; box-shadow:0 2px 15px rgba(0,0,0,0.1);">
    
    <div style="margin-bottom:12px;">
      <img src="${pageQr}" style="width:160px; height:160px; object-fit:cover;">
      <div style="font-size:14px; margin-top:6px;">扫码打开本页面</div>
    </div>
    
    <div style="margin-bottom:12px;">
      <img src="https://weich22.github.io/img/wxzym.webp" style="width:160px; height:160px; object-fit:cover;">
      <div style="font-size:14px; margin-top:6px;">微信收款码</div>
    </div>
    
    <div>
      <img src="https://weich22.github.io/img/zfbskn.jpg" style="width:160px; height:160px; object-fit:cover;">
      <div style="font-size:14px; margin-top:6px;">支付宝收款码</div>
    </div>
    
  </div>
</div>
`;

  document.body.insertAdjacentHTML('beforeend', html);

  const root = document.querySelector('.qrcode-root');
  const btn = document.querySelector('.qrcode-btn');
  const popup = document.querySelector('.qrcode-popup');

  // 鼠标悬浮显示
  root.onmouseenter = () => { popup.style.display = 'block'; };
  root.onmouseleave = () => { popup.style.display = 'none'; };

  // 点击空白处关闭（电脑+手机通用）
  document.addEventListener('click', (e) => {
    if (!root.contains(e.target)) {
      popup.style.display = 'none';
    }
  });
});
