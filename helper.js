const getUserByEmail = (email, database) => {
  for (const key in database) {
    if (Object.values(database[key]).indexOf(email) > -1) {
      return database[key].id;
    } else {
      return undefined;
    }
  }
};

module.exports = getUserByEmail;