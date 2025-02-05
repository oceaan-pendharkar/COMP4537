const fs = require("fs");
const path = require("path");
const messages = require("../locals/en.json");

class FileService {
  constructor(fileName) {
    this.fileName = fileName;
  }

  readFile(fileName) {
    const filePath = path.join(__dirname, "..", fileName);

    if (!fs.existsSync(filePath)) {
      throw new Error(`${fileName} ${messages.notFound}`);
    }

    return fs.readFileSync(filePath, "utf8");
  }

  writeFile(text) {
    const filePath = path.join(__dirname, "..", fileName);

    if (!fs.existsSync(filePath)) {
      throw new Error(`${fileName} ${messages.notFound}`);
    }

    fs.appendFileSync(filePath, text + "\n");

    return messages.textAppendedSuccessfully;
  }
}

module.exports = FileService;
