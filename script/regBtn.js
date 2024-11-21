document.addEventListener("DOMContentLoaded", function () {
  const regBtn = document.getElementById("openRegForm");
  const registrationForm = document.getElementById("regForm");
  const loginForm = document.getElementById("authForm");

  regBtn.addEventListener("click", function () {
    registrationForm.style.display = "block";
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  });

  const closeBtns = document.querySelectorAll(".close");
  closeBtns.forEach(function (closeBtn) {
    closeBtn.addEventListener("click", function () {
      registrationForm.style.display = "none";
      loginForm.style.display = "none";
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    });
  });

  const cancelBtns = document.querySelectorAll(".cancel");
  cancelBtns.forEach(function (cancelBtn) {
    cancelBtn.addEventListener("click", function () {
      registrationForm.style.display = "none";
      loginForm.style.display = "none";
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    });
  });

  const switchBtns = document.querySelectorAll(".switchBtn");
  switchBtns.forEach(function (switchBtn) {
    switchBtn.addEventListener("click", function () {
      if (registrationForm.style.display === "block") {
        registrationForm.style.display = "none";
        loginForm.style.display = "block";
      } else {
        loginForm.style.display = "none";
        registrationForm.style.display = "block";
      }
    });
  });
});
