import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
  getFirestore,
  setDoc,
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

function showMessage(message, divId) {
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(function () {
    messageDiv.style.display = "none";
  }, 3000);
}

const signUp = document.getElementById("acceptSignUp");
signUp.addEventListener("click", (event) => {
  event.preventDefault();
  const nickname = document.getElementById("nickname").value;
  const email = document.getElementById("Email").value;
  const password = document.getElementById("Pass").value;
  const auth = getAuth();
  const db = getFirestore();

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const userData = {
        email: email,
        nickname: nickname,
      };
      showMessage("Аккаунт успешно создан!", "signUpMessage");
      const docRef = doc(db, "users", user.uid);
      setDoc(docRef, userData)
        .then(() => {
          console.log("User successfully Registered.");
        })
        .catch((error) => {
          console.error("error writing document", error);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode == "auth/email-already-in-use") {
        showMessage("Email уже используется", "signUpMessage");
      } else {
        showMessage("Невозможно создать пользователя", "signUpMessage");
      }
    });
});

const signIn = document.getElementById("acceptSignIn");
signIn.addEventListener("click", (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("pass").value;
  const auth = getAuth();

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      signInMessage.style.backgroundColor = "green";
      showMessage("Вы вошли в аккаунт", "signInMessage");
      const user = userCredential.user;
      localStorage.setItem("loggedInUserId", user.uid);
      window.location.reload();
    })
    .catch((error) => {
      const errorCode = error.code;
      signInMessage.style.backgroundColor = "red";
      if (errorCode === "auth/invailed-credential") {
        showMessage("Неправильный Email или пароль", "signInMessage");
      } else {
        showMessage("Не удалось войти в аккаунт", "signInMessage");
      }
    });
});

document.addEventListener("DOMContentLoaded", function () {
  const loggedInUserId = localStorage.getItem("loggedInUserId");
  const regBtn = document.getElementById("openRegForm");
  const showKab = document.getElementById("showKab");

  if (loggedInUserId) {
    regBtn.style.display = "none";
    showKab.style.display = "block";
  } else {
    regBtn.style.display = "block";
    showKab.style.display = "none";
  }
});
