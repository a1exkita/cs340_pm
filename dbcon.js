var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_chewm',
  password        : '3173',
  database        : 'cs340_chewm'
});

module.exports.pool = pool;
