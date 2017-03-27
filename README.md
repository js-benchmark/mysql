# js-benchmark/mysql

:heart_eyes: Writing High Performance JavaScript

# env

* platform: OS X 10.12.3. MacBook Pro (15-inch, Late 2016 with Touch Bar)
* cpu: 2.7 GHz Intel Core i7
* Node.js: v7.7.1
* v8: 5.5.372.41

# benchmark

[01_insert.js](benchmark/01_insert.js)
```
mysql insert
  node-uuid ...................................... 58,475 op/s
  insert with_id ................................. 251 op/s
  insert with_guid ............................... 88 op/s
  insert with_timestamp .......................... 138 op/s
  insert with_datetime ........................... 68 op/s
```

# contribute

1. add your test to benchmark dir
1. run $ make benchmark file=benchmark/xxx.js to run the benchmark
1. then send a pr to me, I would add the result to README.md

# license

MIT

Donate via Alipay (通过支付宝捐赠)：

![qr](https://cloud.githubusercontent.com/assets/1890238/15489630/fccbb9cc-2193-11e6-9fed-b93c59d6ef37.png)

Follow me [@willin](https://github.com/willin)

Origin: <https://leader.js.cool/basic/db/mysql.html>
