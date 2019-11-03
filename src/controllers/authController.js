// Import the User Model
// Import and set up authorization to generate and validate token

exports.signUp = async (req, res) => {
    const { firstName, lastName, email, password, gender, jobRole, department, address } = req.body;

    try {
        if (!(firstName && lastName && email && password && gender && jobRole && department && address)) {
            throw new Error("Missing data field(s)");
        }
        // Process the user's data and post to the DB.

        // send response
        res.status(201).json({
            status: 'success',
            data: {
                message: 'User account successfully created',
                token: 'String',
                userId: 2345,
                firstName: firstName
            }
        });

    } catch (error) {
        res.status(400).json({
            status: "error",
            error: error.message
        });
    }
};