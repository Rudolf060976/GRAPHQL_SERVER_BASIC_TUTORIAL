const mongoose = require('mongoose');

const types = mongoose.SchemaTypes;

const messageSchema = new mongoose.Schema({

	_id: types.ObjectId,
	text: {
		type: String,
		required: true
	},
	user: {
		type: types.ObjectId,
		ref: 'User'
	},
	createdAt: {
		type: types.Date
	}

});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
