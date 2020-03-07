var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
	userId: {
		type: String,
		unique: true,
		required: true
	},

	// Note hash : encrypted password

	hash: {
		type: String,
		required: true
	},

	emailId: {
		type: String
	}
});

userSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("User", userSchema);
