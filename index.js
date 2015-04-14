var config = require('./config');
var sqlConfig = config.serverConfig();  
var iterations = config.hashIterations(); //iterations for password hashing
var mysql = require('mysql');
var crypto = require('crypto');
var connection = mysql.createConnection(sqlConfig);
var exports = module.exports = {};

//Connect to your SQL Database
connection.connect(function(err){
	if(err){
		console.error('error connecting: ' + err.stack);
		return;
	}
	console.log('connected as id' + connection.threadId);
});

//Select user from database by username
function getUser(username,callback){
	var sql = 'SELECT * FROM user WHERE username='+ connection.escape(username);
	var user = {};
	connection.query(sql, function(err, rows, fields) {
	    if (err) throw err;
	    for (var i in rows) {
			user = {
				username:rows[i].username,
				password:rows[i].password,
				salt:rows[i].salt.
				email:rows[i].email,
				first_name:rows[i].first_name,
				last_name:rows[i].last_name,
				phone:rows[i].tele
			};
	    }
	});
	callback(user);
}

//Generate a hash for the User Password (100,000 pbkdf2 iterations)
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

//Register A User
exports.registerUser = function(user,callback){ 
	var userSalt = crypto.randomBytes(16).toString('hex'); //128 bit Salt (16x8)
	genHash(userVar.pass,salt, function(hash){
		var userHashed = {
			email:user.email,
			username:user.username,
			first_name:user.firstName,
			last_name:user.lastName,
			phone:user.tele,
			salt:userSalt,
			password:hash	 
			};
		var sql = 'INSERT INTO user VALUES('+connection.escape(userHashed)+')';
		connection.query(sql, function(err, rows, fields) {
			    if (err){
					 throw err;
					 callback(false);
				 }
				 else callback(true);
			 });
		});	
}

// Authenticate a user login ---> change callback to return user also if necessary
exports.authUser = function(username,pass,callback){
	getUser(username, function(user){
		genHash(pass,user.salt,function(hash){
			if(user.password === hash) 
				callback(true); //user verified
			else
				callback(false); //login failed
		});
	}); 
}

//Modify a User field
exports.modifyUser = function(user,field,value,callback){
	var sql = 'UPDATE user SET '+connection.escape(field)+'='+connection.escape(value)
	+' WHERE username='+connection.escape(user.username);
	connection.query(sql, function(err, rows, fields) {
		    if (err){
				 throw err;
				 callback(false);
			 }
			 else callback(true);
		 });
}

