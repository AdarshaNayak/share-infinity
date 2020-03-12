const config = require("../config/config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../_helpers/db");
const User = db.User;
const Provider = db.Provider;

module.exports = {
	authenticate,
	create,
	delete: _delete,
	getById
};

async function authenticate({ userId, password }) {
	const user = await User.findOne({ userId });
	if (user && bcrypt.compareSync(password, user.hash)) {
		const { hash, ...userWithoutHash } = user.toObject();
		console.log(hash);
		console.log("-----------------");
		console.log(userWithoutHash);
		const token = jwt.sign({ sub: user.id }, config.secret);
		return {
			...userWithoutHash,
			token
		};
	}
}

async function create(userParam) {
	// validate
	if (await User.findOne({ userId: userParam.userId })) {
		throw 'userId "' + userParam.userId + '" is already taken';
	}

	const user = new User(userParam);

	// hash password
	if (userParam.password) {
		user.hash = bcrypt.hashSync(userParam.password, 10);
	}

	// save user
	await user.save();

	Provider.create({providerId:userParam.userId,isOnline:false,providerInUse:false,isAssigned:false,providerCharge:0,ratings:0}).then();
}

async function _delete(id) {
	await User.findByIdAndRemove(id);
}

async function getById(id) {
	return await User.findById(id).select("-hash");
}
