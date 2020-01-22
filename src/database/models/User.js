const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const types = mongoose.SchemaTypes;

const userSchema = new mongoose.Schema({

	_id: types.ObjectId,
	username: {
		type: String,
		unique: true,
		required: true,
		trim: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		validate: {
			validator: function(v) {
				return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
			},
			message: props => `${props.value} is not a valid email!`
		}
	},
	password: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		minlength: 8,
		maxlength: 42
	},
	role: {
		type: String,
		required: true,
		enum: ['ADMIN','USER'],
		default: 'USER'
	}

});

userSchema.statics.findByLogin = async function(login) {

	let user = await this.findOne({ username: login });

	if(!user) {

		user = await this.findOne({ email: login });

	}

	return user;

};

userSchema.pre('save', async function() {

	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(this.password, salt);

	this.password = hash;
});


const User = mongoose.model('User', userSchema);


module.exports = User;


