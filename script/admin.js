import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
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
let parentID;

function hideAllCards() {
  const gameCards = document.querySelectorAll(".gameCard");
  gameCards.forEach((card) => {
    card.style.display = "none";
  });
}
// для игр -->
document.getElementById("changeGames").addEventListener("click", function () {
  hideAllCards();
  getDocs(gamesCollection).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const gameID = doc.id;
      parentID = gameID;
      const timestamp = doc.data().date;
      const date = timestamp.toDate();
      const formattedDate = date.toISOString().split("T")[0];
      const { name, imageURL, criticsRaiting, description } = data;

      const gameCard = document.createElement("a");
      gameCard.classList.add("gameCard");
      gameCard.title = name;

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

      const scoreElement = document.createElement("span");
      scoreElement.id = "score";
      scoreElement.textContent = criticsRaiting;
      scoreElement.style.backgroundColor = color;

      const scoreText = document.createElement("span");
      scoreText.id = "scoreText";
      scoreText.textContent = text;

      const btnCon = document.createElement("div");
      btnCon.classList.add("btnCon");

      const setBtn = document.createElement("button");
      setBtn.id = "setBtn";
      setBtn.title = "Изменить";
      setBtn.addEventListener("click", function () {
        openEditWindow(gameID);
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.id = "deleteBtn";
      deleteBtn.title = "Удалить";
      deleteBtn.addEventListener("click", async function () {
        await deleteGame(gameID);
      });

      gameCard.appendChild(image);
      gameCard.appendChild(nameElement);
      gameCard.appendChild(dateElement);
      gameCard.appendChild(descriptionElement);
      gameCard.appendChild(scoreCont);
      gameCard.appendChild(btnCon);
      btnCon.appendChild(setBtn);
      btnCon.appendChild(deleteBtn);
      gridTable.appendChild(gameCard);
      scoreCont.appendChild(scoreElement);
      scoreCont.appendChild(scoreText);
    });
  });
});

async function openEditWindow(ID) {
  console.log("Открытие окна редактирования для игры с ID:", ID);
  const gameRef = doc(db, "games", ID);
  try {
    const docSnap = await getDoc(gameRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("Данные игры найдены:", ID);
      parentID = ID;
      const timestamp = data.date;
      const date = timestamp.toDate();
      const formattedDate = date.toISOString().split("T")[0];
      const {
        imageURL,
        name,
        links,
        trailer,
        cost,
        dev,
        publisher,
        genre,
        description,
        platforms,
      } = data;

      document.getElementById("setGamePreview").value = imageURL;
      document.getElementById("gameSetName").value = name;
      document.getElementById("gameSetLink").value = links || "";
      document.getElementById("gameSetTrailer").value = trailer || "";
      document.getElementById("gameSetDate").value = formattedDate;
      document.getElementById("setGameCost").value = cost || "";
      document.getElementById("setGameDev").value = dev || "";
      document.getElementById("setGamePublisher").value = publisher || "";
      document.getElementById("setGameGenre").value = genre || "";
      document.getElementById("gameSetDesc").value = description || "";

      if (platforms) {
        const titlePlatforms = document.querySelectorAll(".titlePlatform");
        Object.keys(data.platforms).forEach((platform) => {
          const platformObject = data.platforms[platform];
          if (platformObject && platformObject.title) {
            const title = platformObject.title;
            titlePlatforms.forEach((label) => {
              if (label.textContent.trim() === title) {
                const checkbox = document.getElementById(
                  label.getAttribute("for")
                );
                if (checkbox) {
                  checkbox.checked = true;
                }
              }
            });
          }
        });
      }
      document.getElementById("setTable").style.display = "block";
    } else {
      console.log("Игра не найдена");
    }
  } catch (error) {
    console.error("Ошибка при получении игры:", error);
  }
}

async function updateGameData() {
  if (!parentID) {
    console.error("parentID не установлен");
    return;
  }
  const gameRef = doc(db, "games", parentID);
  const updatedData = {
    name: document.getElementById("gameSetName").value,
    imageURL: document.getElementById("setGamePreview").value,
    date: new Date(document.getElementById("gameSetDate").value),
    description: document.getElementById("gameSetDesc").value,
    link: document.getElementById("gameSetLink").value,
    trailer: document.getElementById("gameSetTrailer").value,
    cost: parseFloat(document.getElementById("setGameCost").value),
    genre: document.getElementById("setGameGenre").value,
    dev: document.getElementById("setGameDev").value,
    publisher: document.getElementById("setGamePublisher").value,
  };
  try {
    await updateDoc(gameRef, updatedData);
    console.log("Данные успешно обновлены!", parentID);
    openSetGameMes();
  } catch (error) {
    console.error("Ошибка при обновлении данных:", error);
  }
}

