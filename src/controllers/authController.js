const User = require("../models/userModel");
// Import and set up authorization to generate and validate token

exports.signUp = async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword, gender, jobRole, department, address } = req.body;

    try {
        if (!(firstName && lastName && email && password && gender && jobRole && department && address)) {
            throw new Error("Missing required field(s)");
        }

        // create a service to clean the client data

        // check if user email already exists in the db
        if (await User.emailExists(email)) throw new Error('Email already exists');

        // check that name must be at least 2 characters
        if(firstName.length < 2 || lastName.length < 2) throw new Error('Firstname and lastname must contain at least 2 characters');

        // check if the user password and confirmPassword match
        if(password !== confirmPassword) throw new Error('Passwords don\'t match');
        // check that gender is valid

        // check that department is valid

        // check that jobRole is valid

        // create a service that makes hashes for us to hash sensitive information. The hash salt should be stored in the app's env

        // create the user
        User.create(req.body)
            .then(obj => {
                const { firstname, id, avatar, _timestamp } = obj;
                res.status(201).json({
                    status: 'success',
                    data: {
                        message: 'User account successfully created',
                        token: 'otY$9+2134j4cvvbSF+7534n10340imvng996m57$',
                        userId: id,
                        firstName: firstname,
                        avatar: avatar,
                        timestamp: _timestamp
                    }
                });
            })

    } catch (error) {
        res.status(400).json({
            status: "error",
            error: error.message
        });
    }
};