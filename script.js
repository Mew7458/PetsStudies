const background = document.getElementById("background");
const title = document.getElementById("title");
const frame = document.getElementById("petFrame");
const hotspots = Array.from(document.querySelectorAll(".hotspot"));
const scene = document.getElementById("scene");
let titleTimeouts = [];
let animationTimer = null;
let currentFrameIndex = 0;
let currentFrames = [];
let currentFps = 0;
let loadToken = 0;

const PETS = {
  snail: {
    label: "Snail",
    image: "PetsStudiesAnimation/PetsSnail.PNG",
    framesFolder: "PetsStudiesAnimation/Snail",
    fps: 8,
  },
  beetle: {
    label: "Dorcus",
    image: "PetsStudiesAnimation/PetsBeetle.PNG",
    framesFolder: "PetsStudiesAnimation/Beetle",
    fps: 10,
  },
  gecko: {
    label: "Leopard Gecko",
    image: "PetsStudiesAnimation/PetsGecko.PNG",
    framesFolder: "PetsStudiesAnimation/Gecko",
    fps: 10,
  },
  fish: {
    label: "Red Wolf Fish",
    image: "PetsStudiesAnimation/PetsFish.PNG",
    framesFolder: "PetsStudiesAnimation/Fish",
    fps: 10,
  },
  python: {
    label: "Ball Python",
    image: "PetsStudiesAnimation/PetsPython.PNG",
    framesFolder: "PetsStudiesAnimation/Python",
    fps: 10,
  },
};

function positionHotspots() {
  const imageRect = background.getBoundingClientRect();
  hotspots.forEach((hotspot) => {
    const x = Number.parseFloat(hotspot.dataset.x);
    const y = Number.parseFloat(hotspot.dataset.y);
    const w = Number.parseFloat(hotspot.dataset.w);
    const h = Number.parseFloat(hotspot.dataset.h);
    hotspot.style.left = `${imageRect.left + imageRect.width * x}px`;
    hotspot.style.top = `${imageRect.top + imageRect.height * y}px`;
    hotspot.style.width = `${imageRect.width * w}px`;
    hotspot.style.height = `${imageRect.height * h}px`;
  });
}

function setTitle(text) {
  titleTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
  titleTimeouts = [];
  title.classList.remove("fade-in", "fade-out");
  title.classList.add("fade-out");
  const swapTimeout = window.setTimeout(() => {
    title.textContent = text;
    title.classList.remove("fade-out");
    title.classList.add("fade-in");
  }, 600);
  titleTimeouts.push(swapTimeout);
}

function resetScene() {
  background.src = "PetsStudiesAnimation/Pets.PNG";
  setTitle("Pets Studies");
  frame.classList.remove("active");
  stopAnimation();
}

function stopAnimation() {
  if (animationTimer) {
    clearInterval(animationTimer);
    animationTimer = null;
  }
  currentFrameIndex = 0;
  currentFrames = [];
  frame.removeAttribute("src");
}

function loadFrames(folder, maxFrames = 240) {
  const frames = [];
  return new Promise((resolve) => {
    let index = 1;
    const loadNext = () => {
      if (index > maxFrames) {
        resolve(frames);
        return;
      }
      const src = `${folder}/${index}.png`;
      const img = new Image();
      img.onload = () => {
        frames.push(src);
        index += 1;
        loadNext();
      };
      img.onerror = () => {
        resolve(frames);
      };
      img.src = src;
    };
    loadNext();
  });
}

function startAnimation(framesList, fps) {
  stopAnimation();
  if (!framesList.length || !fps) {
    return;
  }
  currentFrames = framesList;
  currentFps = fps;
  frame.src = currentFrames[0];
  frame.classList.add("active");
  animationTimer = window.setInterval(() => {
    currentFrameIndex = (currentFrameIndex + 1) % currentFrames.length;
    frame.src = currentFrames[currentFrameIndex];
  }, 1000 / currentFps);
}

async function activatePet(key) {
  const pet = PETS[key];
  if (!pet) {
    return;
  }
  loadToken += 1;
  const currentToken = loadToken;
  background.src = pet.image;
  setTitle(pet.label);
  const framesList = await loadFrames(pet.framesFolder);
  if (currentToken !== loadToken) {
    return;
  }
  startAnimation(framesList, pet.fps);
}

scene.addEventListener("click", (event) => {
  const target = event.target;
  if (target.classList.contains("hotspot")) {
    activatePet(target.dataset.pet);
  } else {
    resetScene();
  }
});

window.addEventListener("resize", positionHotspots);
background.addEventListener("load", positionHotspots);
positionHotspots();

setTimeout(() => {
  title.classList.add("visible");
}, 500);
