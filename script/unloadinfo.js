import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDf4a4weMr4WO6ieTXtHikH1VCnLOgMiYE",
  authDomain: "igrokritica-cb7fa.firebaseapp.com",
  projectId: "igrokritica-cb7fa",
  storageBucket: "igrokritica-cb7fa.appspot.com",
  messagingSenderId: "111927638247",
  appId: "1:111927638247:web:f0071d76c0ab77a1c40a42",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const gamesCollection = collection(db, "games");

getDocs(gamesCollection).then((querySnapshot) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  querySnapshot.forEach((doc) => {
    const data = doc.data();

    const name = data.name;
    const imageURL = data.imageURL;
    const criticsRaiting = data.criticsRaiting;
    const description = data.description;
    const timestamp = doc.data().date;
    const date = timestamp.toDate();
    const formattedDate = date.toISOString().split("T")[0];
    const ID = data.ID;
    const genre = data.genre;
    const platforms = data.platforms;

    if (date > today) {
      return;
    }

    let platformTitles = Object.keys(platforms)
      .map((platform) => platforms[platform].title)
      .join(", ");

    const gameCard = document.createElement("a");
    gameCard.href = `gamePage.html?ID=${ID}&name=${encodeURIComponent(name)}`;
    gameCard.classList.add("gameCard");
    gameCard.title = name;
    gameCard.dataset.genre = genre;
    gameCard.dataset.platform = platformTitles;
    gameCard.dataset.date = date;
    gameCard.dataset.names = name;

    const image = document.createElement("img");
    image.src = imageURL;

    const nameElement = document.createElement("span");
    nameElement.id = "name";
    nameElement.textContent = name;

    const dateElement = document.createElement("span");
    dateElement.id = "date";
    dateElement.textContent = formattedDate;

    const descriptionElement = document.createElement("span");
    descriptionElement.id = "description";
    descriptionElement.textContent = description;

    const scoreCont = document.createElement("div");
    scoreCont.classList.add("scoreCont");

    let color = "";
    let text = "";
    if (criticsRaiting >= 0 && criticsRaiting < 40) {
      color = "#ff6874";
      text = "отрицательные";
    } else if (criticsRaiting >= 40 && criticsRaiting < 75) {
      color = "#ffbd3f";
      text = "положительные";
    } else if (criticsRaiting >= 75 && criticsRaiting <= 100) {
      color = "#00ce7a";
      text = "крайне положительные";
    }

    if (isNaN(criticsRaiting) || criticsRaiting === null) {
      const scoreMes = document.createElement("span");
      scoreMes.id = "score";
      scoreMes.textContent = "ИК";
      scoreMes.style.backgroundColor = "#00ce7a";
      scoreCont.appendChild(scoreMes);
    } else {
      const scoreElement = document.createElement("span");
      scoreElement.id = "score";
      scoreElement.textContent = criticsRaiting;
      scoreElement.style.backgroundColor = color;
      scoreCont.appendChild(scoreElement);
    }

    const scoreText = document.createElement("span");
    scoreText.id = "scoreText";
    scoreText.textContent = text;

    gameCard.appendChild(image);
    gameCard.appendChild(nameElement);
    gameCard.appendChild(dateElement);
    gameCard.appendChild(descriptionElement);
    gameCard.appendChild(scoreCont);
    gridTable.appendChild(gameCard);
    scoreCont.appendChild(scoreText);
  });
});

const buttons = document.querySelectorAll(".button-custom");
const buttonsPlatforms = document.querySelectorAll(".button-platform");
const sortButtons = document.querySelectorAll(".button-options");
const resetButton = document.getElementById("deleteSort");

let url = new URL(window.location);
let params = new URLSearchParams(url.search);
let genres = params.getAll("genre");
let platformsList = params.getAll("platform");

function filterGames() {
  const gameCards = Array.from(document.querySelectorAll(".gameCard"));
  gameCards.forEach((gameCard) => {
    const genre = gameCard.dataset.genre;
    const platformData = gameCard.dataset.platform.split(", ");
    const genreMatch = genres.length === 0 || genres.includes(genre);
    const platformMatch =
      platformsList.length === 0 ||
      platformsList.some((platform) => platformData.includes(platform));
    if (genreMatch && platformMatch) {
      gameCard.style.display = "grid";
    } else {
      gameCard.style.display = "none";
    }
  });
}

buttons.forEach((button) => {
  button.addEventListener("click", function () {
    const genre = button.getAttribute("data-genre");
    if (genres.includes(genre)) {
      genres = genres.filter((g) => g !== genre);
      button.classList.remove("clicked");
    } else {
      genres.push(genre);
      button.classList.add("clicked");
    }
    params.set("genre", genres.join(","));
    url.search = params.toString();
    filterGames();
  });
});

buttonsPlatforms.forEach((button) => {
  button.addEventListener("click", function () {
    const platform = button.getAttribute("data-platforms");
    if (platformsList.includes(platform)) {
      platformsList = platformsList.filter((p) => p !== platform);
      button.classList.remove("clicked");
    } else {
      platformsList.push(platform);
      button.classList.add("clicked");
    }
    params.set("platform", platformsList.join(","));
    url.search = params.toString();
    filterGames();
  });
});

let currentSortOption = null;
sortButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const option = button.getAttribute("data-option");
    if (currentSortOption === option) {
      resetSort();
      currentSortOption = null;
      button.classList.remove("clicked");
    } else {
      sortButtons.forEach((btn) => btn.classList.remove("clicked"));
      currentSortOption = option;
      button.classList.add("clicked");
      sortGameCards(currentSortOption);
    }
  });
});

function sortGameCards(option) {
  const gameCards = Array.from(document.querySelectorAll(".gameCard"));
  gameCards.sort((a, b) => {
    let aValue, bValue;
    if (option === "dateLast") {
      aValue = new Date(a.dataset.date);
      bValue = new Date(b.dataset.date);
      return aValue - bValue;
    } else if (option === "dateFirst") {
      aValue = new Date(a.dataset.date);
      bValue = new Date(b.dataset.date);
      return bValue - aValue;
    } else if (option === "raitingLast") {
      aValue = parseFloat(a.querySelector("#score").textContent);
      bValue = parseFloat(b.querySelector("#score").textContent);
      return aValue - bValue;
    } else if (option === "raitingFirst") {
      aValue = parseFloat(a.querySelector("#score").textContent);
      bValue = parseFloat(b.querySelector("#score").textContent);
      return bValue - aValue;
    }
    return 0;
  });
  const gridTable = document.querySelector("#gridTable");
  gridTable.innerHTML = "";
  gameCards.forEach((card) => gridTable.appendChild(card));
}

function resetSort() {
  const gridTable = document.querySelector("#gridTable");
  const gameCards = Array.from(document.querySelectorAll(".gameCard"));
  gameCards.forEach((card) => gridTable.appendChild(card));
  sortButtons.forEach((btn) => btn.classList.remove("clicked"));
}

resetButton.addEventListener("click", function () {
  resetSort();
  genres = [];
  platformsList = [];
  params.delete("genre");
  params.delete("platform");
  url.search = params.toString();
  history.replaceState(null, "", url);
  filterGames();
  buttons.forEach((button) => button.classList.remove("clicked"));
  buttonsPlatforms.forEach((button) => button.classList.remove("clicked"));
  sortButtons.forEach((button) => button.classList.remove("clicked"));
});
