const DATA_BASE = "https://raw.githubusercontent.com/thenv4590/otruyenhay/main/";
const IMG_BASE = "https://raw.githubusercontent.com/thenv4590/otruyenhay/main/images/";
const params = new URLSearchParams(location.search);
const storyFile = params.get("file");

let storyData;
let chapterIndex = parseInt(params.get("chapter")) || 0;
let stories = [];
let currentPage = 1;
const perPage = 5;

/* LOAD DANH SÁCH TRUYỆN */

function loadStories() {

    fetch(DATA_BASE + "stories.json?t=" + Date.now())
        .then(res => res.json())
        .then(data => {
            stories = data;
            renderStories();
        });

}

function renderStories() {

    const list = document.getElementById("storyList");
    list.innerHTML = "";

    const start = (currentPage - 1) * perPage;
    const end = start + perPage;

    const pageStories = stories.slice(start, end);

    pageStories.forEach(story => {

        const div = document.createElement("div");
        div.className = "story";

        div.innerHTML = `
            <img src="${story.cover}">
            <div>
                <div class="story-title">${story.title}</div>
                <div class="story-desc">${story.description}</div>
            </div>
        `;

        div.onclick = () => {
            location.href = "story.html?file=stories/" + story.file;
        };

        list.appendChild(div);

    });

    renderPagination();

}

function renderPagination(){

    const totalPages = Math.ceil(stories.length / perPage);
    const p = document.getElementById("pagination");

    p.innerHTML = "";

    function btn(label, page, active=false){

        const b = document.createElement("button");
        b.innerText = label;

        if(active){
            b.style.background="#4CAF50";
            b.style.color="white";
        }

        b.onclick = ()=>{
            currentPage = page;
            renderStories();
        }

        return b;
    }

    if(currentPage > 1){
        p.appendChild(btn("«",1));
        p.appendChild(btn("‹",currentPage-1));
    }

    if(currentPage-1 >= 1){
        p.appendChild(btn(currentPage-1,currentPage-1));
    }

    p.appendChild(btn(currentPage,currentPage,true));

    if(currentPage+1 <= totalPages){
        p.appendChild(btn(currentPage+1,currentPage+1));
    }

    if(currentPage < totalPages){
        p.appendChild(btn("›",currentPage+1));
        p.appendChild(btn("»",totalPages));
    }

}
/* LOAD TRANG ĐỌC */

async function loadReader() {

    if (!storyFile) {
        document.body.innerHTML = "Không tìm thấy truyện";
        return;
    }

    storyData = await fetch(DATA_BASE + storyFile + '?t=' + Date.now()).then(r => r.json());

    document.getElementById("title").innerText = storyData.title;

    renderChapter();

}


/* HIỂN THỊ CHƯƠNG */

function renderChapter() {

    const ch = storyData.chapters[chapterIndex];

    document.getElementById("chapterTitle").innerText =
        "Chương " + ch.chapter + ": " + ch.title;

    const chapterNumber = chapterIndex + 1;
    if (chapterNumber === 2 || chapterNumber === 4) {
        showShopeeGate(ch);
    } else {
        showContent(ch);
    }
    

}

function showContent(ch) {

    document.getElementById("content").innerHTML =
        ch.content.replace(/\n/g, "<br>");

    const prevBtn1 = document.getElementById("prevBtn1");
    const nextBtn1 = document.getElementById("nextBtn1");
    const prevBtn2 = document.getElementById("prevBtn2");
    const nextBtn2 = document.getElementById("nextBtn2");

    prevBtn1.disabled = chapterIndex === 0;
    nextBtn1.disabled = chapterIndex === storyData.chapters.length - 1;
    prevBtn2.disabled = chapterIndex === 0;
    nextBtn2.disabled = chapterIndex === storyData.chapters.length - 1;

    window.scrollTo(0, 0);

}

function showShopeeGate(ch) {

    const content = document.getElementById("content");

    content.innerHTML = `
        <div style="text-align:center">

            <img id="shopeeAd"
                 src="${IMG_BASE}/shopee.png"
                 style="max-width:300px;cursor:pointer">

        </div>
    `;

    document.getElementById("shopeeAd").onclick = () => {

        window.open("https://shopee.vn", "_blank");

        showContent(ch);

    };

}

/* CHƯƠNG SAU */

function nextChapter() {

    if (chapterIndex < storyData.chapters.length - 1) {

        chapterIndex++;

        renderChapter();

    }

}


/* CHƯƠNG TRƯỚC */

function prevChapter() {

    if (chapterIndex > 0) {

        chapterIndex--;

        renderChapter();

    }

}


/* DARK MODE */

function toggleDark() {

    document.body.classList.toggle("dark");

}


/* AUTO CHẠY */

if (document.getElementById("storyList")) {

    loadStories();

}

if (storyFile) {

    loadReader();

}