//this file was created with the help of chatGPT
const notesContainer = document.getElementById("notes-container");
const addNoteButton = document.getElementById("add-note");
const writerTimestamp = document.getElementById("writer-timestamp");
const clearButton = document.getElementById("clear");

function updateWriterTimestamp() {
  const now = new Date().toLocaleTimeString();
  writerTimestamp.textContent = `Last saved: ${now}`;
  localStorage.setItem("lastSavedTime", now);
}

function saveNoteToLocalStorage(noteContent, index) {
  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  if (noteContent.trim() !== "") {
    if (index !== undefined) {
      notes[index] = noteContent;
    } else {
      notes.push(noteContent);
    }
    localStorage.setItem("notes", JSON.stringify(notes));
    updateWriterTimestamp();
  }
}

function removeNoteFromLocalStorage(noteContent) {
  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  const index = notes.indexOf(noteContent);
  if (index !== -1) {
    notes.splice(index, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    updateWriterTimestamp();
  }
}

function createNoteElement(noteContent = "", index) {
  const noteDiv = document.createElement("div");
  noteDiv.classList.add("note");

  const textarea = document.createElement("textarea");
  if (noteContent != "") {
    textarea.value = noteContent;
  }

  const storeButton = document.createElement("button");
  storeButton.textContent = "Store";
  storeButton.addEventListener("click", () => {
    saveNoteToLocalStorage(textarea.value, index);
  });

  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.addEventListener("click", () => {
    removeNoteFromLocalStorage(textarea.value, index);
    notesContainer.removeChild(noteDiv);
  });

  noteDiv.appendChild(textarea);
  noteDiv.appendChild(storeButton);
  noteDiv.appendChild(removeButton);
  notesContainer.appendChild(noteDiv);
}

function loadNotes() {
  const notes = JSON.parse(localStorage.getItem("notes")) || [];
  notes.forEach((note, index) => createNoteElement(note, index));

  const lastSavedTime = localStorage.getItem("lastSavedTime");
  if (lastSavedTime) {
    writerTimestamp.textContent = `Last saved: ${lastSavedTime}`;
  }
}

function deleteAllNotes() {
  localStorage.removeItem("notes");
  notesContainer.innerText = "";
}

addNoteButton.addEventListener("click", () => createNoteElement());
clearButton.addEventListener("click", deleteAllNotes);
loadNotes();
