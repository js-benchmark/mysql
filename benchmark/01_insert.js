const uuid = require('uuid/v4');
const mysql = require('mysql');
const config = require('../lib/config');
const { query } = require('../lib/common');

const connection = mysql.createConnection(config);

suite('mysql insert', () => {
  set('iterations', 100);
  set('concurrency', 1);
  set('type', 'static');
  set('delay', 100);

  before(async () => {
    const sqlCreate1 = 'CREATE TABLE IF NOT EXISTS `with_id` (`id` int(11) unsigned NOT NULL AUTO_INCREMENT,`param` int(11) unsigned NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;';
    const sqlCreate2 = 'CREATE TABLE IF NOT EXISTS `with_guid` (`id` char(40) NOT NULL DEFAULT \'\',`param` int(11) unsigned NOT NULL,  PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;';
    const sqlTruncate1 = 'TRUNCATE TABLE `with_id`;';
    const sqlTruncate2 = 'TRUNCATE TABLE `with_guid`;';
    connection.connect();
    await query(connection, sqlCreate1);
    await query(connection, sqlCreate2);
    await query(connection, sqlTruncate1);
    await query(connection, sqlTruncate2);
  });

  bench('node-uuid', () => {
    uuid();
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

  bench('insert with_id', (next) => {
    let sql = 'INSERT INTO `with_id`(param) VALUES ';
    for (let i = 0; i < 1000; i += 1) {
      sql += `(${i})`;
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
