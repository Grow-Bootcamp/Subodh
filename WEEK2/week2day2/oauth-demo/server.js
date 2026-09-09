require("dotenv").config();
const express = require("express");
const session = require("express-session");
const { google } = require("googleapis");

const app = express();

//Serve frontend from the static public folder
app.use(express.static("public"));

//Create session for the user
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

// Create Google OAuth Client
const googleClient = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:3000/callback",
);

// STEP 1 : Start Google Login
app.get("/login", (req, res) => {
  const loginUrl = googleClient.generateAuthUrl({
    scope: ["openid", "email", "profile"],
  });
  res.redirect(loginUrl);
});

// STEP 2 : Google Redirects back here
app.get("/callback", async (req, res) => {
  try {
    //Get the code from Google OAuth
    const code = req.query.code;
    console.log("Authorization code received");

    //Exchange authorization code for Access token
    const { tokens } = await googleClient.getToken(code);
    console.log("Access token received");

    // Provide tokens to googleClient
    googleClient.setCredentials(tokens);

    // Create Google Oauth api client
    const oauth = google.oauth2({
      auth: googleClient,
      version: "v2",
    });

    //Get user info using oauth api
    const { data } = await oauth.userinfo.get();

    console.log("User:", data);
    console.log(data.picture);

    // Saves userinfo in our session
    req.session.user = {
      name: data.name,
      email: data.email,
      picture: data.picture,
    };

    // Redirect to our app
    res.redirect("/");
  } catch (error) {
    console.error(error);

    res.status(500).send("Login failed");
  }
});

// STEP 3: Frontend asks who is logged in
app.get("/me", (req, res) => {
  if (!req.session.user) {
    return res.json({
      loggedIn: false,
    });
  }

  res.json({
    loggedIn: true,
    user: req.session.user,
  });
});

// Start the server at port 3000
app.listen(3000, () => {
  console.log("Server running at 3000 port!");
});
