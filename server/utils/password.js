const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  try {
    // Automatically generate a salt and hash the password
    const hash = await bcrypt.hash(password, 12); // 12 is the number of salt rounds
    return hash;
  } catch (err) {
    throw err; // Rethrow the error to be caught by the caller
  }
};

const comparePassword = async (password, hashed) => {
  try {
    return await bcrypt.compare(password, hashed);
  } catch (err) {
    throw err; // Rethrow the error to be caught by the caller
  }
};

module.exports = {
  hashPassword,
  comparePassword,
};
