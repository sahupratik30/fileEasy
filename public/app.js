const dropZone = document.querySelector(".drop_file_container");
const browseBtn = document.querySelector("#browseBtn");
const fileUpload = document.querySelector("#fileUpload");
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  if (!dropZone.classList.contains("dragged")) {
    dropZone.classList.add("dragged");
  }
  console.log("dragging...");
});
dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragged");
});
dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragged");
});
browseBtn.addEventListener("click", () => {
  fileUpload.click();
});
