// Gmeek全局底部插入扫码打开二维码 - 自动适配所有页面
document.addEventListener('DOMContentLoaded', function() {
  // 1. 动态创建扫码模块的HTML结构
  const qrcodeHtml = `
    <div class="gmeek-qrcode-footer" style="position:fixed;bottom:60px;right:2px;z-index:9999;cursor:pointer;">
      <a href="javascript:;" style="display:inline-block;text-align:center;text-decoration:none;color:#333;padding:0px 0px;border:1px solid #eee;border-radius:6px;background:#fff;box-shadow:0 2px 10px rgba(0,0,0,0.08);">
        『扫码打开』
        <span style="position:absolute;bottom:100%;right:0;margin-bottom:10px;padding:10px;background:#fff;border:1px solid #eee;border-radius:6px;box-shadow:0 2px 10px rgba(0,0,0,0.1);display:none;">
          <img src="" alt="本页二维码" style="width:160px;height:160px;border:0;">
          <br>
          <small style="font-size:12px;color:#666;line-height:1.5;">扫码打开本页面</small>
        </span>
      </a>
    </div>
  `;

  // 2. 将扫码模块插入页面底部（body最后）
  document.body.insertAdjacentHTML('beforeend', qrcodeHtml);

  // 3. 获取元素，动态生成二维码
  const qrcodeImg = document.querySelector('.gmeek-qrcode-footer img');
  const pageUrl = window.location.href; // 获取当前页面完整链接
  // 拼接QQ二维码接口，URL编码避免特殊字符报错
  qrcodeImg.src = `https://qun.qq.com/qrcode/index?data=${encodeURIComponent(pageUrl)}&size=160`;

  // 4. 鼠标悬浮显示/隐藏二维码（原生JS交互）
  const qrcodeBtn = document.querySelector('.gmeek-qrcode-footer a');
  const qrcodeBox = document.querySelector('.gmeek-qrcode-footer span');
  qrcodeBtn.onmouseenter = () => { qrcodeBox.style.display = 'block'; };
  qrcodeBtn.onmouseleave = () => { qrcodeBox.style.display = 'none'; };
  // 点击阻止默认跳转
  qrcodeBtn.onclick = (e) => { e.preventDefault(); };
});
