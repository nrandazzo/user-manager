# user-manager
Simple module for managing &amp; authenticating users in a SQL user database with PBKDF2 (SHA-512 derived) password storage protection

##Getting Started
Use the config.js file to set up with your SQL database

```javascript
var mySqlConfig = { 
	host:'localhost',
	user:'username',
	password:'password',
	database:'UserDirectory'
};
```
This module stores user passwords with the key derivation function 'PBKDF2' which uses a hashing algorithm (Defaulted to SHA-512, see below) and iterates over it n times to derive a final key, thus slowing down an attackers password cracking attempts in unison with the speed of your server doing the verification, helping to simplify this aspect of security as much as possible.  The iteration count is defaulted to '100,000', but can be modified on the config.js page according to the services needs. (See more below regarding the PBKDF2 feature)
```javascript
var hashIterations = 100000;
```
##How To Use
Initialize the module
```javascript
var userDb = require('user-manager');
```

Registering a new user
```javascript
userDb.registerUser(user, function(success){
  if(success)
    //user registered
  else
    //failure to register user
});
```
User object should contain column names for the data table and the corresponding fields
```javascript
var user = {
				username:'',
				password:'',
				email:'',
				first_name:'',
				last_name:'',
				phone:''
			};
```

Authenticating a User for Login
```javascript
userDb.authUser('username','password', function(verified){
  if(verified)
    //user has been verified, user/pass match
  else
    //login failed, invalid username, password
    });
```
Modifying a User Credential
```javascript
userDb.modifyUser('uname','column/field to alter','value to add/edit', function(success){
  if(success)
    //SQL operation Succesful
  else
    //SQL operation Failed
    });
```
All methods are designed to be asynchronous for registering, verifying and modifying users to work the way Node.js is intended to, which is the functions use callbacks to report back on their operations.  All methods are also designed to be protected from SQL-injection attacks, but bugs will be monitored for.  

##PBKDF2 Password Protection
The hashing function used to protect and verify passwords in this module is designed to be easy to understand, and pre set up to function properly in a modern computing enviornment.  The use of a key stretching function such as PBKDF2 takes a hash output such as one from SHA-512 used here, and re-iterates over it many more times (defaulted to 100,000), manipulating the speed at which the local server can verify a user for login, and the speed of an attacker attempting to crack the hash keys.
See this very useful article on iterations and optimizing hashing functions here http://security.stackexchange.com/questions/3959/recommended-of-iterations-when-using-pkbdf2-sha256

A timer variable (end) can be found within the key generating function genHash() on index.js.  This timer can report in milliseconds how long a key takes to generate, allowing you to set the iteration count to a happy medium of logging users in quickly but keeping security at an optimal level as well.
```javascript
function genHash(pass,salt,callback){
	var start = new Date().getMilliseconds();
	var hash = '';
	crypto.pbkdf2(pass, salt, iterations, 64, 'sha512', function(err, key) {//512 bit
	  if (err)
	    throw err;
	  hash = key.toString('hex');  // convert key to hex
	  var end = new Date().getMilliseconds()-start;
      console.log('Hashing Duration: '+ end);
	  callback(hash);
	});	
	
}
```

The output key length is meant to be configurable (set to 512 bits/64 Bytes for SHA-512 purposes) and a unique random hex salt of 128 bits is added to each password and stored in the database to protect against lookup and rainbow table attacks. 
See more on Password Salting here http://security.stackexchange.com/questions/17994/with-pbkdf2-what-is-an-optimal-hash-size-in-bytes-what-about-the-size-of-the-s
```javascript
var userSalt = crypto.randomBytes(16).toString('hex'); //128 bit Salt (16x8)
```

SHA-512 was chosen as the underlying hash function for password hashing, because it uses 64-bit arithmetic, while hash functions which rely more on 32-bit arithmetic are falling victim to more and more powerful GPU rigs that are able to operate 32-bit arithmetic extremely quickly (such as SHA-1**, MD5, etc.).  

The goal of the password hashing algorithm implemented in this module is not to stop any attacker, but to slow them down to the point where an attack should not be worth their time, and a key derivation function with an adjustable number of iterations can quickly adapt to increasing power on both the local hardware and attackers hardware.  <b>This function allows for strong protection of user passwords, but obviously does not protect against weak user generated passwords.  Please Remember This.  Weak Passwords are still easy to guess and the best defense is a strong password policy for your users </b>

  
  
