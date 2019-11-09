const request = require('request');

/**
 * An extension of the popular request module
 * @param { String } method - the http method. defaults to GET
 * @param { String } uri - the uri or endpoint
 * @param { Object } body - the data in json format
 * @param { Function } callback - a callback function called when
 * a response is returned
 */
module.exports = (method, uri, body, callback) => {
  const localBaseUri = 'http://127.0.0.1:3000';
  const localFullUri = `${localBaseUri}${uri}`;
  method = method.toLowerCase();
  const isRemoteUri = uri.startsWith('http') || uri.startsWith('https');
  uri = isRemoteUri ? uri : localFullUri;
  request[method]({
    uri: uri,
    body: body,
    json: true,
  }, callback);
};
