const http = require("http");
const { Pool } = require("pg");
require("dotenv").config();
const messages = require("./locals/en.json");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Neon PostgreSQL
});

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  console.log(parsedUrl.pathname);

  res.setHeader("Access-Control-Allow-Origin", "https://justinsaintdev.com");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "GET" && parsedUrl.pathname === "/posts") {
    try {
      const { rows } = await pool.query("SELECT * FROM posts");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(rows));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
  } else if (req.method === "POST" && parsedUrl.pathname === "/posts") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      try {
        const { data } = JSON.parse(body);

        if (!Array.isArray(data) || data.length === 0) {
          throw new Error(messages.invalidData);
        }

        const values = data.flatMap(({ name, date }) => [name, date]);
        const query = `INSERT INTO posts (name, date) VALUES ${data
          .map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`)
          .join(", ")}`;

        const result = await pool.query(query, values);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ success: true, rowsInserted: result.rowCount })
        );
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
  } else if (req.method === "GET" && parsedUrl.pathname === "/query") {
    try {
      const sql = parsedUrl.searchParams.get("sql");

      if (!sql || !sql.match(/^SELECT/i)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: messages.invalidQuerySelect,
          })
        );
        return;
      }

      //build SQL SELECT query
      const parts = sql.split(";");
      const query = parts[0];

      const { rows } = await pool.query(query);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(rows));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
  } else if (req.method === "POST" && parsedUrl.pathname === "/query") {
    //get the sql query from the body
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      try {
        const { sql } = JSON.parse(body);

        if (!sql || !sql.match(/^INSERT/i)) {
          throw new Error(messages.invalidQueryInsert);
        }

        //build SQL SELECT query
        const parts = sql.split(";");
        const query = parts[0];

        const result = await pool.query(query);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ success: true, rowsInserted: result.rowCount })
        );
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: messages.routeNotFound }));
  }
});

server.listen(3001, () => console.log("Server running on port 3001"));
