
const { isAuthenticated, isMessageOwner } = require('./authorization');
const { combineResolvers } = require('graphql-resolvers');


const toCursorHash = string => Buffer.from(string).toString('base64');

const fromCursorHash = string => Buffer.from(string, 'base64').toString('ascii');

// ESTAS DOS FUNCIONES DE ARRIBA SE UTILIZAN PARA QUE EL CURSOR QUE SE USA PARA PAGINACIÓN NO SE VEA COMO UNA FECHA
// SINO COMO UNA STRING CUALQUIERA QUE UTILIZA EL USUARIO PARA PEDIR LA SIGUIENTE PÁGINA. RECUERDEN QUE COMO CURSOR
// UTILIZAMOS UN FIELD QUE ES DATE (FECHA) EN MONGODB, CON EL FIN DE PODER ORDENAR LOS DOCUMENTOS Y DEVOLVER EL ÚLTIMO CURSOR.


const resolvers = {
	Query: {
		messages: async (parent, { cursor, limit = 100 }, { models }) => {
			
			let cursorOptions = cursor;

			if(!cursorOptions) {
				cursorOptions = {};
			} else {
				cursorOptions = {
					createdAt: { $gt: fromCursorHash(cursorOptions) }
				};
			}

			const messages = await models.Message.find({ ...cursorOptions }).sort({ createdAt: 1 }).limit( limit + 1).exec();

			const hasNextPage = messages.length > limit;

			const edges = hasNextPage ? messages.slice(0, -1) : messages;

			const endCursor = toCursorHash(edges[edges.length - 1].createdAt.toString()); 
			
			return {
				edges,
				pageInfo: {
					hasNextPage,
					endCursor
				}
			}
		
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
		user: (message, args, { loaders, models } ) => {
			
			//return models.User.findById(message.user);
			return loaders.user.load(message.user); 
			// THE load FUNCTON TAKES EACH USER IDENTIFIER INDIVIDUALLY AND WILL BATCH ALL THESE IDENTIFIERS
			// INTO ONE SET AND REQUEST ALL USERS AT THE SAME TIME.
		}
	}
};

module.exports = resolvers;