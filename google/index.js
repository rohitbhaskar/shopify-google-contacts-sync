const authCallback = require('./authCallback');
const auth = require('./auth');

let google = {};
google.auth = auth;
google.authCallback = authCallback;

module.exports = google;