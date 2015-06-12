/**
 * Copyright 2015 Telefonica Investigación y Desarrollo, S.A.U
 *
 * This file is part of fiware-tidoop (FI-WARE project).
 *
 * fiware-tidoop is free software: you can redistribute it and/or modify it under the terms of the GNU Affero
 * General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your
 * option) any later version.
 * fiware-tidoop is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the
 * implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License
 * for more details.
 *
 * You should have received a copy of the GNU Affero General Public License along with fiware-tidoop. If not, see
 * http://www.gnu.org/licenses/.
 *
 * For those usages not covered by the GNU Affero General Public License please contact with
 * francisco dot romerobueno at telefonica dot com
 */

/**
 * Http server for "Tidoop MR job library" REST API
 *
 * Author: frb
 */

// module dependencies
var Hapi = require('hapi');
var spawn = require('child_process').spawn;

// file imports
var config = require('../conf/tidoop-mr-lib-api.json');
var pjson = require('../package.json');

// other globals
var tidoopMRLibPath = config.tidoopMRLibPath;

// create a server with a host and port
var server = new Hapi.Server();

server.connection({ 
    host: 'localhost',
    port: config.port
});

// add routes
server.route({
    method: 'GET',
    path: '/version',
    handler: function (request, reply) {
        console.log("Request: GET /version");
        var response = '{version: ' + pjson.version + '}\n';
        console.log("Response: " + response);
        reply(response);
    } // handler
});

server.route({
    method: 'POST',
    path: '/tidoop/v1/filter',
    handler: function (request, reply) {
        // get the request parameters
        var input = request.query.input;
        var output = request.query.output;
        var regex = request.query.regex;
        console.log('Request: POST /tidoop/v1/filter?' +
            'input=' + input + '&output=' + output + '&regex=' + regex);

        // run the Filter MR job
        var job = spawn('hadoop jar ' + tidoopMRLibPath +
            ' com.telefonica.iot.tidoop.mrlib.Filter' +
            ' -libjars ' + tidoopMRLibPath,
            [input, output, regex]);
        var jobId = 12345;

        // create the response
        var response = '{job_name: filter, parameters: {' +
            'input: ' + input + ', ' +
            'output: ' + output + ', ' +
            'regex: ' + regex + '}, ' +
            'job_id: ' + jobId + '}\n';
        console.log("Response: " + response);

        // return the response
        reply(response);
    } // handler
});

// start the server
server.start(function(err) {
    if(err) {
        return console.log("Some error occurred during the starting of the Hapi server: " + err);
    } // if

    console.log("tidoop-mr-lib-api running at http://localhost:" + config.port);
});
