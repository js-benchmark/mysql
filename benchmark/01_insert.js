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
      'CREATE TABLE IF NOT EXISTS `with_id` (`id` int(11) unsigned NOT NULL AUTO_INCREMENT,`param` int(11) unsigned NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;',
      'CREATE TABLE IF NOT EXISTS `with_guid` (`id` char(40) NOT NULL DEFAULT \'\',`param` int(11) unsigned NOT NULL,  PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;',
      'CREATE TABLE IF NOT EXISTS `with_timestamp` (`id` int(11) unsigned NOT NULL AUTO_INCREMENT,`timestamp` int(10) unsigned DEFAULT NULL,PRIMARY KEY (`id`),KEY `timestamp`(`timestamp`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;',
      'CREATE TABLE IF NOT EXISTS `with_datetime` (`id` int(11) unsigned NOT NULL AUTO_INCREMENT,`datetime` datetime NOT NULL,PRIMARY KEY (`id`),KEY `datetime` (`datetime`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;'
    ].map(x => query(connection, x));
    const sqlTruncate = [
      'with_id',
      'with_guid',
      'with_timestamp',
      'with_datetime'
    ].map(x => query(connection, `TRUNCATE TABLE \`${x}\`;`));
    await Promise.all(sqlCreate);
    await Promise.all(sqlTruncate);
  });

  bench('insert with_id', (next) => {
    let sql = 'INSERT INTO `with_id`(param) VALUES ';
    for (let i = 0; i < 1000; i += 1) {
      uuid(); // 公平耗时
      sql += `(${i})`;
      if (i !== 999) {
        sql += ',';
      }
    }
    connection.query(sql, next);
  });

  bench('insert with_guid', (next) => {
    let sql = 'INSERT INTO `with_guid`(id,param) VALUES ';
    for (let i = 0; i < 1000; i += 1) {
      sql += `('${uuid()}',${i})`;
      if (i !== 999) {
        sql += ',';
      }
    }
    connection.query(sql, next);
  });

  bench('insert with_timestamp', (next) => {
    let sql = 'INSERT INTO `with_timestamp`(timestamp) VALUES ';
    for (let i = 0; i < 1000; i += 1) {
      sql += `(${parseInt((new Date() / 1000) - (i * 86400), 10)})`;
      if (i !== 999) {
        sql += ',';
      }
    }
    connection.query(sql, next);
  });

  bench('insert with_datetime', (next) => {
    let sql = 'INSERT INTO `with_datetime`(datetime) VALUES ';
    for (let i = 0; i < 1000; i += 1) {
      sql += `('${new Date(new Date() - (i * 86400000)).format('yyyy-MM-dd hh:mm:ss')}')`;
      if (i !== 999) {
        sql += ',';
      }
    }
    connection.query(sql, next);
  });

  after(() => {
    connection.end();
  });
});
