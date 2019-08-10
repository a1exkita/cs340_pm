ar mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_kitaa',
  password        : '1942',
  database        : 'cs340_kitaa'
});

module.exports.pool = pool;
