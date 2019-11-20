/**
 * This takes in an array of objects and an object (map). The function
 * uses the map to substitute keys in each object in the array where it finds
 * a matching key.
 * @param {Array} arrayOfObjects - an array of objects whose key(s) may be mapped
 * @param {Object} map - an object. Each key represents a target key that may (or may not)
 * exist in the objects in the array, while the value is the replacement of the key
 * in each object if there is a match.
 * @returns {Promise} - return a Promise object. Usually the promise will resolve into
 * an array of objects with the mapped keys and retained original values. The promise
 * is rejected if the array of object is empty.
 */
const keyMapper = (arrayOfObjects, map) => {
  const arrayOfObjectsWithMappedKeys = [];
  const mapKeys = Object.getOwnPropertyNames(map);
  let postType;

  /**
   * This process runs on exponential time complexity and can perform
   * badly over very long arrays of is the `map` object has a large number
   * of keys. So we wrap the process in a promise so as not to
   * block the event loop.
   */
  const promise = new Promise((resolve, reject) => {
    // check if `arrayOfObjects` is not an array and if it's empty. Reject the promise if true.
    if (!(arrayOfObjects instanceof Array)) {
      const error = new Error(`Expect 'arrayOfObject' to be of type Array, but got ${typeof arrayOfObjects}`);
      reject(error);
    }
    // Loop through each object in the array
    arrayOfObjects.forEach((obj) => {
      // Loop through the `mapKeys`
      mapKeys.forEach((key) => {
        /** check if a specified key in the `mapKeys` array is a key
         * in the object at this current iteration
        */
        if (key in obj) { // If `key` is found in the object at this current iteration
          // add the replacement key object
          obj[map[key]] = obj[key];

          // delete old key from the object
          delete obj[key];
        }
      });

      // check if the content of the object is a gif or an article, then map accordingly
      postType = obj.content.startsWith('http') ? 'url' : 'article';
      obj[postType] = obj.content;
      // delete obj.content;

      // push the new copy of the object into `arrayOfObjectsWithMappedKeys`
      arrayOfObjectsWithMappedKeys.push(obj);
    });

    // return the new `arrayOfObjectsWithMappedKeys`
    resolve(arrayOfObjectsWithMappedKeys);
  });

  // Finally we return the Promise object
  return promise;
};

// Exposing the keyMapper
module.exports = keyMapper;
