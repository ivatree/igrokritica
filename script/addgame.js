import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  Timestamp,
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
const newsCollection = collection(db, "news");

const criticReviewsMap = new Map();

document
  .getElementById("addCriticReview")
  .addEventListener("click", (event) => {
    event.preventDefault();

    const criticName = document.getElementById("criticReviewName").value;
    const criticScore = parseFloat(
      document.getElementById("criticReviewScore").value
    );
    const criticLink = document.getElementById("criticReviewLink").value;
    const criticDescription = document.getElementById(
      "criticReviewDescription"
    ).value;

    if (criticName || criticDescription) {
      const criticReview = {
        title: criticName,
        score: isNaN(criticScore) ? null : criticScore,
        link: criticLink,
        description: criticDescription,
      };

      const criticId = criticReviewsMap.size + 1;
      criticReviewsMap.set(criticId, criticReview);
      document.getElementById("criticReviewName").value = "";
      document.getElementById("criticReviewScore").value = "";
      document.getElementById("criticReviewLink").value = "";
      document.getElementById("criticReviewDescription").value = "";

      alert("Критик добавлен!");
    } else {
      alert("Пожалуйста, введите название критика или отзыв.");
    }
  });

document
  .getElementById("acceptAdding")
  .addEventListener("click", async (event) => {
    event.preventDefault();
    const name = document.getElementById("gameNames").value;

    const dateInput = document.getElementById("gameDate").value;
    let gameDate = null;
    if (dateInput) {
      const dateObj = new Date(dateInput);
      gameDate = Timestamp.fromDate(dateObj);
    }

    const developer = document.getElementById("gameDeveloper").value;
    const publisher = document.getElementById("gamePublisher").value;
    const cost = document.getElementById("gameCost").value;
    const genre = document.getElementById("gameGenre").value;
    const imageLink = document.getElementById("gameImageLink").value;
    const trailerLink = document.getElementById("gameTrailerLink").value;
    const esrbLink = document.getElementById("linkEsrb").value;
    const devLinks = document.getElementById("devLinks").value;
    const desc = document.getElementById("gameDescription").value;
    const userScore = Math.min(
      10,
      parseFloat(document.getElementById("gameUserScore").value)
    );
    const criticScore = Math.min(
      100,
      parseFloat(document.getElementById("gameCriticScore").value)
    );
    const criticsArray = Array.from(criticReviewsMap.values());

    const platforms = {};
    const platformCheckboxes = document.querySelectorAll(
      "input[type='checkbox']"
    );

    platformCheckboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        const label = document.querySelector(`label[for='${checkbox.id}']`);
        const title = label ? label.textContent : checkbox.id;

        const scoreInput = document.getElementById(`${checkbox.id}s`);
        const scoreValue = scoreInput ? scoreInput.value : null;

        const score =
          scoreValue !== null && scoreValue.trim() !== ""
            ? Math.min(100, parseFloat(scoreValue))
            : null;

        platforms[title] = {
          title: title,
          score: isNaN(score) ? null : score,
        };
      }
    });

    try {
      const querySnapshot = await getDocs(gamesCollection);
      let maxId = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.ID && data.ID > maxId) {
          maxId = data.ID;
        }
      });
      const newId = maxId + 1;

      await addDoc(gamesCollection, {
        ID: newId,
        name: name,
        date: gameDate,
        publisher: publisher,
        cost: cost,
        genre: genre,
        imageURL: imageLink,
        trailer: trailerLink,
        esrb: esrbLink,
        dev: developer,
        links: devLinks,
        usersRaiting: userScore,
        criticsRaiting: criticScore,
        platforms,
        description: desc,
        criticsReview: criticsArray,
      });

      openAddGameMes();
      criticReviewsMap.clear();
      document.getElementById("addBody").reset();
    } catch (error) {
      console.log("Ошибка при добавлении документа:", error);
    }
  });

function openAddGameMes() {
  const addMes = document.getElementById("addGameMes");
  addMes.style.display = "block";
  closeAddGameMes(addMes);
}

function closeAddGameMes(addMes) {
  const closeBtn = document.getElementById("acceptGameMesBtn");
  closeBtn.addEventListener("click", function (event) {
    event.preventDefault();
    addMes.style.display = "none";
  });
}

document
  .getElementById("acceptNewsAdding")
  .addEventListener("click", async (event) => {
    event.preventDefault();
    const newsTitle = document.getElementById("newsTitle").value;
    const newsLink = document.getElementById("newsLink").value;
    const newsPicture = document.getElementById("newsPicture").value;
    const newsDescription = document.getElementById("newsDescription").value;

    try {
      await addDoc(newsCollection, {
        imageURL: newsPicture,
        title: newsTitle,
        links: newsLink,
        description: newsDescription,
      });
      openAddNewsMes();
      document.getElementById("addBody").reset();
    } catch (error) {
      console.log("Ошибка при добавлении документа:", error);
    }
  });

function openAddNewsMes() {
  const addNewsMes = document.getElementById("addNewsMes");
  addNewsMes.style.display = "block";
  closeAddNewsMes(addMess);
}

function closeAddNewsMes(addNewsMes) {
  const closeNewsBtn = document.getElementById("acceptNewsMesBtn");
  closeNewsBtn.addEventListener("click", function (event) {
    event.preventDefault();
    addNewsMes.style.display = "none";
  });
}
