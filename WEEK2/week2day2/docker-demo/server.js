const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send(`
    <h1>Test POST Request</h1>
    <button onclick="sendPost()">Click to Send POST</button>
    <script>
      async function sendPost() {
        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: "Docker User" })
        });
        const data = await response.json();
        alert(JSON.stringify(data));
      }
    </script>
  `);
});

app.post("/", (req, res) => {
  console.log("POST Body Received:", req.body);
  res.json({ status: "Success", data: req.body });
});

app.listen(4000, "0.0.0.0", () => console.log("Server running on port 4000"));
