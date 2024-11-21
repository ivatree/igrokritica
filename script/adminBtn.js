document.addEventListener("DOMContentLoaded", function () {
  const addBtn = document.getElementById("addNewGame");
  const addGameForm = document.getElementById("addGameForm");
  const addNewsBtn = document.getElementById("addNewNews");
  const addnewsForm = document.getElementById("addNewsForm");
  const closeAdd = document.getElementById("closeAdd");
  const closeNewsAdd = document.getElementById("closeNewsAdd");

  addBtn.addEventListener("click", function () {
    addGameForm.style.display = "block";
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  });

  addNewsBtn.addEventListener("click", function () {
    addnewsForm.style.display = "block";
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  });

  closeAdd.addEventListener("click", function () {
    addGameForm.style.display = "none";
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
  });
  closeNewsAdd.addEventListener("click", function () {
    addnewsForm.style.display = "none";
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
  });
});
