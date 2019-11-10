//this file conatin the helper fuctions for the express_server.js
const getUserByEmail = function(email, database) {
  for (let u in database) {
    if (email === database[u].email) {
      return database[u];
    }
  }
};
function urlsOfUser(id, urlDatabase) {
  let urlOfUserNew = {};
  if (id) {
    for (const key in urlDatabase) {
      if (urlDatabase[key].userID === id) {
        urlOfUserNew = Object.assign(urlOfUserNew, { [key]: urlDatabase[key] });
      }
    }
  }
  return urlOfUserNew;
}
// this function to generate an id for the user and tiny url
function generateRandomString() {
  let result = "";
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
//this function to check if the email is exist inside the data base
const isEmailExist = (object, email) => {
  for (const key in object) {
    if (Object.values(object[key]).indexOf(email) > -1) {
      return true;
    }
  }
};

module.exports = {
  getUserByEmail,
  isEmailExist,
  urlsOfUser,
  generateRandomString
};
