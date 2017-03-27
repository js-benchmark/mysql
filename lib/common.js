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

