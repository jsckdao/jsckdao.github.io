/**
 * 
 */

var express = require('express'),
    path = require('path');

var app = express();

app.use('/', express.static(path.join(require.main.filename, '../../')));

app.listen(9094);
