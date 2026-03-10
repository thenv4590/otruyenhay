const DATA_BASE = "https://raw.githubusercontent.com/thenv4590/otruyenhay/refs/heads/main/";
const params = new URLSearchParams(location.search);
const file = params.get("file");

let chapters = [];

fetch(DATA_BASE + file)
    .then(res => res.json())
    .then(data => {

        document.getElementById("storyTitle").innerText = data.title;
        document.getElementById("storyDesc").innerText = data.description;
        document.getElementById("storyCover").src = data.cover;

        chapters = data.chapters;

        renderChapters();
    });

function renderChapters() {

    const list = document.getElementById("chapterList");
    list.innerHTML = "";

    chapters.forEach((c, i) => {

        const div = document.createElement("div");

        div.className = "chapter";
        div.innerHTML = "✱ " + c.title;

        div.onclick = () => {
            location.href =
                "reader.html?file=" + file + "&chapter=" + i;
        };

        list.appendChild(div);
    });
}