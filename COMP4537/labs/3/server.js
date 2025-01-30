// this file created with the help of chatGPT
const express = require("express");
const fs = require("fs");
const path = require("path");
const { getDate } = require("./modules/utils");
const messages = require("./locals/en.json");
const fileName = "file.txt";

const app = express();
const PORT = 3000; // Change this if necessary

// GET Request - Return greeting with server time
app.get("/COMP4537/labs/3/getDate/", (req, res) => {
  const name = req.query.name;
  if (!name) {
    return res.status(400).send(messages.getDate404);
  }

  const currentDate = getDate();
  const message = messages.greeting
    .replace("%1", name)
    .replace("%2", currentDate);

  res.send(`<p style="color: blue;">${message}</p>`);
});

// GET Request - Read file contents
app.get("/COMP4537/labs/3/readFile/:filename", (req, res) => {
  const filePath = path.join(__dirname, req.params.filename);

  if (!fs.existsSync(filePath)) {
    return res
      .status(404)
      .send(`${messages.file404}${req.params.filename}${messages.notFound}`);
  }

  const content = fs.readFileSync(filePath, "utf8");
  res.send(`<pre>${content}</pre>`);
});

// GET Request - Write to file (append text)
app.get("/COMP4537/labs/3/writeFile/", (req, res) => {
  const text = req.query.text;
  if (!text) {
    return res.status(400).send(messages.fileWrite404);
  }

  fs.appendFile(fileName, text + "\n", (err) => {
    if (err) {
      return res.status(500).send(messages.fileWrite505);
    }
    res.send(messages.textAppendedSuccessfully);
  });
});

// Start the server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
