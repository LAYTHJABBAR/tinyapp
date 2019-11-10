# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs.

## app details

-  shortened URL links .
-  checking the link if it's a correct link before shortened it.
- 
 !["Screenshot of URLs page"](https://raw.githubusercontent.com/LAYTHJABBAR/tinyapp/master/docs/url_editing%20_page.png)
 !["Screenshot of URLs page"](https://raw.githubusercontent.com/LAYTHJABBAR/tinyapp/master/docs/urls-page.png)
 !["Screenshot of Cookies page"](https://raw.githubusercontent.com/LAYTHJABBAR/tinyapp/master/docs/cookies.png)

## Dependencies
please be sure to have them installed before running the app.

- Node.js
- Express
- EJS
- body-parser
- bcrypt
- cookie-session
- request
- ejs

  

## How to Run this Fancy app

- Install all dependencies `npm install` .
- Run the development web server using the `npm start`, notice you need to change the scripts->start on the package,json file to `./node_modules/.bin/nodemon -L express_server.js`.
- run the express_server.js from terminal by running this code `nodemon express.server.js`
- browse to http://localhost:8080/urls
 

## Security 
- password encryption
- Cookie encryption
- All links you generate will be shown on your homepage, only viewable by you.
