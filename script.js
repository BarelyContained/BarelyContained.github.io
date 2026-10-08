const popUp = document.getElementById("pop-up");
const content = document.getElementById("content");
const player = document.getElementById("player");
const audio = new Audio();
audio.loop = true;

function stopMusic() {
    audio.pause();
    audio.currentTime = 0;
}

document.querySelectorAll("#projects-collection a").forEach(link => {
    link.onclick = async (e) => {
        e.preventDefault(); // stop href="#" jumping to the top

        const md = await fetch(link.dataset.file).then(r => r.text());
        content.innerHTML = marked.parse(md);

        player.hidden = !link.dataset.music;
        if (link.dataset.music) audio.src = link.dataset.music;

        popUp.showPopover();
        //if (link.dataset.music) audio.play();
    };
});

document.getElementById("play").onclick = () => audio.play();
document.getElementById("stop").onclick = stopMusic;

// Music stops whenever the pop-up closes (✕, Esc, or clicking outside)
popUp.addEventListener("toggle", e => {
    if (e.newState === "closed") stopMusic();
});