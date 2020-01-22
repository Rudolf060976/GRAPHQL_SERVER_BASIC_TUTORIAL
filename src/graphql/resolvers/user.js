
const userTokens = require('../../modules/JWT/userTokens');
const { AuthenticationError, UserInputError } = require('apollo-server-express');
const comparePasswords = require('../../modules/bcrypt/comparePasswords');
const { combineResolvers } = require('graphql-resolvers');
const { isAdmin } = require('./authorization');

const resolvers = {
	Query: {
		me: (parent, args, { models, me }) => {
			
			return me;
		},
		user: (parent, { id }, { models }) => {
			return models.User.findById(id);
		},
		users: (parent, args, { models }) => {
			return models.User.find({});
		}		
	},
	Mutation: {
		signUp: async (parent, { username, email, password }, { models, ObjectID }) => {
			const user = await models.User.create({
				_id: new ObjectID(),
				username,
				email,
				password
			});

			return { token: userTokens.generateUserToken(user) };
		},
		logIn: async (parent, { login, password }, { models }) => {

			const user = await models.User.findByLogin(login);

			if(!user) {
				throw new UserInputError('No user with this login credentials');
			}

			const isValid = comparePasswords(password, user.password);

			if(!isValid) {
				throw new AuthenticationError('Invalid Password');
			}

			return { token: userTokens.generateUserToken(user) };

		},
		deleteUser: combineResolvers(
			isAdmin,
			async (parent, { id }, { models, ObjectID, me }) => {
				try {
	
					await models.User.deleteOne({ _id: id });
	
					return true;
					
				} catch (error) {
					
					return false;
	
				}
			}
		)
	},
	User: {
		username: user => {
			return user.username;
		},
		messages: (user, args, { models }) => {
			return models.Message.find({ user: user._id});
		}
	}
};

module.exports = resolvers;