const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

mongoose.Promise = global.Promise;

const connectDB = () => {

	return mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

};

module.exports = {
	connectDB,
	mongoose
};