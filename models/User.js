const { dbConnect } = require("../configurations");
const {userValidator, loginSchema} = require('../validator');
const {hashSync, compareSync} = require('bcryptjs');

class User {
    constructor(userData) {
        this.userData = {...userData};
    };

    save(callback){
      dbConnect('users', async(db) => {
        try {
          const hashedPass = hashSync(this.userData['password'], 12);
          this.userData['password'] = hashedPass;
          await db.insertOne(this.userData);
          callback();
        } catch (error) {
          callback(error);
        }
      });
    }

    checkExistence() {
      return new Promise((resolve, reject) => {
        try{
        dbConnect('users', async(db) => {
          const user = await db.findOne({'$or':[{username:this.userData['username']},
          {email:this.userData['email']}]});

          if (!user) {
            resolve({
              check: false
            })
          } else if (this.userData['username'] === user.username) {
            resolve({
              check: true,
              message: 'this username is already use'
            })
          } else if (this.userData['email'] === user.email) {
            resolve({
              check: true,
              message: 'this email is already use'
            })
          }
        })
        } catch (err) {
          reject (err);
        }
      })
    }

    static validate(userData) {
      return userValidator.validate(userData);
    }

    static login(userData) {
      return new Promise((resolve, reject) => {
        
        // validation
        const validation = loginSchema.validate(userData);
        if(validation.error) {
          const error = new Error(validation.error.message);
          error.statusCode = 400;
          return resolve(error);
        }

        dbConnect('users', async(db) => {
          try {

            // find user on database
            const user = await db.findOne({'$or':[{username: userData['username']},
            {email: userData['username']}]}, {projection: {username: 1, password: 1}});

            // compare plain password dengan hashedPassword menggunakan 'compareSync'
            if (!user || !compareSync(userData['password'], user.password)) {
              const error = new Error('please enter valid username and password');
              error.statusCode = 404;
              return resolve(error);
            }
            resolve(user);
            
          } catch (err) {
            reject(err);
          }
        });
      });
    };
}
/*
User.login({
  username:'alfathan3',
  password:'Atan-123'
}).then(res => {
  console.log(res);
})

/*
const user = new User ({
    username: 'alfathanzzz',
    email: 'alfathandpa@gmail.com',
    password: 'l@21312',
    first_name: 'al',
    last_name: 'fathan'
});

user.checkExistence()
.then(check => {
  console.log(check);
})
.catch(err => console.log(err))*/

module.exports = User;