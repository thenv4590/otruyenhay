const params = new URLSearchParams(location.search);
const storyFile = params.get("file");

let storyData;
let chapterIndex = 0;
let stories = [];
let currentPage = 1;
const perPage = 5;

/* LOAD DANH SÁCH TRUYỆN */

function loadStories() {

    fetch("stories.json")
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
            location.href = "story.html?file=" + story.file;
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

    storyData = await fetch(storyFile).then(r => r.json());

    document.getElementById("title").innerText = storyData.title;

    renderChapter();

}


/* HIỂN THỊ CHƯƠNG */

function renderChapter() {

    const ch = storyData.chapters[chapterIndex];

    document.getElementById("chapterTitle").innerText =
        "Chương " + ch.chapter + ": " + ch.title;

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