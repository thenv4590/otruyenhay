const DATA_BASE = "https://raw.githubusercontent.com/thenv4590/otruyenhay/main/";
// const DATA_BASE = "/";
const DATA_FILE = DATA_BASE + "stories/";
const DATA_IMG = DATA_BASE + "images/covers/";
const IMAGES = DATA_BASE + "images/";
const params = new URLSearchParams(location.search);
const storyFile = params.get("truyen");

let storyData;
let chapterIndex = (parseInt(params.get("chuong")) || 1) - 1;
let stories = [];
let currentPage = 1;
const perPage = 5;

/* LOAD DANH SÁCH TRUYỆN */

function loadStories() {

    fetch(DATA_BASE + "stories.json?t=" + Date.now())
        .then(res => res.json())
        .then(data => {
            stories = data.stories;
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
        let desc = story.description.replace(/\n/g, "<br>");
        if (desc.length > 200) {
            desc = desc.substring(0, 200) + "...";
        }

        div.innerHTML = `
            <img src="${DATA_IMG + story.cover}">
            <div>
                <div class="story-title">${story.title}</div>
                <div class="story-desc">${desc}</div>
            </div>
        `;

        div.onclick = () => {
            location.href = "story.html?truyen=" + story.file;
        };

        list.appendChild(div);

    });

    renderPagination();

}

function renderPagination() {

    const totalPages = Math.ceil(stories.length / perPage);
    const p = document.getElementById("pagination");

    p.innerHTML = "";

    function btn(label, page, active = false) {

        const b = document.createElement("button");
        b.innerText = label;

        if (active) {
            b.style.background = "#4CAF50";
            b.style.color = "white";
        }

        b.onclick = () => {
            currentPage = page;
            renderStories();
        }

        return b;
    }

    if (currentPage > 1) {
        p.appendChild(btn("«", 1));
        p.appendChild(btn("‹", currentPage - 1));
    }

    if (currentPage - 1 >= 1) {
        p.appendChild(btn(currentPage - 1, currentPage - 1));
    }

    p.appendChild(btn(currentPage, currentPage, true));

    if (currentPage + 1 <= totalPages) {
        p.appendChild(btn(currentPage + 1, currentPage + 1));
    }

    if (currentPage < totalPages) {
        p.appendChild(btn("›", currentPage + 1));
        p.appendChild(btn("»", totalPages));
    }

}
/* LOAD TRANG ĐỌC */

async function loadReader() {

    if (!storyFile) {
        document.body.innerHTML = "Không tìm thấy truyện";
        return;
    }

    storyData = await fetch(DATA_FILE + storyFile + '.json?t=' + Date.now()).then(r => r.json());

    document.getElementById("title").innerText = storyData.title;

    renderChapter();

}


/* HIỂN THỊ CHƯƠNG */

function renderChapter() {
    const ch = storyData.chapters[chapterIndex];

    document.getElementById("chapterTitle").innerText =
        "Chương " + ch.chapter;

    showContent(ch);

    if (chapterIndex === 0 || chapterIndex === 1 || chapterIndex === 3) {
        fetch(DATA_BASE + "stories.json?t=" + Date.now())
            .then(res => res.json())
            .then(data => {
                const ua = navigator.userAgent;
                if (/iPhone|iPad|iPod/i.test(ua)) {
                    location.href = data.link_shopee;
                }
            });
    }
}

function showContent(ch) {

    const prevBtn1 = document.getElementById("prevBtn1");
    const nextBtn1 = document.getElementById("nextBtn1");
    const prevBtn2 = document.getElementById("prevBtn2");
    const nextBtn2 = document.getElementById("nextBtn2");
    const ua = navigator.userAgent;
    window.scrollTo(0, 0);

    // nếu KHÔNG phải iphone thì khóa chương
    const unlocked = localStorage.getItem("unlock_" + chapterIndex);
    if (!/iPhone|iPad|iPod/i.test(ua) && !unlocked && (chapterIndex === 1 || chapterIndex === 3)) {
        prevBtn1.style.display = "none";
        nextBtn1.style.display = "none";
        prevBtn2.style.display = "none";
        nextBtn2.style.display = "none";

        document.getElementById("content").innerHTML = `
            <div style="text-align:center;margin-top: -80px;">
                <img src="shopee.png" style="max-width: 90%;cursor:pointer" onclick="unlockChapter()">
            </div>
        `;

        return;
    }

    // iphone thì đọc bình thường
    document.getElementById("content").innerHTML =
        "<p>" + ch.content.replace(/\n/g, "</p><p>") + "</p>";

    prevBtn1.style.display = "";
    nextBtn1.style.display = "";
    prevBtn2.style.display = "";
    nextBtn2.style.display = "";

    prevBtn1.disabled = chapterIndex === 0;
    nextBtn1.disabled = chapterIndex === storyData.chapters.length - 1;
    prevBtn2.disabled = chapterIndex === 0;
    nextBtn2.disabled = chapterIndex === storyData.chapters.length - 1;


}

function unlockChapter(){

    fetch(DATA_BASE + "stories.json?t=" + Date.now())
        .then(res => res.json())
        .then(data => {
            // hiển thị lại nội dung ngay
            const prevBtn1 = document.getElementById("prevBtn1");
            const nextBtn1 = document.getElementById("nextBtn1");
            const prevBtn2 = document.getElementById("prevBtn2");
            const nextBtn2 = document.getElementById("nextBtn2");
            prevBtn1.style.display = "";
            nextBtn1.style.display = "";
            prevBtn2.style.display = "";
            nextBtn2.style.display = "";
            const ch = storyData.chapters[chapterIndex];
            document.getElementById("content").innerHTML =
                "<p>" + ch.content.replace(/\n/g, "</p><p>") + "</p>";
            localStorage.setItem("unlock_" + chapterIndex, 1);
            location.href = data.link_shopee;
        });

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