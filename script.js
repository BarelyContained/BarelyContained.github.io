const popUp = document.getElementById("pop-up");
const content = document.getElementById("content");
const player = document.getElementById("player");
const lightbox = document.getElementById("lightbox");
const stage = document.getElementById("lightbox-stage");
const caption = document.getElementById("lightbox-caption");
const prev = document.getElementById("lightbox-prev");
const next = document.getElementById("lightbox-next");
const audio = new Audio();
audio.loop = true;
audio.volume = 0.6;

let tiles = [];          // every image/video in the open project, in page order
let current = 0;         // which one the lightbox is showing
let resumeMusic = false; // true while a video has interrupted the music

function stopMusic() {
    audio.pause();
    audio.currentTime = 0;
}

// Turns every ![alt](file) in a project into a clickable tile. A file ending in
// .mp4/.webm/.mov becomes a video, and images/videos sharing a paragraph become a grid.
function buildMedia(root) {
    root.querySelectorAll("img").forEach(img => {
        const src = img.getAttribute("src");
        const isVideo = /\.(mp4|webm|mov)$/i.test(src);

        const tile = document.createElement("button");
        tile.className = "media-tile";
        tile.classList.toggle("is-video", isVideo);
        tile.dataset.src = src;
        tile.dataset.caption = img.alt;
        tile.setAttribute("aria-label", `Zoom in: ${img.alt}`);
        img.replaceWith(tile);

        if (isVideo) {
            const thumb = document.createElement("video");
            thumb.src = src + "#t=0.1"; // makes phones show a first frame instead of a blank box
            thumb.muted = true;
            thumb.playsInline = true;
            thumb.preload = "metadata";
            tile.append(thumb);
        } else {
            tile.append(img);
        }
    });

    root.querySelectorAll("p").forEach(p => {
        const onlyTiles = [...p.childNodes].every(n =>
            n.nodeType === Node.ELEMENT_NODE ? n.matches(".media-tile") : !n.textContent.trim());
        if (onlyTiles && p.children.length > 1) p.classList.add("media-grid");
    });
}

function restoreMusic() {
    if (resumeMusic && popUp.matches(":popover-open")) audio.play();
    resumeMusic = false;
}

function show(index) {
    current = (index + tiles.length) % tiles.length;
    const tile = tiles[current];
    restoreMusic();

    let media;
    if (tile.classList.contains("is-video")) {
        media = document.createElement("video");
        media.controls = true;
        media.autoplay = true;
        media.playsInline = true;
        // The project's music gives way to the video's own sound
        media.onplay = () => {
            if (!audio.paused) {
                resumeMusic = true;
                audio.pause();
            }
        };
    } else {
        media = document.createElement("img");
        media.alt = tile.dataset.caption;
    }
    media.src = tile.dataset.src;

    stage.replaceChildren(media);
    caption.textContent = tile.dataset.caption;
    prev.hidden = next.hidden = tiles.length < 2;
}

document.querySelectorAll("#projects-collection a").forEach(link => {
    link.onclick = async (e) => {
        e.preventDefault(); // stop href="#" jumping to the top

        const md = await fetch(link.dataset.file).then(r => r.text());
        // Built in a template first so a video isn't briefly requested as an image
        const template = document.createElement("template");
        template.innerHTML = marked.parse(md);
        buildMedia(template.content);
        content.replaceChildren(template.content);
        tiles = [...content.querySelectorAll(".media-tile")];

        player.hidden = !link.dataset.music;
        if (link.dataset.music) audio.src = link.dataset.music;

        popUp.showPopover();
    };
});

content.onclick = (e) => {
    const tile = e.target.closest(".media-tile");
    if (!tile) return;
    show(tiles.indexOf(tile));
    lightbox.showPopover();
};

prev.onclick = () => show(current - 1);
next.onclick = () => show(current + 1);

// Clicking the dark area around the image closes the lightbox
lightbox.onclick = (e) => {
    if (e.target === lightbox || e.target === stage) lightbox.hidePopover();
};

document.addEventListener("keydown", e => {
    if (!lightbox.matches(":popover-open") || tiles.length < 2) return;
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
});

lightbox.addEventListener("toggle", e => {
    if (e.newState !== "closed") return;
    stage.replaceChildren(); // also stops a playing video
    restoreMusic();
});

document.getElementById("play").onclick = () => audio.play();
document.getElementById("stop").onclick = stopMusic;

// Music stops whenever the pop-up closes (✕, Esc, or clicking outside)
popUp.addEventListener("toggle", e => {
    if (e.newState === "closed") stopMusic();
});
