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

- Node.js
- Express
- EJS
- body-parser
- bcrypt
- cookie-session

## How to Run this Fancy app

- Install all dependencies `npm install` .
- Run the development web server using the `npm start`, notice you need to change the description test on the package,json file to `run express_server.js`.
- browse to http://localhost:8082/urls
 

## Security 
- password encryption
- Cookie encryption
- All links you generate will be shown on your homepage, only viewable by you.
