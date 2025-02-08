let messages = {};
fetch("./locals/en.json")
  .then((response) => response.json())
  .then((data) => (messages = data))
  .catch((err) => console.log("Error loading messages", err));

let endpoint = "";
fetch("./endpoint.js")
  .then((response) => response.text())
  .then((data) => (endpoint = data))
  .catch((err) => console.log("Error loading endpoint ", err));

const search = (word) => {
  const xhttp = new XMLHttpRequest();

  //true means it's async
  xhttp.open("GET", `${endpoint}?word=${word}`, true);
  xhttp.send();
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && this.status == 200) {
      document.getElementById("display").innerHTML = this.responseText;
    }
    if (xhttp.readyState == 4 && this.status != 200) {
      let responseNum = this.responseText;
      document.getElementById(
        "display"
      ).innerHTML = `${messages.responseNum}${this.responseText} ${messages.word} ${word} ${messages.NotFound}`;
    }
  };
};

//asked chatGPT how to assign the onlick event to the button
document.getElementById("submitBtn").onclick = () => {
  const word = document.getElementById("word").value;
  //must start with a letter and end with a letter, and contain one or more letters
  if (/^[A-Za-z]+$/.test(word)) {
    search(word);
  } else {
    document.getElementById(
      "display"
    ).innerHTML = `${messages.word} ${word} ${messages.invalid}`;
  }
};
