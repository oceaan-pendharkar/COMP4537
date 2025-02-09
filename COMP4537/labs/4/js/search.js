let messages = {};
fetch("./locals/en.json")
  .then((response) => response.json())
  .then((data) => (messages = data))
  .catch((err) => console.log("Error loading messages", err));

import { endpoint } from "./endpoint.js";
console.log(endpoint);

const search = (word) => {
  const xhttp = new XMLHttpRequest();

  //true means it's async
  xhttp.open("GET", `${endpoint}?word=${word}`, true);
  xhttp.send();
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      let responseJson = JSON.parse(xhttp.responseText); // Parse JSON response
      document.getElementById(
        "display"
      ).innerHTML = `${messages.word}: ${responseJson.word} - ${messages.definition}: ${responseJson.definition} - ${messages.responseNum} ${responseJson.requests}`;
    }
    if (xhttp.readyState == 4 && xhttp.status != 200) {
      let responseJson = JSON.parse(xhttp.responseText); // Parse JSON response
      let responseNum = responseJson.requests; // Access the 'requests' key
      document.getElementById(
        "display"
      ).innerHTML = `${messages.responseNum}${responseNum} ${messages.word} ${word} ${messages.NotFound}`;
    }
  };
};

//asked chatGPT how to assign the onlick event to the button
document.getElementById("submitBtn").onclick = () => {
  document.getElementById("display").innerHTML = "";
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
