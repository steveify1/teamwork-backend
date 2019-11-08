exports.initialSignUp = {
    "firstName" : "rositta",
	"lastName" : "love",
	"email" : "roseslove@gmail.com",
	"password" : "mypassword",
	"confirmPassword": "mypassword",
	"gender" : "female",
	"jobRole" : "front end developer",
	"department" : "marketing",
    "address" : "carlifonia, usa"
}

exports.validEntries = {
    "email":"roseslove@gmail.com",
    "password":"mypassword",
};

exports.noEmailField = {
    "email": "",
    "password": "mypassword",
};

exports.noPasswordField = {
    "email": "roseslove@gmail.com",
    "password": "",
};

exports.nonExistentEmail = {
    "email": "randomemail@gmail.com",
    "password": "mypassword",
};

exports.wrongPassword = {
    "email": "roseslove@gmail.com",
    "password": "mypassword1",
};
