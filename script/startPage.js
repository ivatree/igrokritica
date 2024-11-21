import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
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

getDocs(query(collection(db, "games"), orderBy("date", "desc"))).then(
  (querySnapshot) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const timestamp = doc.data().date;
      const date = timestamp.toDate();
      const name = data.name;
      const imageURL = data.imageURL;
      const criticsRaiting = data.criticsRaiting;
      const ID = data.ID;

      if (date > today) {
        return;
      }

      const card = document.createElement("a");
      card.href = `gamePage.html?ID=${ID}&name=${encodeURIComponent(name)}`;
      card.classList.add("card");
      card.title = name;

      const image = document.createElement("img");
      image.src = imageURL;

      const nameElement = document.createElement("h2");
      nameElement.id = "gameName";
      nameElement.textContent = name;

      const gameScore = document.createElement("div");
      gameScore.classList.add("GameScore");

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
        text = "крайне  положительные";
      }

      const Score = document.createElement("p");
      Score.id = "Score";
      Score.textContent = criticsRaiting;
      Score.style.backgroundColor = color;

      const review = document.createElement("p");
      review.id = "review";
      review.textContent = text;

      card.appendChild(image);
      card.appendChild(nameElement);
      card.appendChild(gameScore);
      gameScore.appendChild(Score);
      gameScore.appendChild(review);
      container.appendChild(card);
    });
  }
);

getDocs(query(collection(db, "games"), orderBy("criticsRaiting", "desc"))).then(
  (querySnapshot) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const container = document.getElementById("widthCnt");
    container.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const name = data.name;
      const imageURL = data.imageURL;
      const criticsRaiting = data.criticsRaiting;
      const platforms = data.platforms;
      const ID = data.ID;
      const timestamp = doc.data().date;
      const date = timestamp.toDate();
      if (date > today) {
        return;
      }

      let platformTitles = Object.keys(platforms)
        .map((platform) => platforms[platform].title)
        .join(", ");

      const container = document.getElementById("widthCnt");

      const card = document.createElement("a");
      card.classList.add("cards");
      card.id = "card";
      card.dataset.platform = platformTitles;
      card.href = `gamePage.html?ID=${ID}&name=${encodeURIComponent(name)}`;
      card.title = name;

      const image = document.createElement("img");
      image.src = imageURL;

      const gameName = document.createElement("span");
      gameName.className = "names";
      gameName.textContent = name;

      let color = "";
      let acclaimText = "";
      if (criticsRaiting >= 0 && criticsRaiting < 40) {
        color = "#ff6874";
        acclaimText = "негативные";
      } else if (criticsRaiting >= 40 && criticsRaiting < 75) {
        color = "#ffbd3f";
        acclaimText = "положительные";
      } else if (criticsRaiting >= 75 && criticsRaiting <= 100) {
        color = "#00ce7a";
        acclaimText = "крайне положительные";
      }

      const score = document.createElement("div");
      score.id = "Score";
      score.textContent = criticsRaiting;
      score.style.backgroundColor = color;

      const platformName = document.createElement("span");
      platformName.className = "PlatformName";
      platformName.textContent = "PC";

      const acclaim = document.createElement("span");
      acclaim.className = "acclaimText";
      acclaim.textContent = acclaimText;

      const colorLine = document.createElement("div");
      colorLine.className = "scoreLine";
      colorLine.style.backgroundColor = color;

      card.appendChild(image);
      card.appendChild(gameName);
      card.appendChild(score);
      card.appendChild(acclaim);
      card.appendChild(colorLine);
      card.appendChild(platformName);
      container.appendChild(card);
    });
  }
);

const buttons = document.querySelectorAll(".button-custom");
let selectedPlatform = "PC";

function platformUnload(selectedPlatform) {
  const cards = Array.from(document.querySelectorAll(".cards"));
  const listStyle = document.querySelectorAll(".borderTop");

  cards.forEach((card) => {
    const platformData = card.dataset.platform.split(", ");
    const platformMatch =
      selectedPlatform === "" || platformData.includes(selectedPlatform);
    card.style.display = platformMatch ? "grid" : "none";
    const platformNameElement = card.querySelector(".PlatformName");
    if (platformMatch) {
      platformNameElement.textContent = selectedPlatform;
    } else {
      platformNameElement.textContent = "";
    }
  });
  listStyle.forEach((item) => {
    item.style.borderTop = "3px solid black";
  });
  if (selectedPlatform) {
    listStyle.forEach((item) => {
      const button = item.querySelector(".button-custom");
      if (
        button &&
        button.getAttribute("data-platforms") === selectedPlatform
      ) {
        item.style.borderTop = "3px solid white";
      }
    });
  }
}

buttons.forEach((button) => {
  const platform = button.getAttribute("data-platforms");
  if (platform === selectedPlatform) {
    button.classList.add("active");
    button.classList.add("disabled");
  }
  button.addEventListener("click", function () {
    if (button.classList.contains("active")) {
      return;
    } else {
      buttons.forEach((b) => {
        b.classList.remove("active");
        b.classList.remove("disabled");
      });
      selectedPlatform = platform;
      button.classList.add("active");
      button.classList.add("disabled");
    }
    platformUnload(selectedPlatform);
  });
});
platformUnload(selectedPlatform);

getDocs(query(collection(db, "games"), orderBy("date", "desc"))).then(
  (querySnapshot) => {
    const cont = document.getElementById("Container");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const timestamp = doc.data().date;
      const date = timestamp.toDate();
      const name = data.name;
      const imageURL = data.imageURL;
      const ID = data.ID;

      if (date < today) {
        return;
      }

      const card = document.createElement("a");
      card.href = `gamePage.html?ID=${ID}&name=${encodeURIComponent(name)}`;
      card.classList.add("card");
      card.title = name;

      const image = document.createElement("img");
      image.src = imageURL;

      const nameElement = document.createElement("h2");
      nameElement.id = "gameName";
      nameElement.textContent = name;

      const gameScore = document.createElement("div");
      gameScore.classList.add("GameScore");

      const Score = document.createElement("p");
      Score.id = "Score";
      Score.textContent = "ИК";
      Score.style.backgroundColor = "#00ce7a";

      const review = document.createElement("p");
      review.id = "review";
      review.textContent = date.toISOString().split("T")[0];

      card.appendChild(image);
      card.appendChild(nameElement);
      card.appendChild(gameScore);
      gameScore.appendChild(Score);
      gameScore.appendChild(review);
      cont.appendChild(card);
    });
  }
);

const newsCardsContainer = document.getElementById("newsCardsContainer");
getDocs(query(collection(db, "news"), limit(5)))
  .then((querySnapshot) => {
    if (!newsCardsContainer) {
      console.error("Элемент с ID 'newsCardsContainer' не найден.");
    }
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const { title, description, imageURL } = data;

      const newsCard = document.createElement("a");
      newsCard.classList.add("newsCard");
      newsCard.id = "newsCard";
      newsCard.href = "news.html";

      const newsPreview = document.createElement("img");
      newsPreview.id = "newsGamePicture";
      newsPreview.src = imageURL;

      const newsGameText = document.createElement("span");
      newsGameText.id = "newsGameText";
      newsGameText.textContent = title;

      const newsGameDescription = document.createElement("span");
      newsGameDescription.id = "newsGameDescription";
      newsGameDescription.textContent = description;

      newsCard.appendChild(newsPreview);
      newsCard.appendChild(newsGameText);
      newsCard.appendChild(newsGameDescription);
      newsCardsContainer.appendChild(newsCard);
    });
  })
  .catch((error) => {
    console.error("Ошибка при получении документов: ", error);
  });
