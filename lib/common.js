const getDefer = () => {
  const deferred = {};
  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  return deferred;
};

exports.getDefer = getDefer;

exports.query = (connection, sql) => {
  const deferred = getDefer();
  connection.query(sql, (error, results) => {
    if (error) {
      deferred.reject(error);
    } else {
      deferred.resolve(results);
    }
  });
  return deferred.promise;
};

exports.format = function (fmt) { // author: meizz
  const o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (`${this.getFullYear()}`).substr(4 - RegExp.$1.length));
  /* eslint no-restricted-syntax:0 */
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length)));
  }
  return fmt;
};
