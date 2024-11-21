import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
  getFirestore,
  getDoc,
  doc,
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

const auth = getAuth();
const db = getFirestore();

onAuthStateChanged(auth, (user) => {
  const loggedInUserId = localStorage.getItem("loggedInUserId");
  if (loggedInUserId) {
    console.log("ID пользователя найден в Local Storage.");
    checkUserRole(user);

    const docRef = doc(db, "users", loggedInUserId);
    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          localStorage.setItem("nickname", userData.nickname);
          localStorage.setItem("email", userData.email);
          document.getElementById("userName").innerText = userData.nickname;
          document.getElementById("userEmail").innerText = userData.email;
        } else {
          console.log("Документ с данным ID не найден.");
        }
      })
      .catch((error) => {
        console.log("Ошибка получения документа", error);
      });
  } else {
    console.log("ID пользователя не найден в Local Storage.");
  }
});

function checkUserRole(user) {
  if (user) {
    const db = getFirestore();
    const userRef = doc(db, "users", user.uid);

    getDoc(userRef)
      .then((doc) => {
        if (doc.exists()) {
          const userData = doc.data();

          if (userData.role === "admin") {
            const btn = document.createElement("button");
            btn.textContent = "админ";
            btn.id = "adminButton";

            btn.addEventListener("click", function () {
              window.open("admin.html", "_self");
            });
            const RegContainer = document.getElementById("regCon");
            RegContainer.appendChild(btn);
          } else {
          }
        } else {
          console.log("Данные пользователя не найдены.");
        }
      })
      .catch((error) => {
        console.error("Ошибка при получении данных пользователя:", error);
      });
  }
}

const logOutBtn = document.getElementById("logOut");
logOutBtn.addEventListener("click", () => {
  localStorage.removeItem("loggedInUserId");
  signOut(auth)
    .then(() => {
      window.location.reload();
      console.log("Пользователь успешно вышел из учетной записи.");
    })
    .catch((error) => {
      console.log("Ошибка выхода:", error);
    });
});
