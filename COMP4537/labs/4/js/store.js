let messages = {};

//helped by chatGPT
async function loadMessages() {
  try {
    const response = await fetch("./locals/en.json");
    messages = await response.json();

    // Set UI text
    document.title = messages.storeWord;
    document.getElementById("storeWord").innerHTML = messages.storeWord;
    document.getElementById("wordText").innerHTML = messages["word:"];
    document.getElementById("submitBtn").innerHTML = messages.submit;
    document.getElementById("definitionText").innerHTML =
      messages.definitionText;
  } catch (err) {
    console.log("Error loading messages", err);
  }
}

import { endpoint } from "./endpoint.js";

const store = (word, definition) => {
  const xhttp = new XMLHttpRequest();
  //true means it's async
  xhttp.open("POST", endpoint, true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(JSON.stringify({ word: word, definition: definition }));
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4) {
      let responseJson = JSON.parse(xhttp.responseText); // Parse JSON response

      document.getElementById("display").innerHTML = responseJson.message;
    }
  };
};

//asked chatGPT how to assign the onlick event to the button
document.getElementById("submitBtn").onclick = () => {
  document.getElementById("display").innerHTML = "";
  const word = document.getElementById("word").value;
  const definition = document.getElementById("definition").value;
  //word must start with a letter and end with a letter, and contain one or more letters
  //definition must start with a letter and end with a letter, and contain one or more letters, whitespace is allowed, common puctuation is allowed
  if (/^[A-Za-z]+$/.test(word) && /^[A-Za-z\s.,;!?'"()]+/.test(definition)) {
    store(word, definition);
  } else {
    document.getElementById(
      "display"
    ).innerHTML = `${messages.word} ${word} ${messages.or} ${messages.definition} ${definition} ${messages.invalid}`;
  }
};

loadMessages();
