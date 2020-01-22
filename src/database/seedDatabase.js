const mongoose = require('mongoose');
const models = require('./models');
const { ObjectID } = require('mongodb');


const seedDatabase = async () => {

	const id1 = new ObjectID();

	const id2 = new ObjectID();

	const id3 = new ObjectID();

	const id4 = new ObjectID();

	const id5 = new ObjectID();

	const id6 = new ObjectID();

	const id7 = new ObjectID();

	const id8 = new ObjectID();

	const id9 = new ObjectID();

	const id10 = new ObjectID();


	await models.User.create([
		{
			_id: id1,
			username: 'rafaelUrbina',
			email: 'rafaelurbinan@hotmail.com',
			password: 'pelalo2018',
			role: 'ADMIN'
		},
		{
			_id: id2,
			username: 'francoLopez',
			email: 'hellofrancoLopez@gmail.com',
			password: '123456789',
			role: 'USER'
		},
		{
			_id: id3,
			username: 'rodrigoCabezas',
			email: 'helloRodrigoCabezas@gmail.com',
			password: '987654321',
			role: 'USER'
		}
	]);

	await models.Message.create([
		{
			_id: id5,
			text: 'Published the Road to Learn React',
			user: id1,
			createdAt: new Date().getTime() + 1000
		},
		{
			_id: id6,
			text: 'Published a complete ...',
			user: id1,
			createdAt: new Date().getTime() + 2000
		},
		{
			_id: id7,
			text: 'Hapy to Release',
			user: id2,
			createdAt: new Date().getTime() + 3000
		},
		{
			_id: id8,
			text: 'Published a complete ...',
			user: id2,
			createdAt: new Date().getTime() + 4000
		},
		{
			_id: id4,
			text: 'Hapy to Release',
			user: id3,
			createdAt: new Date().getTime() + 5000
		},
		{
			_id: id9,
			text: 'Published a complete ...',
			user: id3,
			createdAt: new Date().getTime() + 6000
		}
	]);


};

module.exports = {
	
	seedDatabase

};
