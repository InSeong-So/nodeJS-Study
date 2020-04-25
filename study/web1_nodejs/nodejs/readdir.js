let testFolder = '../data';
let fs = require('fs');

fs.readdir(testFolder, function(err, fileList){
   console.log(fileList);
});