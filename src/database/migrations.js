// Import all database schemas here and create
const userSchema = require('./schemas/userSchema');
const articleSchema = require('./schemas/articleSchema');
const commentSchema = require('./schemas/commentSchema');
const gifSchema = require('./schemas/gifSchema');
const categorySchema = require('./schemas/categorySchema');
// const postTypeSchema = require('./schemas/postTypeSchema');
const categoryModel = require('./models/categoryModel');

// This function is going to generate a table for each Schema in our app
module.exports = async () => {
  console.log('Migrating');
  try {
    await userSchema();
    await categorySchema();
    await categoryModel.populate(); // Populates the 'categories' table
    // await postTypeSchema();
    await articleSchema();
    await commentSchema();
    await gifSchema();

    // populate default tables
    console.log('Done with migration');
  } catch (e) {
    console.log(`An Error Occurred::: ${e}`);
  }
};
