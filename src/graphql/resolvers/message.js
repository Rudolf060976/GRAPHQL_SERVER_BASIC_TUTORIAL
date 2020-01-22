
const { isAuthenticated, isMessageOwner } = require('./authorization');
const { combineResolvers } = require('graphql-resolvers');

const resolvers = {
	Query: {
		messages: (parent, args, { models }) => {
			return models.Message.find({});
		},
		message: (parent, { id }, { models }) => {

			return models.Message.findById(id);
		}
		
	},
	Mutation: {
		createMessage: combineResolvers(
			isAuthenticated,
			(parent, { text }, { models, me, ObjectID }) => {
				
				return models.Message.create({
					_id: new ObjectID(),
					text,
					user: me._id
				});

			}
		),
		deleteMessage: combineResolvers(
			isAuthenticated,
			isMessageOwner,
			async (parent, { id }, { models }) => {
			
				const deleted = await models.Message.findOneAndDelete({ _id: id });
				
				if (deleted && Object.keys(deleted).length > 0) {
	
					return true;
				}
	
				return false; 
			}
		)
	},
	Message: {
		user: (message, args, { models } ) => {
			
			return models.User.findById(message.user);
		}
	}
};

module.exports = resolvers;