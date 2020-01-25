require('custom-env').env(true, __dirname + './../');

const express = require('express');

const { ObjectID } = require('mongodb');

const DataLoader = require('dataloader');

const { ApolloServer, AuthenticationError } = require('apollo-server-express');

const schema = require('./graphql/schema');

const resolvers = require('./graphql/resolvers');

const models = require('./database/models');

const userTokens = require('./modules/JWT/userTokens');

const { connectDB, mongoose } = require('./database/mongoose');

const { seedDatabase } = require('./database/seedDatabase');

const loaders = require('./modules/loaders');

const cors = require('cors');

const app = express();

app.use(cors());

app.get('/prueba', (req, res) => {

	res.send('ESTA ES UNA PRUBA DE API');


});


connectDB().then( async () => {

	console.log("CONNECTED TO MONGODB!!");	

	const eraseDatabase = true;


	if (eraseDatabase) {

		await Promise.all([
			models.User.deleteMany({}),
			models.Message.deleteMany({})
		]);
	}

	seedDatabase();
		
const server = new ApolloServer({
	typeDefs: schema,
	resolvers,
	context: async ({ req }) => {  // NO TIENE QUE SER async, SOLO SI HAY PROMESAS DENTRO DE LA FUNCIÓN
		
		let me = null;
		const token = req.headers['x-token'];
		
		if(token) {
			try {
				const response = userTokens.verifyUserToken(token);

				if(response) {

					const { id, username, email, role } = response;
					
					me = {
						id,
						username,
						email,
						role
					};
				}

			} catch (error) {

				throw error;
				//throw new AuthenticationError('Invalid or expired Token. Log in again');
			}
		} // NON AUTHENTICATED USERS - WHEN me = null - MIGHT BE ABLE TO PERFORM CERTAIN TYPES OF ACIONS AT
		// THE RESOLVERS LEVEL
				
		return {
			models,
			ObjectID,
			me,
			loaders: {
				user: new DataLoader(keys => loaders.user.batchUsers(keys, models))
			}
		};

	}
});

	server.applyMiddleware({ app, path: '/graphql'});



	app.listen({ port: 8000 }, () => {

		console.log('Apollo Server on http://localhost:8000/graphql');
	
	});	

});