document
  .getElementById("saveChanges")
  .addEventListener("click", function (event) {
    event.preventDefault();
    console.log("Документ обновлен, ID::", parentID);
    updateGameData();
  });

document.getElementById("closeSet").addEventListener("click", function () {
  setTable.style.display = "none";
});

async function deleteGame(gameID) {
  const gameDoc = doc(db, "games", gameID);
  try {
    await deleteDoc(gameDoc);
    location.reload();
  } catch (error) {
    console.error("Ошибка при удалении игры:", error);
  }
}

function openSetGameMes() {
  const setGameMes = document.getElementById("setGameMes");
  setGameMes.style.display = "block";
  closeSetGameMes(setGameMes);
}

function closeSetGameMes(setGameMes) {
  const closeMes = document.getElementById("setGameMesBtn");
  closeMes.addEventListener("click", function (event) {
    event.preventDefault();
    setGameMes.style.display = "none";
  });
}

// для новостей -->
const newsCollection = collection(db, "news");
document.getElementById("changeNews").addEventListener("click", function () {
  hideAllCards();
  getDocs(newsCollection)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const newsID = doc.id;
        parentID = newsID;
        const { description, imageURL, title } = data;

        const newsCard = document.createElement("a");
        newsCard.classList.add("gameCard");

        const image = document.createElement("img");
        image.src = imageURL;
        image.style.width = "180px";
        image.style.marginBottom = "25px";

        const nameElement = document.createElement("span");
        nameElement.id = "name";
        nameElement.textContent = title;
        nameElement.style.marginLeft = "100px";

        const info = document.createElement("span");
        info.id = "description";
        info.textContent = description;
        info.style.marginLeft = "100px";
        info.style.width = "700px";
        info.style.height = "max-content";

        const btnCon = document.createElement("div");
        btnCon.classList.add("btnCon");

        const setBtn = document.createElement("button");
        setBtn.id = "setBtn";
        setBtn.title = "Изменить";
        setBtn.addEventListener("click", function () {
          openEditNewsWindow(newsID);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.id = "deleteBtn";
        deleteBtn.title = "Удалить";
        deleteBtn.addEventListener("click", async function () {
          await deleteNews(newsID);
        });

        btnCon.appendChild(setBtn);
        btnCon.appendChild(deleteBtn);
        newsCard.appendChild(btnCon);
        newsCard.appendChild(image);
        newsCard.appendChild(nameElement);
        newsCard.appendChild(info);
        gridTable.appendChild(newsCard);
      });
    })
    .catch((error) => {
      console.error("Ошибка при загрузке новостей:", error);
    });
});

async function openEditNewsWindow(ID) {
  console.log("Открытие окна редактирования для новости с ID:", ID);
  const gameRef = doc(db, "news", ID);
  try {
    const docSnap = await getDoc(gameRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("Данные игры найдены:", ID);
      parentID = ID;
      const { imageURL, title, links, description } = data;

      document.getElementById("setNewsName").value = title;
      document.getElementById("setNewsImg").value = imageURL;
      document.getElementById("setNewsLink").value = links;
      document.getElementById("setNewsDesc").value = description;

      document.getElementById("setNewsTable").style.display = "block";
    } else {
      console.log("Новость не найдена");
    }
  } catch (error) {
    console.error("Ошибка при получении статьи:", error);
  }
}

async function updateNewsData() {
  if (!parentID) {
    console.error("parentID не установлен");
    return;
  }
  const newsRef = doc(db, "news", parentID);
  const updatedData = {
    title: document.getElementById("setNewsName").value,
    imageURL: document.getElementById("setNewsImg").value,
    links: document.getElementById("setNewsLink").value,
    description: document.getElementById("setNewsDesc").value,
  };
  try {
    await updateDoc(newsRef, updatedData);
    console.log("Данные успешно обновлены!", parentID);
    openSetNewsMes();
  } catch (error) {
    console.error("Ошибка при обновлении данных:", error);
  }
}

function openSetNewsMes() {
  const setNewsMes = document.getElementById("setNewsMes");
  setNewsMes.style.display = "block";
  closeSetNewsMes(setNewsMes);
}

function closeSetNewsMes(setNewsMes) {
  const closeMes = document.getElementById("setNewsMesBtn");
  closeMes.addEventListener("click", function (event) {
    event.preventDefault();
    setNewsMes.style.display = "none";
  });
}

document
  .getElementById("saveEditNews")
  .addEventListener("click", function (event) {
    event.preventDefault();
    console.log("Документ обновлен, ID:", parentID);
    updateNewsData();
  });

document.getElementById("closeNewsSet").addEventListener("click", function () {
  setNewsTable.style.display = "none";
});

async function deleteNews(newsID) {
  const newsDoc = doc(db, "news", newsID);
  try {
    await deleteDoc(newsDoc);
    location.reload();
  } catch (error) {
    console.error("Ошибка при удалении новости:", error);
  }
}
