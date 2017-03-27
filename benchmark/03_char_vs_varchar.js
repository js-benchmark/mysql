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
      'CREATE TABLE IF NOT EXISTS `with_varchar` (`id` int(11) unsigned NOT NULL AUTO_INCREMENT,`param` varchar(10) NOT NULL DEFAULT \'\', PRIMARY KEY (`id`), KEY `param` (`param`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;',
      'CREATE TABLE IF NOT EXISTS `with_char` (`id` int(11) unsigned NOT NULL AUTO_INCREMENT,`param` char(10) NOT NULL DEFAULT \'\', PRIMARY KEY (`id`), KEY `param` (`param`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;'
    ].map(x => query(connection, x));
    const sqlTruncate = [
      'with_varchar',
      'with_char'
    ].map(x => query(connection, `TRUNCATE TABLE \`${x}\`;`));
    await Promise.all(sqlCreate);
    await Promise.all(sqlTruncate);
  });

  bench('insert with_char', (next) => {
    let sql = 'INSERT INTO `with_char`(param) VALUES ';
    for (let i = 0; i < 1000; i += 1) {
      uuid(); // 公平耗时
      sql += `('${i}')`;
      if (i !== 999) {
        sql += ',';
      }
    }
    connection.query(sql, next);
  });

  bench('insert with_varchar', (next) => {
    let sql = 'INSERT INTO `with_varchar`(param) VALUES ';
    for (let i = 0; i < 1000; i += 1) {
      uuid(); // 公平耗时
      sql += `('${i}')`;
      if (i !== 999) {
        sql += ',';
      }
    }
    connection.query(sql, next);
  });

  bench('select with_char', (next) => {
    const sql = 'SELECT * FROM `with_char` WHERE `param` = \'100\' OR  `param` = \'0\'';
    connection.query(sql, next);
  });

  bench('select with_varchar', (next) => {
    const sql = 'SELECT * FROM `with_char` WHERE `param` = \'100\' OR  `param` = \'0\'';
    connection.query(sql, next);
  });

  after(() => {
    connection.end();
  });
});
