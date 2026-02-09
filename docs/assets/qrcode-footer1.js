document.addEventListener('DOMContentLoaded', function() {
  // 当前页面链接二维码（自动生成）
  var pageUrl = window.location.href;
  var pageQr = "https://qun.qq.com/qrcode/index?data=" + encodeURIComponent(pageUrl) + "&size=160";

  var html = `
<div style="position:fixed; bottom:20px; right:20px; z-index:9999;">
  <div style="background:#fff; border:1px solid #eee; border-radius:8px; padding:10px 14px; box-shadow:0 2px 10px rgba(0,0,0,0.1);cursor:pointer;"
       onclick="var p=document.getElementById('qrcode-panel');p.style.display=p.style.display=='none'?'block':'none';">
    扫码 / 打赏
  </div>

  <div id="qrcode-panel" style="display:none; position:absolute; bottom:60px; right:0; background:#fff; border:1px solid #eee; border-radius:8px; padding:15px; width:180px; text-align:center; box-shadow:0 2px 15px rgba(0,0,0,0.1);">
    
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
});
