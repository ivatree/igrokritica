document.addEventListener("DOMContentLoaded", function () {
  const menuButton = document.querySelector(".menu");
  const openMenu = document.querySelector(".openMenu");
  const kabBtn = document.getElementById("showKab");
  const closeKab = document.getElementById("closeKab");
  const kab = document.getElementById("kabinet");
  const overlay = document.getElementById("kabOverlay");

  function openKabinet() {
    if (kab.classList.contains("showkab")) {
      kab.style.display = "none";
      overlay.style.display = "none";
      kab.classList.remove("showkab");
    } else {
      overlay.style.display = "block";
      kab.style.display = "block";
      setTimeout(() => kab.classList.add("showkab"), 10);
    }
  }

  closeKab.addEventListener("click", function () {
    overlay.style.display = "none";
    kab.style.display = "none";
    kab.classList.remove("showkab");
  });

  kabBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    openKabinet();
  });

  overlay.addEventListener("click", function () {
    overlay.style.display = "none";
    kab.style.display = "none";
    kab.classList.remove("showkab");
  });

  function toggleMenu() {
    if (openMenu.classList.contains("show")) {
      openMenu.classList.remove("show");
      openMenu.style.display = "none";
    } else {
      openMenu.style.display = "block";
      setTimeout(() => openMenu.classList.add("show"), 10);
    }
  }

  menuButton.addEventListener("click", function (event) {
    event.stopPropagation();
    toggleMenu();
  });

  document.addEventListener("click", function (event) {
    if (!openMenu.contains(event.target) && event.target !== menuButton) {
      openMenu.classList.remove("show");
      openMenu.style.display = "none";
    }
    if (!kab.contains(event.target) && event.target !== kabBtn) {
      kab.classList.remove("showkab");
      kab.style.display = "none";
    }
  });
});
