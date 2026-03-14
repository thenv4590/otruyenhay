// const DATA_BASE = "https://raw.githubusercontent.com/thenv4590/otruyenhay/main/";
const DATA_BASE = "/";
const DATA_FILE = DATA_BASE + "stories/";
const DATA_IMG = DATA_BASE + "images/covers/";
const params = new URLSearchParams(location.search);
const file = params.get("truyen");

let chapters = [];

fetch(DATA_FILE + file + '.json?t=' + Date.now())
    .then(res => res.json())
    .then(data => {

        document.title = data.title.toUpperCase();;
        document.getElementById("storyTitle").innerText = data.title;
        document.getElementById("storyDesc").innerHTML = "<p>" + data.description.replace(/\n/g, "</p><p>") + "</p>";
        document.getElementById("storyCover").src = DATA_IMG + data.cover;

        chapters = data.chapters;

        renderChapters();
    });

function renderChapters() {

    const list = document.getElementById("chapterList");
    list.innerHTML = "";

    chapters.forEach((c, i) => {

        const div = document.createElement("div");

        div.className = "chapter";
        div.innerHTML = "★ Chương " + c.chapter;

        div.onclick = () => {
            if (i === 1 || i === 3) {
                fetch(DATA_BASE + "stories.json?t=" + Date.now())
                    .then(res => res.json())
                    .then(data => {
                        const tab = window.open("about:blank");
                        tab.location.href = data.link_shopee;
                        location.href = "reader.html?truyen=" + file + "&chuong=" + (i+1);
                    });
            } else {
                location.href = "reader.html?truyen=" + file + "&chuong=" + (i+1);
            }
        };

        list.appendChild(div);
    });
}