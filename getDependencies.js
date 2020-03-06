const fs = require('fs');
const { exec } = require("child_process");

exports.getDependencies = function identifyDependencies() {
    console.log("In dependencies")
    exec("pipreqs --force ./data_new", (error, stdout, stderr) => {
        if (error) {
            // error condition
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            // standard error
            console.log(`stderr: ${stderr}`);
            return;
        }
        // Remove the temp directory
    });
}
