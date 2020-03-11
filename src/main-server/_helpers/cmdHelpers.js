const { exec } = require('child_process');

async function ipfsAdd(file) {
    //process path
    file = file.replace(/\s/g,"\\ ")
    return new Promise((resolve, reject) => {
        exec("ipfs add "+file, (error, stdout, stderr) => {
            if (error) {
                console.log(error);
                return error;
            }
            else{
                const fileIdentifier = stdout.split(" ")[1];
                console.log(fileIdentifier);
                resolve (fileIdentifier);
            }
        });
    });
}

async function ipfsGet(hash,outputFileName) {
    outputFileName = outputFileName.replace(/\s/g,"\\ ")
    return new Promise((resolve, reject) => {
        exec("ipfs get "+hash + " --output="+outputFileName, (error, stdout, stderr) => {
            if (error) {
                console.log(error);
                return error;
            }
            else{
                resolve( {"message":"file downloaded"});
            }
        });
    });
}

async function execShellCommand(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.warn(error);
            }
            resolve(stdout? stdout : stderr);
        });
    });
}

module.exports ={
    ipfsAdd,
    ipfsGet,
    execShellCommand
}
