var AdmZip = require('adm-zip');
const fs = require('fs');
const { exec } = require("child_process");
const dep = require('./getDependencies')
// reading archives
var zip = new AdmZip("./data.zip");
var zipEntries = zip.getEntries(); // an array of ZipEntry records


zipEntries.forEach(function(zipEntry) {
    // console.log(zipEntry.toString()); // outputs zip entries information
    // if (zipEntry.entryName == "data/pandaspy.py") {
    if (zipEntry.entryName.includes(".py")) {
        console.log(zipEntry.getData().toString('utf8')); 
        zip.extractEntryTo(zipEntry.entryName, "./data_new", /*maintainEntryPath*/false, /*overwrite*/true);
    }
});
dep.getDependencies();
