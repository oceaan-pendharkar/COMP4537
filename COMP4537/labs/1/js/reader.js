class Reader {
  constructor(readerContainerId, timestampContainerId) {
    this.readerContainer = document.getElementById(readerContainerId);
    this.readerTimestamp = document.getElementById(timestampContainerId);
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    this.displayNotes(notes);
    this.updateTimestamp();
    this.startReader();
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
      noteDiv.textContent = "No notes to display";
      this.readerContainer.appendChild(noteDiv);
    }
  }

  updateTimestamp() {
    const now = new Date().toLocaleTimeString();
    this.readerTimestamp.textContent = `Last fetched: ${now}`;
  }
}

new Reader("reader-container", "timestamp");
