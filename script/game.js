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

const urlParams = new URLSearchParams(window.location.search);
const gameID = urlParams.get("ID");

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const gameName = urlParams.get("name");
  if (gameName) {
    document.title = gameName;
  }
});

async function getGameById(ID) {
  const gamesCollection = collection(db, "games");
  const gameQuery = query(gamesCollection, where("ID", "==", Number(ID)));

  try {
    const querySnapshot = await getDocs(gameQuery);

    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const name = data.name;
        const imageURL = data.imageURL;
        const criticsRaiting = data.criticsRaiting;
        const usersRaiting = data.usersRaiting;
        const timestamp = doc.data().date;
        const date = timestamp.toDate();
        const formattedDate = date.toISOString().split("T")[0];
        const links = data.links;
        const trailer = data.trailer;
        const cost = data.cost;
        const info = data.description;
        const ageRait = data.esrb;
        const dev = data.dev;
        const publisher = data.publisher;
        const platforms = data.platforms;
        const criticsReview = data.criticsReview;
        const genre = data.genre;

        if (criticsReview) {
          const reviewCardTable = document.getElementById("reviewContainer");
          Object.keys(criticsReview).forEach((criticReview) => {
            const criticReviewObject = criticsReview[criticReview];
            if (
              criticReviewObject &&
              criticReviewObject.title &&
              criticReviewObject.description &&
              criticReviewObject.score &&
              criticReviewObject.link
            ) {
              const title = criticReviewObject.title;
              const description = criticReviewObject.description;
              const score = criticReviewObject.score;
              const link = criticReviewObject.link;

              const ReviewCard = document.createElement("div");
              ReviewCard.classList.add("reviewCard");

              const reviewCardName = document.createElement("div");
              reviewCardName.classList.add("reviewCardName");

              const reviewScore = document.createElement("span");
              reviewScore.id = "score";
              reviewScore.textContent = score;

              const criticsReviewName = document.createElement("a");
              criticsReviewName.id = "criticName";
              criticsReviewName.textContent = title;
              criticsReviewName.href = link;

              const desc = document.createElement("span");
              desc.id = "description";
              desc.textContent = description;

              const btn = document.createElement("button");
              btn.className = "readBtn";
              btn.textContent = "читать";
              btn.addEventListener("click", function () {
                readMore(title, score, description);
              });

              reviewCardName.appendChild(reviewScore);
              reviewCardName.appendChild(criticsReviewName);
              ReviewCard.appendChild(desc);
              ReviewCard.appendChild(reviewCardName);
              ReviewCard.appendChild(btn);
              reviewCardTable.appendChild(ReviewCard);
            }
          });
        }

        function readMore(title, score, description) {
          const readMore = document.getElementById("showReview");
          const readTitle = document.getElementById("reviewName");
          const readScore = document.getElementById("revirewScore");
          const readDesc = document.getElementById("reviewDescription");

          let color = "";
          if (score >= 0 && score < 40) {
            color = "#ff6874";
          } else if (score >= 40 && score < 75) {
            color = "#ffbd3f";
          } else if (score >= 75 && score <= 100) {
            color = "#00ce7a";
          }

          readTitle.textContent = title;
          readDesc.textContent = description;
          readScore.style.backgroundColor = color;
          readScore.textContent = score;
          readMore.style.display = "grid";
          closeMore(readMore);
        }

        function closeMore() {
          document
            .getElementById("closeReview")
            .addEventListener("click", function () {
              showReview.style.display = "none";
            });
        }
        document.addEventListener("click", function (event) {
          if (event.target !== showReview) {
            closeMore();
          }
        });

        if (platforms) {
          const scoreCardTable = document.getElementById("scoreCardTable");
          const span = document.getElementById("detailsPlatformList");
          let titlesString = "";
          let mainPlatformTitle = "";
          Object.keys(platforms).forEach((platform) => {
            const platformObject = platforms[platform];
            if (
              platformObject &&
              platformObject.score !== undefined &&
              platformObject.title
            ) {
              const title = platformObject.title;
              let score = platformObject.score;

              if (
                score === 0 ||
                score === null ||
                score === undefined ||
                score === ""
              ) {
                score = "ИК";
              }
              console.log(score);
              console.log(typeof score);
              console.log(platform);

              titlesString += title + ", ";
              mainPlatformTitle = title;

              const scoreCard = document.createElement("div");
              scoreCard.classList.add("scoreCard");

              const platformName = document.createElement("span");
              platformName.className = "platformName";
              platformName.textContent = title;

              const platformScore = document.createElement("span");
              platformScore.className = "platformScore";
              platformScore.textContent = score;

              scoreCard.appendChild(platformName);
              scoreCard.appendChild(platformScore);
              scoreCardTable.appendChild(scoreCard);
            }
          });
          titlesString = titlesString.slice(0, -2);
          span.textContent = titlesString;
          const mainPlatform = document.getElementById("platform");
          mainPlatform.textContent = mainPlatformTitle;
        }

        const detailsDescription =
          document.getElementById("detailsDescription");

        function checkHeight(element) {
          const height = element.clientHeight;
          return height > 80;
        }

        const hideBtn = document.getElementById("hideInfo");
        const showBtn = document.getElementById("showInfo");

        showBtn.addEventListener("click", function () {
          detailsDescription.style.height = "auto";
          hideBtn.style.display = "inline";
          detailsDescription.style.display = "-webkit-box";
          detailsDescription.style.webkitBoxOrient = "horizontal";
          showBtn.style.display = "none";
          detailsDescription.style.transition = "all 0.5s";
        });
        hideBtn.addEventListener("click", function () {
          detailsDescription.style.height = "80px";
          showBtn.style.display = "inline";
          hideBtn.style.display = "none";
          detailsDescription.style.webkitBoxOrient = "vertical";

          detailsDescription.style.transition = "all 0.5s";
        });

        if (checkHeight(detailsDescription)) {
          hideBtn.style.display = "inline";
        } else {
          showBtn.style.display = "inline";
        }

        let criticColor = "";
        let criticText = "";
        if (criticsRaiting >= 0 && criticsRaiting < 40) {
          criticColor = "#ff6874";
          criticText = "отрицательные";
        } else if (criticsRaiting >= 40 && criticsRaiting < 75) {
          criticColor = "#ffbd3f";
          criticText = "положительные";
        } else if (criticsRaiting >= 75 && criticsRaiting <= 100) {
          criticColor = "#00ce7a";
          criticText = "крайне положительные";
        }

        let userColor = "";
        let userText = "";
        if (usersRaiting >= 0 && usersRaiting < 4) {
          userColor = "#ff6874";
          userText = "отрицательные";
        } else if (usersRaiting >= 4 && usersRaiting < 7.5) {
          userColor = "#ffbd3f";
          userText = "положительные";
        } else if (usersRaiting >= 7.5 && usersRaiting <= 10) {
          userColor = "#00ce7a";
          userText = "крайне положительные";
        }

        const buyBtn = document.getElementById("buyBtn");
        buyBtn.addEventListener("click", function () {
          window.open(links, "_blank");
        });

        document
          .getElementById("addUserReview")
          .addEventListener("click", function () {
            alert("Извините, не успел ;с");
          });

        const estimations = document.querySelectorAll(".estimation");
        const originalColors = Array.from(estimations).map(
          (estimation) => estimation.classList[1]
        );

        estimations.forEach((estimation, index) => {
          const buttons = estimation.querySelectorAll(".estBtn");

          buttons.forEach((button) => {
            button.addEventListener("click", (event) => {
              event.stopPropagation();

              const currentColor = estimation.classList[1];
              let leftColor = "";

              for (let i = 0; i <= index; i++) {
                if (estimations[i].classList.contains("red")) {
                  leftColor = "red";
                } else if (estimations[i].classList.contains("orange")) {
                  leftColor = "orange";
                } else {
                  leftColor = "green";
                }
              }
              const personScoreVisible =
                document.getElementById("personScoreVisible");
              personScoreVisible.textContent = index + 1;
              if (currentColor === "red") {
                personScoreVisible.style.backgroundColor = "#ff6874";
              } else if (currentColor === "orange") {
                personScoreVisible.style.backgroundColor = "#ffbd3f";
              } else {
                personScoreVisible.style.backgroundColor = "#00ce7a";
              }
              const reviewTable = document.getElementById("reviewPersonWindow");
              const userScoreChecked =
                document.getElementById("personScoreDisplay");
              document.getElementById("personGameName").textContent = name;
              document.getElementById("peronGameImage").src = imageURL;
              document.getElementById("reviewGameName").textContent = name;
              reviewTable.style.display = "block";
              userScoreChecked.textContent = `  ${index + 1}`;
              if (currentColor === "red") {
                userScoreChecked.style.backgroundColor = "#ff6874";
              } else if (currentColor === "orange") {
                userScoreChecked.style.backgroundColor = "#ffbd3f";
              } else {
                userScoreChecked.style.backgroundColor = "#00ce7a";
              }
              estimation.classList.add("active");
              document
                .getElementById("closeUserReview")
                .addEventListener("click", function () {
                  reviewTable.style.display = "none";
                  document.body.style.overflow = "auto";
                  document.documentElement.style.overflow = "auto";
                });
            });
          });

          estimation.addEventListener("mouseover", () => {
            const currentColor = estimation.classList[1];
            let leftColor = "";

            for (let i = 0; i <= index; i++) {
              if (estimations[i].classList.contains("red")) {
                leftColor = "red";
              } else if (estimations[i].classList.contains("orange")) {
                leftColor = "orange";
              } else {
                leftColor = "green";
              }
            }

            if (currentColor === "red") {
              for (let i = 0; i <= index; i++) {
                estimations[i].classList.add(leftColor);
                estimations[i].style.backgroundColor = "#ff6874";
                estimations[i].style.opacity = "1";
              }
            } else if (currentColor === "orange") {
              for (let i = 0; i <= index; i++) {
                estimations[i].classList.add(leftColor);
                estimations[i].style.backgroundColor = "#ffbd3f";
                estimations[i].style.opacity = "1";
              }
            } else {
              for (let i = 0; i <= index; i++) {
                estimations[i].classList.add(leftColor);
                estimations[i].style.backgroundColor = "#00ce7a";
                estimations[i].style.opacity = "1";
              }
            }

            const personScoreVisible =
              document.getElementById("personScoreVisible");
            personScoreVisible.textContent = index + 1;

            if (currentColor === "red") {
              personScoreVisible.style.backgroundColor = "#ff6874";
            } else if (currentColor === "orange") {
              personScoreVisible.style.backgroundColor = "#ffbd3f";
            } else {
              personScoreVisible.style.backgroundColor = "#00ce7a";
            }
          });

          estimation.addEventListener("mouseout", () => {
            if (!estimation.classList.contains("active")) {
              estimations.forEach((estimation, i) => {
                estimation.classList.remove("red", "orange", "green");
                estimation.classList.add(originalColors[i]);
                estimation.style.opacity = "0.2";
                if (originalColors[i] === "red") {
                  estimation.style.backgroundColor = "#ff6874";
                } else if (originalColors[i] === "orange") {
                  estimation.style.backgroundColor = "#ffbd3f";
                } else {
                  estimation.style.backgroundColor = "#00ce7a";
                }
                const personScoreVisible =
                  document.getElementById("personScoreVisible");
                personScoreVisible.textContent = null;
                personScoreVisible.style.backgroundColor = "transparent";
              });
            }
          });
        });

        const gameInfo = document.getElementById("gameInfo");
        const gameMainInfo = document.getElementById("gameMainInfo");
        const reviewBox = document.getElementById("reviewBox");
        if (
          criticsRaiting == null ||
          isNaN(criticsRaiting) ||
          criticsRaiting === 0
        ) {
          document.getElementById("trailer").src = trailer;
          document.getElementById("GameName").textContent = name;
          document.getElementById("dateReleased").textContent = formattedDate;
          document.getElementById("detailsDate").textContent = formattedDate;

          document.getElementById("mainScoreInfo").style.display = "none";
          document.getElementById("personScoreCont").style.display = "none";
          document.getElementById("cost").style.display = "none";
          document.getElementById("buyBtn").textContent =
            "перейти на сайт игры";
          document.getElementById("ageImage").src = ageRait;
          document.getElementById("devList").textContent = dev;
          document.getElementById("publisherList").textContent = publisher;
          document.getElementById("genresList").textContent = genre;
          document.getElementById("detailsDescription").textContent = info;
          gameInfo.style.height = "430px";
          gameInfo.style.gridTemplateRows = "75% 25%";
          gameMainInfo.style.height = "155px";
          reviewBox.style.display = "none";
        } else {
          document.getElementById("buyBtn").textContent =
            "Купить " + cost + "$";
          document.getElementById("detailsDescription").textContent = info;
          document.getElementById("trailer").src = trailer;
          document.getElementById("GameName").textContent = name;
          document.getElementById("dateReleased").textContent = formattedDate;
          document.getElementById("detailsDate").textContent = formattedDate;
          document.getElementById("criticScore").textContent = criticsRaiting;
          document.getElementById("criticScore").style.backgroundColor =
            criticColor;
          document.getElementById("colorCriticLine").style.backgroundColor =
            criticColor;
          document.getElementById("criticText").innerHTML = criticText;

          document.getElementById("userScore").textContent = usersRaiting;
          document.getElementById("userScore").style.backgroundColor =
            userColor;
          document.getElementById("colorPersonLine").style.backgroundColor =
            userColor;
          document.getElementById("userText").innerHTML = userText;
          document.getElementById("ageImage").src = ageRait;
          document.getElementById("devList").textContent = dev;
          document.getElementById("publisherList").textContent = publisher;
          document.getElementById("genresList").textContent = genre;
        }
      });
    } else {
      console.log("Игра с таким названием не найдена.");
    }
  } catch (error) {
    console.error("Ошибка при получении игры:", error);
  }
}
getGameById(gameID);
