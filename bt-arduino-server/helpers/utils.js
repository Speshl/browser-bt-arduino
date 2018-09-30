function checkLogin(User, username, password){
    return new Promise((resolve, reject) => {
        console.log(username);
        User.findOne({username: username},(err, user) => {
            if(err){
                console.log("Error: "+err);
                reject(err);
            }else{
                user.comparePassword(password, (err, isMatch) => {
                    if(err){
                        console.log("Error: "+err);
                        reject(err);
                    }else{
                        resolve(isMatch);
                    }
                });
            }
        });
    });
}

function createLogin(User, username, password){
    return new Promise((resolve, reject) => {
        User.findOne({username: username},(err, user) => {
            if(err){
                console.log("Error: "+err);
                reject(err);
            }else if(user){
                console.log("Account with that username already exists!");
                reject("Duplicate username");
            }else{
                let newUser = new User({
                    username: username,
                    password: password
                });
                newUser.save((err) => {
                    if(err){
                        console.log("Error: "+err);
                        reject(err);
                    }else{
                        console.log("User successfully created");
                        resolve(true);
                    }
                });
            }
        });
    });
}

module.exports = {
    "checkLogin": checkLogin,
    "createLogin": createLogin
};