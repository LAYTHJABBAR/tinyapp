const getUserByEmail = (database, email) => {
    for (const key in database) {
        if (Object.values(database[key]).indexOf(email) > -1) {
            return true;
        }
    }
  };










  module.exports = getUserByEmail