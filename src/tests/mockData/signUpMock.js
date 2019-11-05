module.exports.validEntries = {
    "firstName" : "rositta",
	"lastName" : "love",
	"email" : "rosesweet@gmail.com",
	"password" : "mypassword",
	"confirmPassword": "mypassword",
	"gender" : "female",
	"jobRole" : "front end developer",
	"department" : "marketing",
	"address" : "carlifonia, usa"
}

module.exports.invalidFirstName = {
    "firstName": "r",
    "lastName": "nnam",
    "email": "invalidfirstname@gmail.com",
	"password" : "mypassword",
	"confirmPassword": "mypassword",
    "gender": "male",
    "jobRole": "graphics",
    "department": "marketing",
    "address": "3, sinclair close, okokomaiko",
}
module.exports.invalidLastName = {
    "firstName": "steve",
    "lastName": "n",
    "email": "invalidlastname@gmail.com",
	"password" : "mypassword",
	"confirmPassword": "mypassword",
    "gender": "male",
    "jobRole": "graphics",
    "department": "marketing",
    "address": "3, sinclair close, okokomaiko",
}

module.exports.emailExists = {
    "firstName" : "rositta",
	"lastName" : "love",
	"email" : "rosesweet@gmail.com",
	"password" : "mypassword",
	"confirmPassword": "mypassword",
	"gender" : "female",
	"jobRole" : "front end developer",
	"department" : "marketing",
	"address" : "carlifonia, usa"
}

module.exports.missingRequiredField = {
    "firstName": "steve",
    "lastName": "nnam",
    "email": "teamworkmail@gmail.com",
	"password" : "mypassword",
	"confirmPassword": "mypassword",
    "gender": "male",
    "jobRole": "",
    "department": "marketing",
    "address": "3, sinclair close, okokomaiko",
}

module.exports.passwordMismatch = {
    "firstName": "steve",
    "lastName": "nnam",
    "email": "teamworkmail@gmail.com",
	"password" : "mypassword",
	"confirmPassword": "mypassword1",
    "gender": "male",
    "jobRole": "front end developer",
    "department": "marketing",
    "address": "3, sinclair close, okokomaiko",
}
