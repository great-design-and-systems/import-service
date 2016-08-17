'use strict';

var PORT = process.env.PORT || '3000';

function execute(app, io, http, callback) {
    var server = http.createServer(app);
    var sockets = io(server);
    server.listen(PORT);
    callback(undefined, sockets);
    console.log('Node app is running on port', PORT);
}

module.exports = execute;