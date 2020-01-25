
const batchUsers = async (keys, models) => {
	
	const users = await models.User.find({ _id: { $in: keys }});
	//const users = await models.User.find({}).where('_id').in(keys).exec();
	
	return keys.map(key => users.find(user => user._id.toString() === key.toString()));
	// USERS NEED TO BE RETURNED IN THE SAME ORDER AS THEIR INCOMING KEYS
};

module.exports = {
	
	batchUsers

};