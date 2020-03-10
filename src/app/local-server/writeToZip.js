const compressing = require("compressing");
const homedir = require("os").homedir;
const dir = homedir + "/share-infinity-transactions/";

// compress a file
// it will give an error if there is no data_new folder
// function write(filePath) {
//     compressing.gzip.compressFile('../data_new', './final.zip')
//     .then(res => {
//         console.log("Done!!");
//     })
//     .catch(err => {
//         console.log("sdsdffd");
//         console.log(err);
//     });
// }
// write("sdf");

exports.write = function write(filePath) {
	compressing.tar
		.compressDir(filePath, dir + "transaction.zip")
		.then(res => {
			console.log("Done!!");
		})
		.catch(err => {
			console.log(err);
		});
};
