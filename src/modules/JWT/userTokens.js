const jwt = require('jsonwebtoken');

const Options = { // **** OPTIONS FOR GENERATED TOKENS	
	algorithm: 'HS256',
	expiresIn: 500 * 60
};

const secretOrKey = process.env.SECRET;

const generateUserToken = async user => {

	const { _id, email, username, role } = user;

	const payload = {
		id: _id,
		email,
		username,
		role
	};	

	const token = await jwt.sign(payload, secretOrKey, Options);

	return token;

};

const verifyUserToken = token => {
		
		const payload = jwt.verify(token, secretOrKey, Options);

		if(payload) {
			
			const { id, email, username, role  } = payload;

			return {
				id,
				email,
				username,
				role
			};
		}

		return null;
	
};


module.exports = { 
	generateUserToken,
	verifyUserToken
}