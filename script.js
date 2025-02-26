console.log("hey javascript")
let titles =[]
let buttonPlay = document.getElementById("play")
let buttonPause = document.getElementById("pause")
let container = document.querySelector(".cards-container")



function formatTime(seconds){
    let mins = Math.floor(seconds/60)
    let secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}


async function getSongs(){
    let a = await fetch("http://127.0.0.1:5500/songs/")
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let links = div.querySelectorAll("#files li a")
    
    links.forEach(element => {
        let title = element.getAttribute("title")
        if(title.includes("mp3")){
        titles.push(title)}
        
    });
    songs = []
    links.forEach(element => {
        let href = element.getAttribute("href")
        if(href.endsWith(".mp3")){
        songs.push(href)}
    });
    return songs
}



async function loadImage() {
    let imgData = await fetch("http://127.0.0.1:5500/songsThumbnail/")
    let data = await imgData.text()
    let div = document.createElement("div")
    div.innerHTML = data
    let links = div.querySelectorAll("#files li a")
    let imgArr = []
    for(let link of links){
        let title = link.getAttribute("title")
        if(title.includes(".jpeg")){
        let extractTitle = title.split(".")
        imgArr.push(extractTitle[0])
    }

    }
    return imgArr;
}



let toggle = true

let currSong = 0
let audio;
let songs;

async function main(){
 songs = await getSongs()
 let songList = document.querySelector(".song-list")
 let ul = document.createElement("ul")
titles.forEach(element=>{
    let list = document.createElement("li")
    list.innerHTML = element;
    
    ul.append(list)
})
songList.append(ul)




for (let index = 0; index < titles.length; index++) {
    let element = titles[index];

    // Wait for the correct image source
    let src = await mergeImage(element);

    let card = document.createElement("div");
    card.classList.add("card");

    let image = document.createElement("img");
    image.setAttribute("src", src);

    card.append(image);
    card.innerHTML += `<h2>${element.replace(".mp3", "")}</h2> <p>Lorem ipsum dolor sit amet </p>`;
    container.appendChild(card);

    card.addEventListener("click", () => {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
        if (buttonPlay) {
            buttonPause.style.display = "block";
            buttonPlay.style.display = "none";
        }
        currSong = index;
        audio = new Audio(songs[currSong]);
        audio.play();
        titleFetch()
        addTimer(audio)
    });
}

playlistPlay();
} //  main func ends here


// new function for thumbnail
async function mergeImage(element) {
    let data = await loadImage();
    
    for (let item of data) {
        if (element.replace(".mp3", "") == item) {
            return "./songsThumbnail/" + item + ".jpeg"; //Return immediately on match
        }
    }
    return "https://i.scdn.co/image/ab67616d00001e02e46e7c9f477b2bc0c41688c8"; // Default image if no match
}




main()




function play() {
    if(!audio){
    audio = new Audio(songs[currSong]);}
        if(toggle){
        audio.play();        
        if(buttonPlay){
            buttonPause.style.display = "block"
            buttonPlay.style.display = "none"
        }       

        addTimer(audio)
    }
        else{
            audio.pause()
            if(buttonPause){
                buttonPlay.style.display = "block"
                buttonPause.style.display = "none"
            }
            
        }
        toggle = !toggle
        titleFetch()
        // addTimer(audio)
        
        

    
}
   
function next(){
    if(buttonPlay){
        buttonPause.style.display = "block"
        buttonPlay.style.display = "none"
    }
    if (audio) {
        audio.pause();
        audio.currentTime = 0; 
    }
    if(currSong< songs.length-1){
        currSong+=1
        audio = new Audio(songs[currSong])
        audio.play()
        

    }
    else{
        currSong = 0
        audio.play()
    }
    titleFetch() 
    addTimer(audio)
    
}


function previous(){
    if(buttonPlay){
        buttonPause.style.display = "block"
        buttonPlay.style.display = "none"
    }
    if (audio) {
        audio.pause();
        audio.currentTime = 0; 
    }
    if(currSong>=1 && currSong<songs.length){
        currSong-=1
        audio = new Audio(songs[currSong])
        audio.play()
        

    }
    else{
        currSong = 0
        audio.play()
    }
       
    titleFetch()
    addTimer(audio)
    
}


function playlistPlay(){
    let currLi = document.querySelectorAll(".song-list ul li" )
   
    currLi.forEach((li,index)=>{
        li.addEventListener("click",()=>{
            if(audio){
                audio.pause()
                audio.currentTime = 0
            }
            if(buttonPlay){
                buttonPause.style.display = "block"
                buttonPlay.style.display = "none"
            }
            currSong = index
            audio = new Audio(songs[currSong])
            audio.play()
            titleFetch()
            addTimer(audio)
        })
    })
    
}


function titleFetch(){
    let songTitle = titles[currSong]
    let songInfo = document.querySelector(".song-info")
    songInfo.innerHTML = ""
    let span = document.createElement("span")
    span.innerHTML = songTitle
    songInfo.appendChild(span)
}


// function addTimer(audio) {
//     let songTime = document.querySelector(".song-time");
//     let span = document.createElement("span");
//     songTime.innerHTML = ""
//     songTime.appendChild(span);

//     audio.addEventListener("timeupdate", () => {
//         if (!audio.duration) return; // Prevent NaN issues

//         let currentTime = formatTime(audio.currentTime);
//         let duration = formatTime(audio.duration);

//         span.innerHTML = `${currentTime} / ${duration}`;
//     });
// }

function addTimer(audio) {
    let songTime = document.querySelector(".song-time");
    
    // Clear any existing timer display
    songTime.innerHTML = "";

    let span = document.createElement("span");
    songTime.appendChild(span);

    // Function to update time
    function updateTime() {
        if (!audio.paused && audio.duration) {  // Only update when playing
            let currentTime = formatTime(audio.currentTime);
            let duration = formatTime(audio.duration);
            span.innerHTML = `${currentTime} / ${duration}`;
            document.querySelector(".circle").style.left = (audio.currentTime/audio.duration)*100+"%"
        }
    }

    // Attach event listener to update time
    audio.addEventListener("timeupdate", updateTime);

    // Stop updating when paused
    audio.addEventListener("pause", () => {
        span.innerHTML = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
    });
}



document.getElementById("play").addEventListener("click",play)
document.getElementById("pause").addEventListener("click",play)
document.getElementById("next").addEventListener("click",next)
document.getElementById("prev").addEventListener("click",previous)
   




play()
next()

