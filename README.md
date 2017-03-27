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
  insert with_id ................................. 111 op/s
  insert with_guid ............................... 64 op/s
  insert with_timestamp .......................... 120 op/s
  insert with_datetime ........................... 63 op/s
```

[02_select.js](benchmark/02_select.js)
```
mysql select
  select with_timestamp .......................... 492 op/s
  select with_datetime ........................... 477 op/s
```

[03_char_vs_varchar.js](benchmark/03_char_vs_varchar.js)
```
mysql insert
  insert with_char ............................... 104 op/s
  insert with_varchar ............................ 100 op/s
  select with_char ............................... 299 op/s
  select with_varchar ............................ 289 op/s
```

[04_blob_vs_text.js](benchmark/04_blob_vs_text.js)
```
mysql insert
  insert with_text ............................... 104 op/s
  insert with_blob ............................... 106 op/s
  select with_text ............................... 165 op/s
  select with_blob ............................... 167 op/s
```

# contribute

1. add your test to benchmark dir
1. run $ make benchmark file=benchmark/xxx.js to run the benchmark
1. then send a pr to me, I would add the result to README.md

p.s. 

change `iterations` from `1000` to `100` if runs too slow.

# license

MIT

Donate via Alipay (通过支付宝捐赠)：

![qr](https://cloud.githubusercontent.com/assets/1890238/15489630/fccbb9cc-2193-11e6-9fed-b93c59d6ef37.png)

Follow me [@willin](https://github.com/willin)

Origin: <https://leader.js.cool/basic/db/mysql.html>
