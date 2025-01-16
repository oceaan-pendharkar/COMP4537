import UserMessages from "../lang/messages/en/user.js";
import { Button } from "./button.js";

// This file was created with the help of chatGPT
class ReaderNote {
  constructor(noteContent, container) {
    this.noteContent = noteContent || "";
    this.container = container;
    this.noteDiv = this.createNoteElement();
  }

  createNoteElement() {
    const noteDiv = document.createElement("div");
    noteDiv.classList.add("reader-note");
    noteDiv.textContent = this.noteContent;
    this.container.appendChild(noteDiv);
    return noteDiv;
  }

  getElement() {
    return this.noteDiv;
  }
}

class Reader {
  constructor(readerContainerId, timestampContainerId) {
    this.readerContainer = document.getElementById(readerContainerId);
    this.readerTimestamp = document.getElementById(timestampContainerId);
    this.buttonContainer = document.getElementById("button-container");
    const backButton = new Button(UserMessages.backToHome, () => {
      location.href = "index.html";
    }).getElement();
    this.buttonContainer.appendChild(backButton);
    this.displayUserMessages();
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    this.displayNotes(notes);
    this.updateTimestamp();
    this.startReader();
  }

  displayUserMessages() {
    document.getElementsByTagName("title")[0].innerHTML = UserMessages.reader;
    document.getElementById("title").innerHTML = UserMessages.reader;
  }

  startReader() {
    setInterval(() => {
      const notes = JSON.parse(localStorage.getItem("notes")) || [];
      this.displayNotes(notes);
      this.updateTimestamp();
    }, 2000);
  }

  displayNotes(notes) {
    this.readerContainer.innerHTML = ""; // Clear existing notes in reader
    notes.forEach((noteContent, index) => {
      if (noteContent === "" || noteContent === null) return;
      new ReaderNote(noteContent, this.readerContainer);
    });
    if (notes.length === 0) {
      this.displayNoNotesMessage();
    }
  }

  displayNoNotesMessage() {
    const noteDiv = document.createElement("p");
    noteDiv.textContent = UserMessages.noNotes;
    this.readerContainer.appendChild(noteDiv);
  }

  updateTimestamp() {
    const now = new Date().toLocaleTimeString();
    this.readerTimestamp.textContent = `${UserMessages.lastFetched}${now}`;
  }
}

new Reader("reader-container", "timestamp");
