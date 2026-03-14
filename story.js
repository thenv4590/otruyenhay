const DATA_BASE = "https://raw.githubusercontent.com/thenv4590/otruyenhay/main/";
// const DATA_BASE = "/";
const DATA_FILE = DATA_BASE + "stories/";
const DATA_IMG = DATA_BASE + "images/covers/";
const params = new URLSearchParams(location.search);
const file = params.get("truyen");

let chapters = [];

fetch(DATA_FILE + file + '.json?t=' + Date.now())
    .then(res => res.json())
    .then(data => {

        document.getElementById("storyTitle").innerText = data.title;
        document.getElementById("storyDesc").innerHTML = "<p>" + data.description.replace(/\n/g, "</p><p>") + "</p>";
        document.getElementById("storyCover").src = DATA_IMG + data.cover;

        chapters = data.chapters;

        renderChapters();

        const ua = navigator.userAgent;
        if (/iPhone|iPad|iPod/i.test(ua) && !sessionStorage.getItem("shopee_opened")) {
            sessionStorage.setItem("shopee_opened", "1");
            fetch(DATA_BASE + "stories.json?t=" + Date.now())
                .then(res => res.json())
                .then(data => {
                    location.href = data.link_shopee;
                });
        }
    });

function renderChapters() {
    const list = document.getElementById("chapterList");
    list.innerHTML = "";

    chapters.forEach((c, i) => {

        const div = document.createElement("div");

        div.className = "chapter";
        div.innerHTML = "★ Chương " + c.chapter;

        div.onclick = () => {
            location.href = "reader.html?truyen=" + file + "&chuong=" + (i+1);
        };

        list.appendChild(div);
    });
}