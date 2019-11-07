// Import all database schemas here and create
const userSchema = require('./schemas/userSchema');
const articleSchema = require('./schemas/articleSchema');

const allSchemas = [
    userSchema(),
    articleSchema()
];

// This function is going to generate a table for each Schema in our app
module.exports = async () => {
    console.log('Migrating');
    try{
        await Promise.all(allSchemas);
        console.log('Done with migration');
    } catch(e) {
        console.log(`Beep beep ::: ${e}`);
    }
};
