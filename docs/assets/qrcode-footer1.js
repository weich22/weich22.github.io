document.addEventListener('DOMContentLoaded', function() {
  // 生成当前页面二维码
  const pageUrl = window.location.href;
  const pageQr = `https://qun.qq.com/qrcode/index?data=${encodeURIComponent(pageUrl)}&size=160`;

  const qrcodeHtml = `
<div style="position:fixed; bottom:20px; right:20px; z-index:9999;">
  <div style="background:#fff; border:1px solid #eee; border-radius:8px; padding:10px 14px; box-shadow:0 2px 10px rgba(0,0,0,0.1); cursor:pointer;"
       onclick="toggleQrcode()">
    扫码 / 打赏
  </div>

  <div id="qrcodeBox" style="display:none; position:absolute; bottom:60px; right:0; background:#fff; border:1px solid #eee; border-radius:8px; padding:15px; width:220px; text-align:center; box-shadow:0 2px 15px rgba(0,0,0,0.1);">
    <div style="display:flex; gap:8px; margin-bottom:12px;">
      <div onclick="showTab('page')" style="flex:1; padding:6px; background:#009688; color:#fff; border-radius:4px; cursor:pointer;">页面</div>
      <div onclick="showTab('wx')" style="flex:1; padding:6px; background:#07c160; color:#fff; border-radius:4px; cursor:pointer;">微信</div>
      <div onclick="showTab('zfb')" style="flex:1; padding:6px; background:#1677ff; color:#fff; border-radius:4px; cursor:pointer;">支付宝</div>
    </div>

    <div id="tab-page" style="display:block;">
      <img src="${pageQr}" style="width:160px; height:160px; object-fit:cover;">
      <div style="margin-top:6px; font-size:14px; color:#333;">扫码打开本页面</div>
    </div>

    <div id="tab-wx" style="display:none;">
      <img src="/assets/img/wx.png" style="width:160px; height:160px; object-fit:cover;">
      <div style="margin-top:6px; font-size:14px; color:#333;">微信收款码</div>
    </div>

    <div id="tab-zfb" style="display:none;">
      <img src="/assets/img/zfb.png" style="width:160px; height:160px; object-fit:cover;">
      <div style="margin-top:6px; font-size:14px; color:#333;">支付宝收款码</div>
    </div>
  </div>
</div>

<script>
function toggleQrcode(){
  const box=document.getElementById('qrcodeBox');
  box.style.display = box.style.display=='none'?'block':'none';
}
function showTab(type){
  document.getElementById('tab-page').style.display='none';
  document.getElementById('tab-wx').style.display='none';
  document.getElementById('tab-zfb').style.display='none';
  document.getElementById('tab-'+type).style.display='block';
}
</script>
  `;

  document.body.insertAdjacentHTML('beforeend', qrcodeHtml);
});
