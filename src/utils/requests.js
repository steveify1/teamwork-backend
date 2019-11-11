const request = require('request');

/**
 * An extension of the popular request module
 * @param { String } method - the http method. defaults to GET
 * @param { String } uri - the uri or endpoint
 * @param { Object } headers - request headers
 * @param { Object } body - the data in json format
 * @param { Function } callback - a callback function called when
 * @param { Object } auth - an object containing the bearer token. ('bearer': 'client token')
 * a response is returned
 */
module.exports = (method, uri, headers, body, callback, auth) => {
  const localBaseUri = 'http://127.0.0.1:3000';
  const localFullUri = `${localBaseUri}${uri}`;

  // test if the uri is a remote one or not
  const isRemoteUri = uri.startsWith(localBaseUri);
  uri = isRemoteUri ? uri : localFullUri;

  const options = {
    uri: uri,
    body: body,
    json: true,
  };

  // add headers to the options if the 'headers' argument is defined
  if (headers) {
    options.headers = Object.keys(headers).length ? headers : {};
  }

  // add authentication to the options if the 'auth' argument is defined
  if (auth) {
    options.auth = auth;
  }

  // put the HTTP method in lowercase
  method = method.toLowerCase();
  try {
    request[method](options, callback);
  } catch (e) {
    console.log(e);
  }
};
