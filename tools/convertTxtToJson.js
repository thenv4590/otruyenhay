const fs = require('fs');
const path = require('path');

const input = process.argv[2];
if (!input) {
  console.error('Usage: node convertTxtToJson.js <input.txt>');
  process.exit(1);
}

let src = fs.readFileSync(input, 'utf8');
// chuẩn hóa xuống dòng sang \n để JSON dùng \n
src = src.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

// Lấy title: dòng đầu tiên không rỗng
const allLines = src.split('\n');
let title = '';
for (const l of allLines) {
  if (l.trim().length) { title = l.trim(); break; }
}
if (!title) { console.error('Không tìm thấy title'); process.exit(1); }

// Lấy description giữa 2 #### (giữ nguyên newline)
let description = '';
const descMatch = src.match(/####\s*([\s\S]*?)\s*####/m);
if (descMatch) {
  description = descMatch[1].replace(/^\n+/, '').replace(/\n+$/, '');
}

// Xác định phần body sau block mô tả (hoặc sau title nếu không có mô tả)
let bodyStart = 0;
if (descMatch) {
  bodyStart = src.indexOf(descMatch[0]) + descMatch[0].length;
} else {
  const idx = src.indexOf(title);
  bodyStart = idx >= 0 ? idx + title.length : 0;
}
const body = src.slice(bodyStart);

// Tìm tất cả vị trí tiêu đề chương (không ăn mất newline)
const headingRe = /^ *(?:Chương|Chuong)\s*(\d+)\s*:/gim;
const matches = [];
let m;
while ((m = headingRe.exec(body)) !== null) {
  matches.push({ index: m.index, len: m[0].length, num: parseInt(m[1], 10) });
}
const chapters = [];
for (let i = 0; i < matches.length; i++) {
  const cur = matches[i];
  const nextIdx = (i + 1 < matches.length) ? matches[i + 1].index : body.length;
  let start = cur.index + cur.len;
  // nếu ký tự tiếp theo là newline thì nhảy qua nó (loại bỏ newline ngay sau "Chương X:")
  if (body[start] === '\n') start++;
  let raw = body.slice(start, nextIdx);
  // loại bỏ newline/dòng trắng ở đầu và cuối chương, giữ nguyên tất cả newline bên trong
  raw = raw.replace(/^\n+/, '').replace(/\n+$/, '');
  // loại bỏ nếu bắt đầu bằng 1 hoặc nhiều khoảng trắng rồi newline (ví dụ " \n")
  raw = raw.replace(/^[ \t]+\n/, '');
  // giữ nguyên spaces và line-breaks -> JSON.stringify sẽ escape thành \n
  chapters.push({ chapter: cur.num, content: raw });
}

if (!chapters.length) {
  console.warn('Không tìm thấy chương. Kiểm tra định dạng "Chương X:"');
}

// slugify title -> filename + cover
function slugify(s) {
  return String(s || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const slug = slugify(title) || 'story';
const cover = `${slug}.jpg`;

const outObj = {
  title,
  cover,
  description,
  chapters: chapters.sort((a,b) => a.chapter - b.chapter)
};

const outDir = path.join(__dirname, '..', 'stories');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const outPath = path.join(outDir, `${slug}.json`);
fs.writeFileSync(outPath, JSON.stringify(outObj, null, 2), 'utf8');
console.log('Đã tạo:', outPath);