let story={
 title:"",
 cover:"",
 chapters:[]
};

// load truyện có sẵn
document.getElementById("loadStory").addEventListener("change",function(e){

 const file=e.target.files[0];
 if(!file) return;

 const reader=new FileReader();

 reader.onload=function(evt){

   story=JSON.parse(evt.target.result);

   document.getElementById("storyTitle").value=story.title || "";
   document.getElementById("coverUrl").value=story.cover || "";

   alert("Đã load truyện. Hiện có "+story.chapters.length+" chương");

 };

 reader.readAsText(file);

});

function addChapter(){

story.title=document.getElementById("storyTitle").value;
story.cover=document.getElementById("coverUrl").value;

const num=parseInt(document.getElementById("chapterNumber").value);
const title=document.getElementById("chapterTitle").value;
const content=document.getElementById("chapterContent").value;

story.chapters.push({
chapter:num,
title:title,
content:content
});

alert("Đã thêm chương "+num);

}

function exportJSON(){

const blob=new Blob(
[JSON.stringify(story,null,2)],
{type:"application/json"}
);

const a=document.createElement("a");
a.href=URL.createObjectURL(blob);
a.download="story.json";
a.click();

}