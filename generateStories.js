const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname);
const templatePath = path.join(baseDir, 'story.html');
const storiesPath = path.join(baseDir, 'stories.json');
const outDir = path.join(baseDir, 'truyen');

if (!fs.existsSync(templatePath)) {
  console.error('Không tìm thấy template:', templatePath);
  process.exit(1);
}
if (!fs.existsSync(storiesPath)) {
  console.error('Không tìm thấy stories.json:', storiesPath);
  process.exit(1);
}
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

const template = fs.readFileSync(templatePath, 'utf8');

// --- an toàn khi đọc/parse stories.json ---
let raw = fs.readFileSync(storiesPath, 'utf8').trim();
if (!raw) {
  console.error('stories.json rỗng');
  process.exit(1);
}

let stories;
try {
  stories = JSON.parse(raw);
} catch (err) {
  console.error('Lỗi parse stories.json:', err.message);
  process.exit(1);
}

// Normalize sang mảng nếu cần
if (!Array.isArray(stories)) {
  if (stories && Array.isArray(stories.stories)) {
    stories = stories.stories;
  } else if (stories && Array.isArray(stories.data)) {
    stories = stories.data;
  } else if (stories && typeof stories === 'object') {
    stories = [stories];
  } else {
    console.error('stories.json phải là mảng hoặc object hợp lệ');
    process.exit(1);
  }
}
// --- end parse ---

// baseUrl để tạo og:url nếu stories.json không chứa url tuyệt đối
const baseUrl = 'https://otruyenhay.pages.dev/'; // chỉnh lại trước khi chạy
const baseCoverUrl = 'https://raw.githubusercontent.com/thenv4590/otruyenhay/main/images/covers/'; // chỉnh lại trước khi chạy

for (const s of stories) {
  const slug = s.file || (s.title || 'story').toLowerCase().replace(/\s+/g, '-');
  const filename = `${slug}.html`;
  const pageUrl = (baseUrl.replace(/\/$/, '') + '/truyen/' + filename);
  const cover = s.cover ? (String(s.cover).startsWith('http') ? s.cover : baseCoverUrl + s.cover) : (baseCoverUrl + 'default.jpg');

  const meta = [
    `<title>${escapeHtml(s.title || 'Ổ truyện hay')}</title>`,
    `<meta property="og:title" content="${escapeHtml(s.title || '')}">`,
    `<meta property="og:description" content="${escapeHtml(s.description || '')}">`,
    `<meta property="og:image" content="${escapeHtml(cover)}">`,
    `<meta property="og:url" content="${escapeHtml(pageUrl)}">`,
    `<meta property="og:type" content="article">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapeHtml(s.title || '')}">`,
    `<meta name="twitter:description" content="${escapeHtml(s.description || '')}">`,
    `<meta name="twitter:image" content="${escapeHtml(cover)}">`,
    `<meta name="story-title" content="${escapeHtml(s.title || '')}">`,
    `<meta name="story-desc" content="${escapeHtml(s.description || '')}">`,
    `<meta name="story-cover" content="${escapeHtml(cover)}">`
  ].join('\n  ');

  // chèn meta vào trước </head>, nếu không có </head> thì cố gắng chèn sau <head>, nếu không được thì đặt lên đầu
  let outHtml;
  if (/<\/head>/i.test(template)) {
    outHtml = template.replace(/<\/head>/i, meta + '\n</head>');
  } else if (/<head[^>]*>/i.test(template)) {
    outHtml = template.replace(/<head[^>]*>/i, match => match + '\n' + meta);
  } else {
    outHtml = meta + '\n' + template;
  }

  fs.writeFileSync(path.join(outDir, filename), outHtml, 'utf8');
  console.log('Tạo:', filename);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}