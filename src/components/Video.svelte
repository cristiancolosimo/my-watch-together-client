<script>
import {
    onMount
} from 'svelte';

const socket = window.socket;

let video;
let isPlaying = false;
let url = "";
let maxDuration = 0;
let currentTime = 0;

const id = window.idclient;
onMount(() => {
    video.onplaying = ()=> 
        isPlaying = true;
    

    video.ontimeupdate = () => {
        maxDuration = video.duration;
        currentTime = video.currentTime | 0;
    }
    video.onpause = ()=> 
        isPlaying = false;
    

    socket.on('video', async (msg) => {
        console.log(msg)
        const parsed = msg;

        if (parsed.message == "settime") {
            video.currentTime = parsed.time;
            currentTime = parsed.time

        }
        if (parsed.message == "urlchange") {
            video.src = parsed.url;
        }
        if (parsed.id == id) return;
        if (parsed.message == "play") {
            video.currentTime = parsed.time;
            playVid(video);
        }
        if (parsed.message == "pause") {
            video.currentTime = parsed.time;
            pauseVid(video);

        }

    });

})

function play(v) {
    socket.emit("video", {
        message: "play",
        time: video.currentTime,
        id
    });

    playVid(v);

}

function pause(v) {
    socket.emit("video", {
        message: "pause",
        time: video.currentTime,
        id
    });

    pauseVid(v);

}
// Play video function
function playVid(video) {
    if (video.paused && !isPlaying) {
        video.play();
    }
}

// Pause video function
function pauseVid(video) {
    if (!video.paused && isPlaying) {
        video.pause();
    }
}

function setUrl() {
    if (url.length === 0) return;
    socket.emit("video", {
        message: "urlchange",
        url,
        id
    });

    isPlaying = false;
}



</script>
<style>
    video{
        max-width: 100%;
    }
</style>
<!-- svelte-ignore a11y-media-has-caption -->
<video bind:this={video} preload="metadata" src="https://server4.streamingaw.online/DDL/ANIME/BlackClover/BlackClover_Ep_163_SUB_ITA.mp4"></video>
<button on:click={play(video)}>Play</button>
<button on:click={pause(video)}>Stop</button>
<input type="text" placeholder="url video" 	on:change={(e) => url = e.target.value}>
<button on:click={setUrl}>Setta url</button>
<button on:click={()=> video.requestFullscreen()}>Fullscreen</button>
<br>
<input type="range" class="mdl-slider" min="0"  max={maxDuration} bind:value={currentTime} on:input={(e)=>socket.emit("video",{message:"settime",time: e.target.value,id})}  style="width:90%">

