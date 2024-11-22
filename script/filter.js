const sortPlatfroms = document.getElementById("sortPlatfroms");
const showPlatforms = document.getElementById("showPlatforms");
const hidePlatfroms = document.getElementById("hidePlatforms");

showPlatforms.addEventListener("click", function () {
  sortPlatfroms.style.height = "auto";
  sortPlatfroms.style.maxHeight = sortPlatfroms.scrollHeight + "px";
  showPlatforms.style.display = "none";
  hidePlatfroms.style.display = "block";
});
hidePlatfroms.addEventListener("click", function () {
  sortPlatfroms.style.height = 120;
  sortPlatfroms.style.maxHeight = "120px";
  hidePlatfroms.style.display = "none";
  showPlatforms.style.display = "block";
});

const sortGenres = document.getElementById("sortGenres");
const showGenre = document.getElementById("showGenre");
const hideGenre = document.getElementById("hideGenre");

showGenre.addEventListener("click", function () {
  sortGenres.style.height = "auto";
  sortGenres.style.maxHeight = sortGenres.scrollHeight + "px";
  showGenre.style.display = "none";
  hideGenre.style.display = "block";
});
hideGenre.addEventListener("click", function () {
  sortGenres.style.height = 120;
  sortGenres.style.maxHeight = "120px";
  hideGenre.style.display = "none";
  showGenre.style.display = "block";
});

const sidebar = document.getElementById("sidebar");
const toggleButton = document.getElementById("openSort");
const overlay = document.getElementById("overlay");
const closeSideBar = document.getElementById("closeSideBar");

toggleButton.addEventListener("click", () => {
  sidebar.style.display = "block";
  overlay.style.display = "block";
});

closeSideBar.addEventListener("click", () => {
  sidebar.style.display = "none";
  overlay.style.display = "none";
});
