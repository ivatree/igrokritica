import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
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
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

async function searchGamesByName(name) {
  console.log("Поиск игры:", name);
  const gamesCollection = collection(db, "games");
  const normalizedInput = name.toLowerCase();
  try {
    if (normalizedInput.length === 0) {
      searchResults.innerHTML = "";
      searchResults.style.display = "none";
      return;
    }

    const gameNameQuery = query(
      gamesCollection,
      where("name", ">=", normalizedInput + "\uf8ff") &&
        ("name", "<=", normalizedInput + "\uf8ff")
    );

    const querySnapshot = await getDocs(gameNameQuery);
    searchResults.innerHTML = "";

    if (querySnapshot.empty) {
      searchResults.style.display = "none";
      return;
    }
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const logo = data.imageURL;
      const searchName = data.name;
      const genre = data.genre;
      const timestamp = doc.data().date;
      const date = timestamp.toDate();
      const formattedDate = date.toISOString().split("T")[0];
      const raiting = data.criticsRaiting;
      const ID = data.ID;
      const names = data.name;
      const gameField = document.createElement("a");
      gameField.classList.add("cont");
      gameField.href = `gamePage.html?ID=${ID}&name=${encodeURIComponent(names)}`;

      const prewiew = document.createElement("img");
      prewiew.className = "searchPrewiew";
      prewiew.src = logo;

      const name = document.createElement("span");
      name.className = "searchName";
      name.textContent = searchName;

      const gameGenre = document.createElement("span");
      gameGenre.className = "gameGenre";
      gameGenre.textContent = "Жанр:" + " " + genre;

      const releseDate = document.createElement("span");
      releseDate.classList = "releseDate";
      releseDate.textContent = "Дата выхода: " + formattedDate;

      let color = "";
      if (raiting >= 0 && raiting < 40) {
        color = "#ff6874";
      } else if (raiting >= 40 && raiting < 75) {
        color = "#ffbd3f";
      } else if (raiting >= 75 && raiting <= 100) {
        color = "#00ce7a";
      }

      const colorLine = document.createElement("div");
      colorLine.className = "searchColorLine";
      colorLine.style.backgroundColor = color;

      gameField.appendChild(prewiew);
      gameField.appendChild(name);
      gameField.appendChild(gameGenre);
      gameField.appendChild(releseDate);
      gameField.appendChild(colorLine);

      if (data.name.toLowerCase().startsWith(normalizedInput)) {
        searchResults.appendChild(gameField);
      }
    });
    searchResults.style.display = "grid";
  } catch (error) {
    console.error("Ошибка при получении игр: ", error);
  }
}

searchInput.addEventListener("input", function () {
  const searchRes = searchInput.value.trim();
  if (searchRes) {
    searchGamesByName(searchRes);
  } else {
    searchResults.innerHTML = "";
  }
});

document.addEventListener("click", function (event) {
  const isClickInside =
    searchResults.contains(event.target) || searchInput.contains(event.target);
  if (!isClickInside) {
    searchResults.innerHTML = "";
    searchResults.style.display = "none";
  }
});
