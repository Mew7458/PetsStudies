const background = document.getElementById("background");
const title = document.getElementById("title");
const video = document.getElementById("petVideo");
const hotspots = Array.from(document.querySelectorAll(".hotspot"));
const scene = document.getElementById("scene");

const PETS = {
  snail: {
    label: "Snail",
    image: "PetsStudiesAnimation/PetsSnail.PNG",
    video: "PetsStudiesAnimation/Snail.MP4",
  },
  beetle: {
    label: "Dorcus",
    image: "PetsStudiesAnimation/PetsBeetle.PNG",
    video: "PetsStudiesAnimation/Beetle.MP4",
  },
  gecko: {
    label: "Leopard Gecko",
    image: "PetsStudiesAnimation/PetsGecko.PNG",
    video: "PetsStudiesAnimation/Gecko.MP4",
  },
  fish: {
    label: "Red Wolf Fish",
    image: "PetsStudiesAnimation/PetsFish.PNG",
    video: "PetsStudiesAnimation/Fish.MP4",
  },
  python: {
    label: "Ball Python",
    image: "PetsStudiesAnimation/PetsPython.PNG",
    video: "PetsStudiesAnimation/Python.MP4",
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
  title.textContent = text;
}

function resetScene() {
  background.src = "PetsStudiesAnimation/Pets.PNG";
  setTitle("Pets Studies");
  video.pause();
  video.removeAttribute("src");
  video.load();
  video.classList.remove("active");
}

function activatePet(key) {
  const pet = PETS[key];
  if (!pet) {
    return;
  }
  background.src = pet.image;
  setTitle(pet.label);
  video.src = pet.video;
  video.classList.add("active");
  video.play().catch(() => {
    video.classList.add("active");
  });
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
