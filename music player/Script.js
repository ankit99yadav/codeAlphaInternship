let songName = document.querySelector("#song-name");
let songArtist = document.querySelector("#song-Artist");
let songimage = document.querySelector(".song-img");
let playPauseImage = document.querySelector("#play-pause");
let volumeRange = document.querySelector("#volume-range");
let volSvg = document.querySelector("#vol-svg");
let songRange = document.querySelector("#Song-duration");
let MusicAnime = document.querySelector("#music-anime");
let playListImg = document.querySelector("#playlist-img");
let playList = document.querySelector(".playlist");
let playListSong = document.querySelectorAll(".playlist-song");

let index = 0;
let playingSong = false;
let Track = document.createElement("audio");

let songs = [
    {
        name: "Hamari Adhuri Kahani",
        path: "hamari-adhuri-kahani.mp3",
        image: "image1.jpeg",
        singer: "Arijit Singh"
    },
    {
        name: "Tum kya Mile",
        path: "tum-kya-mile.mp3",
        image: "images2.jpeg",
        singer: "Arijit Singh, Shreya Ghosal"
    },
    {
        name: "SATRANGA",
        path: "satranga.mp3",
        image: "image3.jpeg",
        singer: "Arijit Singh"
    },
    {
        name: "Uska Hi Bana",
        path: "uska-hi-bana.mp3",
        image: "image4.jpeg",
        singer: "Arijit Singh"
    },
];

function LoadTrack(index) {
    Track.src = songs[index].path;
    songName.innerHTML = songs[index].name;
    songArtist.innerHTML = songs[index].singer;
    songimage.style.backgroundImage = `url("${songs[index].image}")`;

    Track.load();
    Track.loop = true;
    // Update duration slider when metadata is loaded
    Track.addEventListener("loadedmetadata", () => {
        songRange.max = Track.duration;
    });
}

function playPauseSongs() {
    if (!playingSong) {
        playSong();
         
    } else {
        PauseSong();
          MusicAnime.style.display = "none";

    }
}

function playSong() {
    Track.play();
    playingSong = true;
    playPauseImage.src = "pause.svg";
    MusicAnime.style.display = "block";
}

function PauseSong() {
    Track.pause();
    playingSong = false;
    playPauseImage.src = "play.svg";
    MusicAnime.style.display = "none";
}

function NextSongs() {
    index = (index + 1) % songs.length;
    LoadTrack(index);
    playSong();
}

function PreviousSongs() {
    index = (index - 1 + songs.length) % songs.length;
    LoadTrack(index);
    playSong();
}

function volume() {
    Track.volume = volumeRange.value / 100;
    volSvg.src = volumeRange.value == 0 ? "mute.svg" : "volume.svg";
}

// Volume event
volumeRange.addEventListener("input", volume);

// Progress slider update based on currentTime
setInterval(() => {
    if (!isNaN(Track.duration)) {
        songRange.value = Track.currentTime;
    }
}, 500); // 0.5 second

// Seek when user drags the range input
songRange.addEventListener("input", () => {
    Track.currentTime = songRange.value;
});

// Initialize
LoadTrack(index);


playListImg.addEventListener("click",()=>{
playList.classList.toggle("playlist-active");
if(playList.classList.contains("playlist-active")){
    playListImg.src ="cross.svg";
}else{
playListImg.src = "playlist.svg"
}
});

playListSong.forEach((song,index)=>{
    song.addEventListener("click",()=>{
        LoadTrack(index);
        playSong();
        playList.classList.remove("playlist-active");
        playListImg.src = "playlist.svg";

    })
});

