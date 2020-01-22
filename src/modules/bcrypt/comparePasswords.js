const bcrypt = require('bcryptjs');


const comparePasswords = (inputPassword, userPassword) => {

	return (bcrypt.compareSync(inputPassword, userPassword));

};

module.exports = comparePasswords;