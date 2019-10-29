const express = require("express");
const request = require('request');
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
function generateRandomString() {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for ( var i = 0; i < 6; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

app.use(bodyParser.urlencoded({extended: true}));
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
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
    const longURL = req.body.longURL
    if (longURL.startsWith('https://')) {
        urlDatabase[shortURL]= longURL } else {
            urlDatabase[shortURL] = `https://${longURL}`
        }
    request(urlDatabase[shortURL], (error, response, body) => {                   //response here to get back the body size and to use it on the bytes
        if (error) {
          res.send(`NOOOOOO!! such A Link check your URL`);
          return }
          res.redirect(`urls/${shortURL}`)          
        })
})
     app.get("/urls" , (req, res) => {
         let tempplateVars = { urls: urlDatabase }
      res.render("urls_index", tempplateVars)
     });
     app.post("/urls/:id/delete", (req, res) => {
      let shortURL = req.params.id
      delete urlDatabase[shortURL]
      res.redirect("/urls")
     });

     app.post("/urls/:id/update", (req, res) => {
      let shortURL = req.params.id
      const longURL = req.body.longURL
      if (longURL.startsWith('https://')) {
        urlDatabase[shortURL] = longURL } else {
            urlDatabase[shortURL] = `https://${longURL}`
        }
    
    request(urlDatabase[shortURL], (error, response, body) => {                   //response here to get back the body size and to use it on the bytes
        if (error) {
          res.send(`NOOOOOO!! such A Link check your URL`);
          return }
      res.redirect(`/urls/${shortURL}`)
     });
    })


     app.get("/urls/new", (req, res) => {
        res.render("urls_new");
      });

      app.get("/urls/:shortURL", (req, res) => {
        let templateVars = { 
            shortURL: req.params.shortURL, 
            longURL:urlDatabase[req.params.shortURL] };
        res.render("urls_show", templateVars);
     
      }); 
      app.get("/u/:shortURL", (req, res) => {
        res.redirect(urlDatabase[req.params.shortURL]);
      });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
}); 
