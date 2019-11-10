//external requirments
const bcrypt = require("bcrypt");
const {
  urlsOfUser,
  generateRandomString,
  isEmailExist
} = require("./helper");
const express = require("express");
const request = require("request");
const app = express();
const cookieSession = require("cookie-session");
const PORT = 8080;
app.set("view engine", "ejs");

app.use(
  cookieSession({
    name: "session",
    keys: ["anan"]
  })
);
const bodyParser = require("body-parser");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
// urls data for long and short url
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};
//user data information
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};
// code for get / page if user logged in return it to /urls else return to login page
app.get("/", (req, res) => {
  const userId = req.session.id;
  if (!userId) {
    res.redirect("/login");
  } else {
    res.redirect("/urls");
  }
});
// urls page code this code to show the url index page
app.post("/urls", (req, res) => {
  const userId = req.session.id;
  if (!userId) {
    res.redirect("/login");
  } else {
    const shortURL = generateRandomString();
    const longURL = req.body.longURL;

    request(req.body.longURL, error => {
      if (error) {
        res.send(`NO! such A Link check your URL`);
        return;
      }
      urlDatabase[shortURL] = { longURL: longURL, userID: req.session["id"] };
      res.redirect(`urls/${shortURL}`);
    });
  }
});

app.get("/urls", (req, res) => {
  const userId = req.session.id;
  if (!userId) {
    res.redirect("/login");
  } else {
    let templateVars = {
      urls: urlsOfUser(req.session.id, urlDatabase),
      user: users[req.session.id]
    };
    res.render("urls_index", templateVars);
  }
});
// urls/:id/delete code this code to delete the generated tiny url from data base
app.post("/urls/:id/delete", (req, res) => {
  const userId = req.session.id;
  if (!userId) {
    res.redirect("/login");
  } else {
    let shortURL = req.params.id;
    let user = req.session.id;
    delete urlDatabase[shortURL];
    res.redirect("/urls");
  }
});
//this code to update tiny url
app.post("/urls/:id/update", (req, res) => {
  const userId = req.session.id;
  if (!userId) {
    res.redirect("/login");
  } else {
    let shortURL = req.params.id;
    const longURL = req.body.longURL;
    if (longURL.startsWith("https://")) {
      urlDatabase[shortURL] = { longURL: longURL, userID: req.session["id"] };
    } else {
      urlDatabase[shortURL] = {
        longURL: `https://${longURL}`,
        userID: req.session["id"]
      };
    }
    request(urlDatabase[shortURL].longURL, error => {
      if (error) {
        res.send(`NO such A Link check your URL`);
        return;
      }
      res.redirect(`/urls`);
    });
  }
});
//url/new page code this code to creat new tiny url
app.get("/urls/new", (req, res) => {
  const userId = req.session.id;
  if (!userId) {
    res.redirect("/login");
  } else {
    let templateVars = {
      user: users[req.session.id]
    };
    res.render("urls_new", templateVars);
  }
});
// login code this code to log the use to the app and contain encryption code to save password
  const { email, password } = req.body;
  let isPassworg = false;
  for (const userId in users) {
    const user = users[userId];
    if (user.email === email) {
      if (bcrypt.compareSync(password, user.password)) {
        isPassworg = true;
        req.session.id = userId;
        res.redirect("/urls");
      }
    }
  }
  if (!isEmailExist(users, email)) {
    res.status(403).send("<h3>Email Not Found!!!</h3>");
  } else if (!isPassworg && isEmailExist(users, email)) {
    res.status(403).send("<h1>Password does not match!</h1>");
  }
});
app.get("/login", (req, res) => {
  let templateVars = {
    user: users[req.session.id]
  };
  return res.render("login", templateVars);
});
// this code to log out the user and tedirect it to the login page
app.post("/urls/logout", (req, res) => {
  req.session.id = null;
  res.redirect("/urls");
});

app.get("/urls/:shortURL", (req, res) => {
  const userId = req.session.id;
  if (!userId) {
    res.status(400).send("you have to log in with the owner id");
  } else {
    let templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      user: users[req.session.id]
    };
    res.render("urls_show", templateVars);
  }
});
app.get("/u/:shortURL", (req, res) => {
  const url = urlDatabase[req.params.shortURL];
  if (url && url.longURL) {
    res.redirect(url.longURL);
  } else {
    res.status(400).send("ther is no such tiny URL");
  }
});
// this code for registaration and to encrypt the password 
app.post("/register", (req, res) => {
  const id = generateRandomString();
  let email = req.body.email;
  let password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  if (!email || !password) {
    res.status(400);
    res.send("please provide email and password");
    return;
  }
  for (let check in users) {
    if (email === users[check].email) {
      res.status(400);
      res.send(" email exists, plase use another email.");
      return;
    }
  }
  req.session.id = id;

  users[id] = { id, email, password: hashedPassword };

  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  const templateVars = { user: users[req.session.id] };
  return res.render("registration", templateVars);
});

// this code to assign por listiong code
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
