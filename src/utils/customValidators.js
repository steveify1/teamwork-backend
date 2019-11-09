// This takes the user input as an object and returns true if a field has no data
exports.hasEmptyField = (clientData) => Object.values(clientData).filter((datum) => datum === '').length;
