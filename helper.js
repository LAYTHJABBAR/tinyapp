const getUserByEmail = function (email, database) {
  for (let u in database) {
      if (email === database[u].email) {
          return database[u];//return the whore obj.
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
function generateRandomString() {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = { getUserByEmail, urlsOfUser , generateRandomString};