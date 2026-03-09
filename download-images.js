const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const dataDir = path.join(__dirname, 'src/assets/data');
const imgDir = path.join(__dirname, 'src/assets/img/rooms');

if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

const jsonFiles = [
  'home_goodprice.json',
  'home_highscore.json',
  'home_discount.json',
  'home_hotrecommenddest.json',
  'home_longfor.json',
  'home_plus.json',
  'entire_list.json'
];

let allImageUrls = new Map();

jsonFiles.forEach(file => {
  const filePath = path.join(dataDir, file);
  if (fs.existsSync(filePath)) {
    try {
      const buffer = fs.readFileSync(filePath);
      const content = buffer.toString('utf8');
      const data = JSON.parse(content);
      
      if (data.list) {
        data.list.forEach(item => {
          if (item.picture_url) {
            allImageUrls.set(item.picture_url, null);
          }
          if (item.picture_urls && Array.isArray(item.picture_urls)) {
            item.picture_urls.forEach(url => allImageUrls.set(url, null));
          }
        });
      }
    } catch (err) {
      console.log(`解析文件错误 ${file}:`, err.message);
    }
  }
});

console.log(`找到 ${allImageUrls.size} 张图片`);

function downloadImage(url, index) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    const fileName = `room_${index}.jpg`;
    const filePath = path.join(imgDir, fileName);

    const request = protocol.get(url, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(filePath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`[${index + 1}/${allImageUrls.size}] 下载完成: ${fileName}`);
          resolve({ url, fileName });
        });
        fileStream.on('error', (err) => {
          console.log(`[${index + 1}/${allImageUrls.size}] 文件写入错误: ${err.message}`);
          resolve(null);
        });
      } else {
        console.log(`[${index + 1}/${allImageUrls.size}] 下载失败: ${res.statusCode}`);
        resolve(null);
      }
    });

    request.on('error', (err) => {
      console.log(`[${index + 1}/${allImageUrls.size}] 下载错误: ${err.message}`);
      resolve(null);
    });

    request.setTimeout(10000, () => {
      request.destroy();
      console.log(`[${index + 1}/${allImageUrls.size}] 下载超时`);
      resolve(null);
    });
  });
}

async function downloadAllImages() {
  const urls = Array.from(allImageUrls.keys());
  console.log(`开始下载 ${urls.length} 张图片...`);
  
  let successCount = 0;
  for (let i = 0; i < urls.length; i++) {
    const result = await downloadImage(urls[i], i);
    if (result) {
      allImageUrls.set(result.url, result.fileName);
      successCount++;
    }
  }
  
  fs.writeFileSync(path.join(__dirname, 'image-mapping.json'), JSON.stringify(Object.fromEntries(allImageUrls), null, 2));
  console.log(`\n下载完成！成功: ${successCount}/${urls.length}`);
  console.log('图片映射已保存到 image-mapping.json');
}

downloadAllImages().catch(console.error);
