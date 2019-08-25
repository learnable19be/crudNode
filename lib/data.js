var fs = require('fs');
var path = require('path');
var helper = require('./helper');
var stringDecoder = require('string_decoder').StringDecoder;
var lib = {};

const decoder = new stringDecoder


lib.baseDir = path.join(__dirname, '/../.data/');

lib.create = function (dir, filename, data, callback) {
    var fromReq;
    var datafromFile;
    fs.open(lib.baseDir + dir + '/' + filename + '.json', 'wx', function (err, fileDescriptor) {
        console.log(fileDescriptor)

        if (!err && fileDescriptor) {
            var stringData = JSON.stringify(data);
            fs.writeFile(fileDescriptor, stringData, function (err) {
                if (!err) {
                    fs.close(fileDescriptor, function (err) {
                        if (!err) {
                            callback(false);
                        } else {
                            callback("Error closing new file");
                        }
                    })
                } else {
                    callback("Error writing to file");
                }
            })
        } else {
            fs.readFile('.data/users/users.json', (err, dat) => {
                if(err){
                  console.log(err)
                }
                else{
                  const  got = decoder.write(dat)
                  datafromFile = JSON.parse(got)
                  fromReq = data;
                  datafromFile.map(user => {
                      if(user.id === fromReq[0].id){
                          console.log("user exist")
                      }
                      else{
                          datafromFile.push(fromReq[0])
                        //   callback("Continue", datafromFile)
                      }
                      const payload = JSON.stringify(datafromFile)
                      fs.writeFile('.data/users/users.json', payload, 'utf8', (err)=>{
                        if(err){
                            console.log(err)
                        }
                        else{
                            console.log("User is registered Successfully")
                        }
                      })
                  })
            }
              })
                
        }
    })

}

lib.read = function (dir, filename, callback) {
    fs.readFile(lib.baseDir + dir + '/' + filename + '.json','utf-8',  function(err, data){
        if(!err && data){
            callback(false, helper.parsejsonObject(data));
        }else{
            callback(err, data);
        }
    })

}

lib.update = function (dir, filename,  callback) {
    fs.readFile(lib.baseDir + dir + '/' + filename + '.json', (err, data) => {
        if(err){
            callback(err, false)
        }
        else{
            data = decoder.write(data)
            callback(data, true)
        }
    })
}

lib.delete = function (dir, filename, callback) {
    fs.open(lib.baseDir + dir + '/' + filename + '.json', 'wx', (err) => {
        if(!err){
            callback(true)
        }
        else{
            callback(false)
        }
    })
}

module.exports = lib;