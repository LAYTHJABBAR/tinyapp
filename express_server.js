const bcrypt = require('bcrypt');
const express = require("express");
const request = require('request');
const app = express();
let cookieParser = require('cookie-parser');
app.use(cookieParser());
const PORT = 8080;
app.set("view engine", "ejs");
const isEmailExist = (object, email) => {
  for (const key in object) {
      if (Object.values(object[key]).indexOf(email) > -1) {
          return true;
      }
  }
};
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
// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
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
  if ( longURL.startsWith('https://')) {
    urlDatabase[shortURL] = { longURL: longURL, userID: req.cookies['id']};
  } else {
    urlDatabase[shortURL] = { longURL: `https://${longURL}`, userID: req.cookies['id']};
  }
  request(urlDatabase[shortURL].longURL, (error) => {                   //response here to get back the body size and to use it on the bytes
    if (error) {
      res.send(`NOOOOOO!! such A Link check your URL`);
      return;
    }
    res.redirect(`urls/${shortURL}`);
  });
});
function urlsOfUser(id, urlDatabase) {
  let urlOfUserNew = {};
  if(id) {
    for (const key in urlDatabase) {
        if (urlDatabase[key].userID === id) {
          urlOfUserNew = Object.assign(urlOfUserNew, {[key]: urlDatabase[key]});
        }
      }
    }
  return urlOfUserNew;
 }
app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlsOfUser(req.cookies['id'], urlDatabase),
    user: users[req.cookies['id']]
};
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
    urlDatabase[shortURL] = { longURL: longURL, userID: req.cookies['id']};
  } else {
    urlDatabase[shortURL] = { longURL: `https://${longURL}`, userID: req.cookies['id']};
  }
  request(urlDatabase[shortURL].longURL, (error) => {                   //response here to get back the body size and to use it on the bytes
    if (error) {
      res.send(`NOOOOOO!! such A Link check your URL`);
      return;
    }
    res.redirect(`/urls`);
  });
});
app.get("/urls/new", (req, res) => {
  let templateVars = {
    user: users[req.cookies['id']]
  };
  res.render("urls_new", templateVars);
});

app.post('/login', (req, res) => { // Checking if the inofrmation been entered corrctly or no.

  const { email, password } = req.body;
  let isPassworg = false;
  for (const userId in users) {
      const user = users[userId];
      if (isEmailExist(users, email)) {
          if (bcrypt.compareSync(password, users[userId].password)) {
              isPassworg = true;
              res.cookie('id', user.id);
              res.redirect('/urls');
          }
      }
  }
  if (!isEmailExist(users, email)) {
      res.status(403).send("<h3>Email Not Found!!!</h3>");
  } else if (!isPassworg && isEmailExist(users, email)) {
      res.status(403).send("<h1>Password does not match!</h1>");
  }
});
app.get('/login', (req, res) => {
  let templateVars = {
      user: users[req.cookies["id"]]
  };
  return res.render('urls_login', templateVars);
});
app.post("/urls/logout", (req, res) => {
  res.clearCookie('id', req.body.id);
  res.clearCookie('email', req.body.email);
  res.clearCookie('password', req.body.password);
  res.redirect("/urls");
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[req.cookies['id']]
  };
  res.render("urls_show", templateVars);
});
app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL]);
});

//register
app.post('/register', (req, res) => {
  const id = generateRandomString();
  let email = req.body.email;
  let password = req.body.password;
  let hashedPassword = bcrypt.hashSync(password, 10);
  if (!email || !password) {
    res.status(400);
    res.send("please provide email and password");
    return;
  }
  for (let check in users) {
    if (email === users[check].email) {
      res.status(400)
      res.send(" email exists, plase use another email.");
      return;
    }
  }
  res.cookie('id', id);
  res.cookie('password', hashedPassword);
  res.cookie('email', req.body.email);
  //res.cookie('email', req.body.email);
 
  users[id] = { id: id, email: req.body.email, password: hashedPassword };
   
  res.redirect('/urls')
 })
 //registers a new user
 app.get('/register', (req, res) => {
  let templateVars = { user: users[req.cookies['id']] };
  return res.render('urls_register', templateVars);
 });
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});