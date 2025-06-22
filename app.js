const express  = require("express");
const fs       = require("fs");
const path     = require("path");

const app = express();
const PORT = 3000;

// Serve everything inside /public as static files
app.use(express.static(path.join(__dirname, "public")));

// Parse form fields (urlencoded = HTML form default)
app.use(express.urlencoded({ extended: false }));

// Handle the login form
app.post("/login", (req, res) => {
  const { userid, password } = req.body;

  fs.readFile("users.txt", "utf8", (err, data) => {
    if (err) return res.status(500).send("Server error");

    const ok = data
      .split("\n")
      .map(l => l.trim())
      .filter(Boolean)                 // ignore empty lines
      .some(line => {
        const [u, p] = line.split(":");
        return u === userid && p === password;
      });

    if (ok) {
      return res.redirect("/welcome.html");
    } else {
      return res.send("❌ Invalid user-ID or password. <a href='/'>Try again</a>");
    }
  });
});

app.listen(PORT, () =>
  console.log(`🔐 Login app running →  http://localhost:${PORT}`)
);
