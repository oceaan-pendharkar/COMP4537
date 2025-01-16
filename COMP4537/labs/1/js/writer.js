import UserMessages from "../lang/messages/en/user.js"; // Import user messages

//This file was created with the help of chatGPT
class Button {
  constructor(label, onClick) {
    this.button = document.createElement("button");
    this.button.textContent = label;
    this.button.addEventListener("click", onClick);
  }

  getElement() {
    return this.button;
  }
}

class Note {
  constructor(noteContent, index, removeCallback) {
    this.noteContent = noteContent || "";
    this.index = index;
    this.removeCallback = removeCallback;
    this.noteDiv = this.createNoteElement(index);
  }

  createNoteElement(index) {
    const noteDiv = document.createElement("div");
    noteDiv.classList.add("note");
    noteDiv.id = index;

    const textarea = document.createElement("textarea");
    textarea.value = this.noteContent;

    const removeButton = new Button(UserMessages.remove, () => {
      noteDiv.remove();
      this.removeCallback(textarea.value);
    }).getElement();

    noteDiv.appendChild(textarea);
    noteDiv.appendChild(removeButton);

    return noteDiv;
  }

  getElement() {
    return this.noteDiv;
  }
}

class NotesManager {
  constructor() {
    this.initializeElements();
    this.initializeData();
    this.addEventListeners();
    this.loadNotes();
  }

  initializeElements() {
    // Writer elements
    this.notesContainer = document.getElementById("notes-container");
    this.addNoteButton = document.getElementById("add-note");
    this.addNoteButton.innerHTML = UserMessages.addNote;
    this.clearNotesButton = document.getElementById("clear");
    this.clearNotesButton.innerHTML = UserMessages.clearAllNotes;
    this.timestamp = document.getElementById("timestamp");
    this.saveNotesButton = document.getElementById("save-notes");
    this.saveNotesButton.innerHTML = UserMessages.saveNotes;
    document.getElementsByTagName("title")[0].innerHTML = UserMessages.writer;
    document.getElementById("title").innerHTML = UserMessages.writer;
    document.getElementById("back").innerHTML = UserMessages.backToHome;
  }

  initializeData() {
    this.notes = JSON.parse(localStorage.getItem("notes")) || [];
  }

  addEventListeners() {
    this.addNoteButton.addEventListener("click", () =>
      this.createAndAppendNote()
    );
    this.clearNotesButton.addEventListener("click", () => this.clearNotes());
    this.saveNotesButton.addEventListener("click", () =>
      this.saveNotesToLocalStorage()
    );
  }

  updatetimestamp() {
    const now = new Date().toLocaleTimeString();
    this.timestamp.textContent = `${UserMessages.lastSaved}${now}`;
    localStorage.setItem("lastSavedTime", now);
  }

  saveNotesToLocalStorage() {
    localStorage.setItem("notes", []);
    this.notes = [];
    for (let i = 0; i < this.notesContainer.children.length; i++) {
      this.notes.push(this.notesContainer.children[i].children[0].value);
    }
    localStorage.setItem("notes", JSON.stringify(this.notes));
    this.updatetimestamp();
  }

  clearNotes() {
    localStorage.removeItem("notes");
    this.notesContainer.innerHTML = "";
  }

  removeNoteFromLocalStorage(noteContent) {
    const index = this.notes.indexOf(noteContent);
    if (index !== -1) {
      this.notes.splice(index, 1);
      localStorage.setItem("notes", JSON.stringify(this.notes));
      this.updatetimestamp();
    }
  }

  createAndAppendNote(noteContent = "", index = undefined) {
    const note = new Note(noteContent, index, (content) =>
      this.removeNoteFromLocalStorage(content)
    );
    this.notesContainer.appendChild(note.getElement());
  }

  loadNotes() {
    this.notes.forEach((note) => this.createAndAppendNote(note, note.id));
    const lastSavedTime = localStorage.getItem("lastSavedTime");
    if (lastSavedTime) {
      this.timestamp.textContent = `${UserMessages.lastSaved}${lastSavedTime}`;
    }
  }
}

new NotesManager();
