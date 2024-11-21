document.getElementById("left").addEventListener("click", () => {
  const container = document.getElementById("container");
  container.scrollBy({
    left: -360,
    behavior: "smooth",
  });
});
document.getElementById("right").addEventListener("click", () => {
  const container = document.getElementById("container");
  container.scrollBy({
    left: 360,
    behavior: "smooth",
  });
});
document.getElementById("Left").addEventListener("click", () => {
  const container = document.getElementById("Container");
  container.scrollBy({
    left: -360,
    behavior: "smooth",
  });
});
document.getElementById("Right").addEventListener("click", () => {
  const container = document.getElementById("Container");
  container.scrollBy({
    left: 360,
    behavior: "smooth",
  });
});
document.getElementById("LeftP").addEventListener("click", () => {
  const container = document.getElementById("ContainerP");
  container.scrollBy({
    left: -1220,
    behavior: "smooth",
  });
});
document.getElementById("RightP").addEventListener("click", () => {
  const container = document.getElementById("ContainerP");
  container.scrollBy({
    left: 1220,
    behavior: "smooth",
  });
});
