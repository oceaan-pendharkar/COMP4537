import UserMessages from "../lang/messages/en/user.js";

// This file was created with the help of chatGPT
class Reader {
  constructor(readerContainerId, timestampContainerId) {
    this.readerContainer = document.getElementById(readerContainerId);
    this.readerTimestamp = document.getElementById(timestampContainerId);
    this.displayUserMessages();
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    this.displayNotes(notes);
    this.updateTimestamp();
    this.startReader();
  }

  displayUserMessages() {
    document.getElementsByTagName("title")[0].innerHTML = UserMessages.reader;
    document.getElementById("title").innerHTML = UserMessages.reader;
    document.getElementById("back").innerHTML = UserMessages.backToHome;
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
      const noteDiv = document.createElement("div");
      noteDiv.classList.add("reader-note");
      noteDiv.textContent = noteContent;
      this.readerContainer.appendChild(noteDiv);
    });
    if (notes.length === 0) {
      const noteDiv = document.createElement("p");
      noteDiv.textContent = UserMessages.noNotes;
      this.readerContainer.appendChild(noteDiv);
    }
  }

  updateTimestamp() {
    const now = new Date().toLocaleTimeString();
    this.readerTimestamp.textContent = `${UserMessages.lastFetched}${now}`;
  }
}

new Reader("reader-container", "timestamp");
