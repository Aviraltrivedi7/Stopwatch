let startTime = 0;
let elapsed = 0;
let timer = null;
let running = false;

const display = document.getElementById("display");
const lapList = document.getElementById("lapList");
const circle = document.querySelector("circle");
const sound = document.getElementById("clickSound");

const CIRCUMFERENCE = 565;
let bestLap = null;

document.getElementById("start").onclick = start;
document.getElementById("pause").onclick = pause;
document.getElementById("reset").onclick = reset;

function playSound() {
  sound.currentTime = 0;
  sound.play();
}

function vibrate() {
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
}

function start() {
  if (!running) {
    playSound();
    vibrate();
    running = true;
    startTime = Date.now() - elapsed;
    timer = requestAnimationFrame(update);
  }
}

function pause() {
  if (running) {
    playSound();
    vibrate();
    running = false;
    cancelAnimationFrame(timer);
    addLap();
  }
}

function reset() {
  playSound();
  vibrate();
  running = false;
  cancelAnimationFrame(timer);
  elapsed = 0;
  display.textContent = "00:00:00.000";
  lapList.innerHTML = "";
  bestLap = null;
  circle.style.strokeDashoffset = CIRCUMFERENCE;
}

function update() {
  elapsed = Date.now() - startTime;

  const ms = elapsed % 1000;
  const sec = Math.floor(elapsed / 1000) % 60;
  const min = Math.floor(elapsed / 60000);
  const hr = Math.floor(elapsed / 3600000);

  display.textContent =
    `${pad(hr)}:${pad(min)}:${pad(sec)}.${padMs(ms)}`;

  // Smooth ring sync (1 minute cycle)
  const progress = (sec * 1000 + ms) / 60000;
  circle.style.strokeDashoffset =
    CIRCUMFERENCE * (1 - progress);

  if (running) timer = requestAnimationFrame(update);
}

function addLap() {
  const li = document.createElement("li");
  li.textContent = display.textContent;

  const lapTime = elapsed;
  if (bestLap === null || lapTime < bestLap) {
    bestLap = lapTime;
    document
      .querySelectorAll(".laps li")
      .forEach(l => l.classList.remove("best"));
    li.classList.add("best");
  }

  lapList.appendChild(li);
}

function pad(n) {
  return n < 10 ? "0" + n : n;
}

function padMs(n) {
  return n.toString().padStart(3, "0");
}
