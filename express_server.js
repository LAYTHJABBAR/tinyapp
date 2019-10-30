const express = require("express");
const request = require('request');
const app = express();
let cookieParser = require('cookie-parser');
app.use(cookieParser());
const PORT = 8080;
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
function generateRandomString() {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

app.use(bodyParser.urlencoded({ extended: true }));
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

// app.get("/", (req, res) => {
//   res.send("Hello layth!");
// });
// app.get("/urls.json", (req, res) => {
//     res.json(urlDatabase);
//   });
// app.get("/hello", (req, res) => {
//     res.send("<html><body>Hello <b>World</b></body></html>\n");
//   });
// app.get("/set", (req, res) => {
//     const a = 1;
//     res.send(`a = ${a}`);
//    });

//    app.get("/fetch", (req, res) => {
//     res.send(`a = ${a}`);
//    }); // is not accessible to a different get
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  if (longURL.startsWith('https://')) {
    urlDatabase[shortURL] = longURL;
  } else {
    urlDatabase[shortURL] = `https://${longURL}`;
  }
  request(urlDatabase[shortURL], (error) => {                   //response here to get back the body size and to use it on the bytes
    if (error) {
      res.send(`NOOOOOO!! such A Link check your URL`);
      return;
    }
    res.redirect(`urls/${shortURL}`);
  });
});
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase,
    username: req.cookies["username"]};
  res.render("urls_index", templateVars);
});

app.post("/urls/:id/delete", (req, res) => {
  let shortURL = req.params.id;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

app.post("/urls/:id/update", (req, res) => {
  let shortURL = req.params.id;
  const longURL = req.body.longURL;
  if (longURL.startsWith('https://')) {
    urlDatabase[shortURL] = longURL;
  } else {
    urlDatabase[shortURL] = `https://${longURL}`;
  }

  request(urlDatabase[shortURL], (error) => {                   //response here to get back the body size and to use it on the bytes
    if (error) {
      res.send(`NOOOOOO!! such A Link check your URL`);
      return;
    }
    res.redirect(`/urls/${shortURL}`);
  });
});
app.get("/urls/new", (req, res) => {
  let templateVars = {
    username: req.cookies["username"],
  };
  res.render("urls_new", templateVars);
});

app.post("/urls/login", (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect("/urls");
});

app.post("/urls/logout", (req, res) => {
  res.clearCookie('username', req.body.username);
  res.redirect("/urls");
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies["username"]
  };
  res.render("urls_show", templateVars);
});
app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]);
});
app.post('/register', (req, res) => {
  const id = generateRandomString();
  const user_id = generateRandomString()
  let email = req.body.email;
  let password = req.body.password;
  if (!email || !password) {
    res.status(400);
    res.send("please provide email and password");
    return;
  }
  for (let check in users) {
    if (email = users[check].email) {
      res.status(400)
      res.send(" email exists, plase use another email.");
      return;
    } else {
    }
  }
  users[user_id] = { id, email, password };
  res.cookie('password', req.body.password);
  res.cookie('email', req.body.email);
  //console.log(newUser);
  res.redirect('/urls')
 })
 //registers a new user
 app.get('/register', (req, res) => {
  let templateVars = {
    username: req.cookies["username"]
  };
  return res.render('urls_register', templateVars);
 });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
