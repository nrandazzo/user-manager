//Configuration File for SQL server -- Complete host, user , and password according to your server's mySQL settings and accessibilty, and Complete data columns according to the columns you will be operating on within the database
//also add hash function iteration count for the password hashing, default to 100,000 rounds
var exports = module.exports = {};

var mySqlConfig = { //Object Parameter for creating MySql connection
	host:'localhost', //if running on local host (Server's SQL)
	user:'',
	password:'',
	database:''
};

var hashIterations = 100000;

//export configurations to module index 
exports.serverConfig = function(){
	return mySqlConfig;
};
exports.hashIterations = function(){
	return hashIterations;
}
	
