import QRCode from 'qrcode';

export default async () => {
  const qrElement = document.createElement('div');
  qrElement.style.position = 'fixed';
  qrElement.style.bottom = '20px';
  qrElement.style.right = '400px';
  qrElement.style.width = '120px';
  qrElement.style.padding = '12px';
  qrElement.style.border = '1px solid #1366ec';
  qrElement.style.background = '#fff';

  const textElement = document.createElement('div');
  textElement.style.textAlign = 'center';
  textElement.innerText = '移动端扫码体验';
  textElement.style.marginBottom = '10px';
  textElement.style.lineHeight = '1';
  qrElement.appendChild(textElement);

  const imgElement = document.createElement('img');
  imgElement.style.width = '100%';
  imgElement.style.verticalAlign = 'bottom';

  qrElement.appendChild(imgElement);
  document.body.appendChild(qrElement);

  let url = location.href.split('?')[0];

  if (url) {
    // 替换 http 为 https
    url = url.replace('http://', 'https://');
    imgElement.src = await QRCode.toDataURL(url, {
      margin: 0,
      width: 240,
    });
  }
};
