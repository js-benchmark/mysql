const uuid = require('uuid/v4');
const mysql = require('mysql');
const config = require('../lib/config');
const { query, format } = require('../lib/common');

const connection = mysql.createConnection(config);
/* eslint no-extend-native:0 */
Date.prototype.format = format;

suite('mysql insert', () => {
  set('iterations', 1000);
  set('concurrency', 1);
  set('type', 'static');
  set('delay', 100);

  before(async () => {
    connection.connect();
    const sqlCreate = [
      'CREATE TABLE IF NOT EXISTS `with_blob` (`id` int(11) unsigned NOT NULL AUTO_INCREMENT,`param` blob NOT NULL, PRIMARY KEY (`id`),KEY `param` (`param`(4))) ENGINE=InnoDB DEFAULT CHARSET=utf8;',
      'CREATE TABLE IF NOT EXISTS `with_text` (`id` int(11) unsigned NOT NULL AUTO_INCREMENT,`param` text NOT NULL, PRIMARY KEY (`id`),KEY `param` (`param`(4))) ENGINE=InnoDB DEFAULT CHARSET=utf8;'
    ].map(x => query(connection, x));
    const sqlTruncate = [
      'with_blob',
      'with_text'
    ].map(x => query(connection, `TRUNCATE TABLE \`${x}\`;`));
    await Promise.all(sqlCreate);
    await Promise.all(sqlTruncate);
  });

  bench('insert with_text', (next) => {
    let sql = 'INSERT INTO `with_text`(param) VALUES ';
    for (let i = 0; i < 1000; i += 1) {
      uuid(); // 公平耗时
      sql += `('${i}')`;
      if (i !== 999) {
        sql += ',';
      }
    }
    connection.query(sql, next);
  });

  bench('insert with_blob', (next) => {
    let sql = 'INSERT INTO `with_blob`(param) VALUES ';
    for (let i = 0; i < 1000; i += 1) {
      uuid(); // 公平耗时
      sql += `('${i}')`;
      if (i !== 999) {
        sql += ',';
      }
    }
    connection.query(sql, next);
  });

  bench('select with_text', (next) => {
    const sql = 'SELECT * FROM `with_text` WHERE `param` = \'100\' OR `param` = \'0\'';
    connection.query(sql, next);
  });

  bench('select with_blob', (next) => {
    const sql = 'SELECT * FROM `with_text` WHERE `param` = \'100\' OR `param` = \'0\'';
    connection.query(sql, next);
  });

  after(() => {
    connection.end();
  });
});
