const DATA_BASE = "https://raw.githubusercontent.com/thenv4590/otruyenhay/main/";
const DATA_IMG = DATA_BASE + "images/covers/";
const params = new URLSearchParams(location.search);
const file = params.get("file");

let chapters = [];

fetch(DATA_BASE + file + '?t=' + Date.now())
    .then(res => res.json())
    .then(data => {

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
        div.innerHTML = "✱ Chương " + c.chapter;

        div.onclick = () => {
            location.href =
                "reader.html?file=" + file + "&chapter=" + i;
        };

        list.appendChild(div);
    });
}