const { gql } = require('apollo-server-express');

const schema = gql`
	scalar Date 

	type Query {
		me: User
		user(id: ID!): User
		users: [User!]
		messages(cursor: String, limit: Int): MessageConnection!
		message(id: ID!): Message!		
	}

	type MessageConnection {
		edges: [Message!]!
		pageInfo: PageInfo!
	}

	type PageInfo {
		hasNextPage: Boolean!
		endCursor: String!
	}

	type Mutation {
		createMessage(text: String!): Message!
		deleteMessage(id: ID!): Boolean!
		signUp(username: String!, email: String!, password: String!): Token!
		logIn(login: String!, password: String!): Token!
		deleteUser(id: ID!): Boolean!
	}

	type Token {
		token: String!
	}	
	
	type User {
		id: ID!
		username: String!
		email: String!
		messages: [Message!]
		role: String!		
	}

	type Message {
		id: ID!
		text: String!
		user: User!
		createdAt: Date!
	}

`;

module.exports = schema;

