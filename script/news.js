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
const newsCollection = collection(db, "news");

getDocs(newsCollection)
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const { title, description, imageURL, links } = data;

      const card = document.createElement("a");
      card.classList.add("newsCard");
      card.id = "newsCard";
      card.href = links;

      const image = document.createElement("img");
      image.id = "preview";
      image.src = imageURL;

      const newsText = document.createElement("div");
      newsText.classList.add("newsText");

      const newsName = document.createElement("span");
      newsName.id = "newsName";
      newsName.textContent = title;

      const newsDescription = document.createElement("span");
      newsDescription.id = "newsDescription";
      newsDescription.textContent = description;

      newsText.appendChild(newsName);
      newsText.appendChild(newsDescription);
      card.appendChild(image);
      card.appendChild(newsText);
      newsContainer.appendChild(card);
    });
  })
  .catch((error) => {
    console.error("Ошибка при получении документов: ", error);
  });
