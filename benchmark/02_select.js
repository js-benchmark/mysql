const mysql = require('mysql');
const config = require('../lib/config');
const { format } = require('../lib/common');

const connection = mysql.createConnection(config);
/* eslint no-extend-native:0 */
Date.prototype.format = format;

suite('mysql insert', () => {
  set('iterations', 1000);
  set('concurrency', 1);
  set('type', 'static');
  set('delay', 100);

  bench('select with_timestamp', (next) => {
    const sql = `SELECT * FROM \`with_timestamp\` WHERE \`timestamp\` > ${parseInt((new Date() / 1000) - (2 * 86400), 10)} AND \`timestamp\` < ${parseInt((new Date() / 1000) - 86400, 10)}`;
    connection.query(sql, next);
  });

  bench('select with_datetime', (next) => {
    const sql = `SELECT * FROM \`with_datetime\` WHERE \`datetime\` BETWEEN '${new Date(new Date() - (2 * 86400000)).format('yyyy-MM-dd hh:mm:ss')}' AND '${new Date(new Date() - 86400000).format('yyyy-MM-dd hh:mm:ss')}'`;
    connection.query(sql, next);
  });
});
