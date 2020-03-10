const { exec } = require("child_process");

exports.addFiles = function(file) {
	exec("ipfs add " + file, (error, stdout) => {
		if (error) {
			console.log(error);
		} else {
			const fileIdentifier = stdout.split(" ")[1];
			console.log(fileIdentifier);
			return fileIdentifier;
		}
	});
};
