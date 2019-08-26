var fs = require("fs");
var path = require("path");
var helper = require("./helper");
var stringDecoder = require("string_decoder").StringDecoder;
var lib = {};

const decoder = new stringDecoder();

lib.baseDir = path.join(__dirname, "/../.data/");

lib.create = function(dir, filename, data, callback) {
  var fromReq;
  var datafromFile;
  fs.open(lib.baseDir + dir + "/" + filename + ".json", "wx", function(
    err,
    fileDescriptor
  ) {
    console.log(fileDescriptor);

    if (!err && fileDescriptor) {
      var stringData = JSON.stringify(data);
      fs.writeFile(fileDescriptor, stringData, function(err) {
        if (!err) {
          fs.close(fileDescriptor, function(err) {
            if (!err) {
              callback(false);
            } else {
              callback("Error closing new file");
            }
          });
        } else {
          callback("Error writing to file");
        }
      });
    } else {
      fs.readFile(".data/users/users.json", "utf8", (err, dat) => {
        if (err) {
          console.log(err);
        } else {
          console.log("dat", dat);
          datafromFile = dat ? JSON.parse(dat) : [];
          fromReq = data;

          //   datafromFile.map(user => {
          const lastId = datafromFile.length
            ? datafromFile[datafromFile.length - 1].id
            : 0;
          fromReq[0].id = lastId ? lastId + 1 : 1;
          datafromFile.push(fromReq[0]);
          console.log(fromReq);

          const payload = JSON.stringify(datafromFile);
          fs.writeFile(".data/users/users.json", payload, "utf8", err => {
            if (err) {
              console.log(err);
            } else {
              console.log("User is registered Successfully");
            }
          });
          //   })
        }
      });
    }
  });
};

// lib.read = function (dir, filename, callback) {
//     fs.readFile('.data/users/users.json', 'utf-8',  function(err, data){
//       if(err){
//           callback(err)
//       }
//       else{
//           callback(data)
//       }
//     })

// }

// lib.readuser = function (dir, filename, id, callback){
//     fs.readFile('.data/users/users.json', 'utf-8', (err, data) =>{
//         const datar = JSON.parse(data)
//         datar.map(user => {
//             // let id = 2
//             if(user.id === id){
//                 callback(user)

//             }
//             return;
//         })

//     })
// }


lib.delete = function(dir, filename, id, data, callback) {
    fs.readFile(
      lib.baseDir + dir + "/" + filename + ".json",
      (err, datafromFile) => {
        const datar = JSON.parse(datafromFile);
        console.log(id)
        datar.map(user => {
          // let id = 2
          if (user.id === id) {
              // datar.splice(datafromFile[user])
              const index = 1 ? datar.indexOf(user) : datar.indexOf(user) + 1 
              console.log(index)
              if(index > -1 ){
                  datar.splice(user, 1) 
              }
              console.log(index)
              const test  = JSON.stringify(datar)
              console.log(test, "not removed")
              fs.writeFile(".data/users/users.json", test, "utf8", err => {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log("data is updated");
                  }
                });
            console.log(datar)
          }
          return;
        });
      }
    );
  };
  



lib.update = function(dir, filename, id, data, callback) {
    fs.readFile('.data/users/users.json', 'utf-8', (err, data) =>{
                console.log(data)
    })  
}
  




module.exports = lib;
