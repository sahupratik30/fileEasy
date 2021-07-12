//GLOBALS
const url = `https://file-easy-share.herokuapp.com/api/files`;
const MAX_FILE_SIZE = 100 * 1024 * 1024; //100MB
const emailUrl = `${url}/send`;
//DOM Elements
const dropZone = document.querySelector(".drop_file_container");
const submit = document.querySelector("#submit");
const fromEmail = document.getElementById("fromEmail");
const toEmail = document.getElementById("toEmail");
const browseBtn = document.querySelector("#browseBtn");
const fileUpload = document.querySelector("#fileUpload");
const progressDiv = document.querySelector(".progress_div");
const uploadPercent = document.getElementById("uploadPercent");
const progressBar = document.querySelector(
  ".upload_progress_section .uploading_div .progress_bar"
);
const progressContainer = document.querySelector(".upload_progress_section");
const sharingContainer = document.querySelector(".sharing_section");
const downloadLink = document.querySelector("#fileURL");
const copyURLBtn = document.querySelector("#copyURLBtn");
const promptBox = document.querySelector(".prompt");
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
  const droppedFiles = e.dataTransfer.files;
  if (droppedFiles.length) {
    fileUpload.files = droppedFiles;
    uploadFile();
  }
});
fileUpload.addEventListener("change", () => {
  uploadFile();
});
browseBtn.addEventListener("click", () => {
  fileUpload.click();
});
copyURLBtn.addEventListener("click", () => {
  downloadLink.select();
  document.execCommand("copy");
  showPrompt("Link Copied");
});
submit.addEventListener("click", (e) => {
  e.preventDefault();
  sendMail();
});
//Function to reset file input
function resetFileInput() {
  fileUpload.value = "";
}
//Function to upload file
function uploadFile() {
  const files = fileUpload.files;
  if (files.length > 1) {
    resetFileInput();
    showPrompt("Can't upload more than 1 file!");
    return;
  }
  const file = fileUpload.files[0];
  if (file.size > MAX_FILE_SIZE) {
    resetFileInput();
    showPrompt(`Can't upload more than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
    return;
  }
  submit.removeAttribute("disabled");
  progressContainer.style.display = "block";
  const formData = new FormData();
  formData.append("myfile", file);
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      showLink(JSON.parse(xhr.response));
    }
  };
  xhr.upload.onprogress = uploadProgress;
  xhr.upload.onerror = () => {
    resetFileInput();
    showPrompt(`Error in upload: ${xhr.statusText}`);
  };
  xhr.open("POST", url);
  xhr.send(formData);
}
//Function to update upload progress
function uploadProgress(e) {
  const { total, loaded } = e;
  let percentLoaded = `${parseInt((loaded / total) * 100)}%`;
  console.log(percentLoaded);
  progressDiv.style.width = percentLoaded;
  uploadPercent.innerText = percentLoaded;
  progressBar.style.width = percentLoaded;
}
//Function to display link
function showLink({ file }) {
  resetFileInput();
  progressContainer.style.display = "none";
  downloadLink.value = file;
  sharingContainer.style.display = "block";
}
//Function to send email
function sendMail() {
  let emailTo = toEmail.value;
  let emailFrom = fromEmail.value;
  let uuid = downloadLink.value.split("/").splice(-1, 1)[0];
  const data = {
    uuid,
    emailTo,
    emailFrom,
  };
  fetch(emailUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        toEmail.value = "";
        fromEmail.value = "";
        sharingContainer.style.display = "none";
        showPrompt("Email Sent Successfully");
      }
    });
}
//Function to show prompt box
let timeout;
function showPrompt(msg) {
  promptBox.innerText = msg;
  promptBox.style.transform = `translate(-50%, 0)`;
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    promptBox.style.transform = `translate(-50%, 60px)`;
  }, 2000);
}
