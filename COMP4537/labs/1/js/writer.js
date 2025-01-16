import UserMessages from "../lang/messages/en/user.js"; // Import user messages
import { Button } from "./button.js";

//This file was created with the help of chatGPT
class WriterNote {
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
    this.loadNotes();
    this.startWriter();
  }

  initializeElements() {
    // Writer elements
    this.notesContainer = document.getElementById("notes-container");
    this.timestamp = document.getElementById("timestamp");
    document.getElementsByTagName("title")[0].innerHTML = UserMessages.writer;
    document.getElementById("title").innerHTML = UserMessages.writer;
    this.initializeButtons();
  }

  initializeButtons() {
    // Dynamically create buttons
    this.addNoteButton = new Button(UserMessages.addNote, () => {
      this.createAndAppendNote();
    }).getElement();

    this.clearNotesButton = new Button(UserMessages.clearAllNotes, () => {
      this.clearNotes();
    }).getElement();

    const backButton = new Button(UserMessages.backToHome, () => {
      location.href = "index.html";
    }).getElement();

    // Assign IDs to the buttons
    this.addNoteButton.id = "add-note";
    this.clearNotesButton.id = "clear";

    // Append buttons to the DOM
    const container = document.createElement("div");
    container.id = "button-container";
    container.appendChild(this.addNoteButton);
    container.appendChild(this.clearNotesButton);
    container.appendChild(backButton);
    document.body.appendChild(container);
  }

  initializeData() {
    this.notes = JSON.parse(localStorage.getItem("notes")) || [];
  }

  startWriter() {
    setInterval(() => {
      this.saveNotesToLocalStorage();
    }, 2000);
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
    const note = new WriterNote(noteContent, index, (content) =>
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
