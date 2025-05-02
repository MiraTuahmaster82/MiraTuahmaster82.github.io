document.addEventListener("DOMContentLoaded", (event) => {
  document.getElementById("score").innerHTML = 'SCORE: ' + localStorage.Score;
});

const clicker = document.getElementById('mainclicker');
const clapper = document.getElementById('clapper');
const scoreCounter = document.getElementById('score')

const upgradeIDs = ["upgradeClickValue"]
const hoverText = new Map([
  ["upgradeClickValue", "Upgrade score per click."],
]);
const upgradeElements = new Map([])

const tooltip = document.createElement("div");
tooltip.id = "tooltip";
document.body.appendChild(tooltip);

for (let i=0; i < upgradeIDs.length; i++) {
  id = upgradeIDs[i];
  element = document.getElementById(upgradeIDs[i]);
  upgradeElements.set(id, element);

  if (!element) {
    console.warn("No element found for ", id)
  }
  console.log(hoverText.get(id))
  if (element) {
    element.addEventListener("mouseenter", (e) => {
      tooltip.innerHTML = hoverText.get(id)
      tooltip.style.display = "block";
    })
    element.addEventListener("mouseleave", () => {
      tooltip.style.display = "none";
    })
    element.addEventListener("mousemove", (e) => {
      tooltip.style.left = `${e.pageX+10}px`;
      tooltip.style.top = `${e.pageY+10}px`;
    })
  }
}

function randomAscii(len) {
  const min = 32;
  const max = 512;
  let string = '';
  for (let i = 0; i < len; i++) {
    const randomAscii = Math.floor(Math.random() * (max - min + 1)) + min;
    string += String.fromCharCode(randomAscii);
  }
  return string;
}

function clicked() {
  if (localStorage.Score) {
    localStorage.Score = Number(localStorage.Score) + 1;
    clicker.innerHTML = randomAscii(Math.ceil(Math.random()*5));
    if ((localStorage.Score % 5) == 0) {
      console.log('CLAP!');
      clapper.innerHTML = '👏';
    } else {
      clapper.innerHTML = '👐';
    }
  } else {
    localStorage.Score = 0;
  }
  scoreCounter.innerHTML = 'SCORE: ' + localStorage.Score;
}