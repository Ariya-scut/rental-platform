const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'src/assets/data');

const jsonFiles = [
  'home_goodprice.json',
  'home_highscore.json',
  'home_discount.json',
  'home_hotrecommenddest.json',
  'home_longfor.json',
  'home_plus.json',
  'entire_list.json'
];

function replaceImageUrlsInObject(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => replaceImageUrlsInObject(item));
  }

  const newObj = {};
  for (const key in obj) {
    if (key === 'picture_url' || key === 'picture_urls' || key === 'reviewer_image_url') {
      if (key === 'picture_urls' && Array.isArray(obj[key])) {
        newObj[key] = obj[key].map((url, index) => 
          url.includes('muscache') ? `https://picsum.photos/400/300?random=${Math.random()}` : url
        );
      } else if (typeof obj[key] === 'string' && obj[key].includes('muscache')) {
        newObj[key] = `https://picsum.photos/400/300?random=${Math.random()}`;
      } else {
        newObj[key] = obj[key];
      }
    } else {
      newObj[key] = replaceImageUrlsInObject(obj[key]);
    }
  }
  return newObj;
}

jsonFiles.forEach(file => {
  const filePath = path.join(dataDir, file);
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);
      
      const updatedData = replaceImageUrlsInObject(data);
      fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), 'utf8');
      
      console.log(`✓ 已更新: ${file}`);
    } catch (err) {
      console.log(`✗ 错误 ${file}:`, err.message);
    }
  }
});

console.log('\n所有图片 URL 已替换为占位图片服务！');
