const express = require("express");
const { getDate } = require("./modules/utils");
const messages = require("./locals/en.json");
const FileService = require("./services/fileService");
const fileName = "file.txt";

class Server {
  constructor(port) {
    this.app = express();
    this.port = port;
    this.fileService = new FileService(fileName);
    this.setupRoutes();
  }

  setupRoutes() {
    // GET Request - Return greeting with server time
    this.app.get("/COMP4537/labs/3/getDate/", (req, res) =>
      this.handleGetDate(req, res)
    );

    // GET Request - Read file contents
    this.app.get("/COMP4537/labs/3/readFile/:filename", (req, res) =>
      this.handleReadFile(req, res)
    );

    // GET Request - Write to file (append text)
    this.app.get("/COMP4537/labs/3/writeFile/", (req, res) =>
      this.handleWriteFile(req, res)
    );
  }

  handleGetDate(req, res) {
    const name = req.query.name;
    if (!name) {
      return res.status(400).send(messages.getDate404);
    }

    const currentDate = getDate();
    const message = messages.greeting
      .replace("%1", name)
      .replace("%2", currentDate);

    res.send(`<p style="color: blue;">${message}</p>`);
  }

  handleReadFile(req, res) {
    try {
      const content = this.fileService.readFile(req.params.filename);
      res.send(`<pre>${content}</pre>`);
    } catch (error) {
      res
        .status(404)
        .send(`${messages.file404}${req.params.filename}${messages.notFound}`);
    }
  }

  async handleWriteFile(req, res) {
    const text = req.query.text;
    if (!text) {
      return res.status(400).send(messages.fileWrite404);
    }

    try {
      const response = await this.fileService.writeFile(text);
      res.send(response);
    } catch (error) {
      res.status(500).send(messages.fileWrite505);
    }
  }

  start() {
    this.app.listen(this.port, "0.0.0.0", () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}

// Instantiate and start the server
const server = new Server(3000);
server.start();
