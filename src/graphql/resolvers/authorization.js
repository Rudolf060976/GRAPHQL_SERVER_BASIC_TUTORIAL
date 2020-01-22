const { ForbiddenError } = require('apollo-server-express');
const { skip, combineResolvers } = require('graphql-resolvers');

const isAuthenticated = (parent, args, { me }) => {

	return me ? skip : new ForbiddenError('Authentication Required!');

};


const isMessageOwner = async (parent, { id }, { models, me }) => {

	const message = await models.Message.findById(id);

	if(message.user !== me.id) {
		throw new ForbiddenError('User is not the Message Owner');
	}

	return skip;

};


const isAdmin = combineResolvers(
	isAuthenticated,
	(parent, args, { models, me }) => {
		const { role } = me; // EN ESTE PUNTO, ESTAMOS SEGUROS DE QUE EL USUARIO ESTÁ AUTENTICADO

		if (role === 'ADMIN') {
			return skip;
		}

		throw new ForbiddenError('User is not an Admin!');

	}
);


module.exports = {
	isAuthenticated,
	isMessageOwner,
	isAdmin
};
