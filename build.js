#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const execSync = require('child_process').execSync;
const multiline = require('multiline');

const matchaCommand = path.join(__dirname, './node_modules/.bin/matcha');
const benchmarkDir = path.join(__dirname, 'benchmark');
const readmeTemplate = _.template(fs.readFileSync(path.join(__dirname, 'README.template'), 'utf-8'));
const readmeLocate = path.join(__dirname, 'README.md');

let allBenchmarks = fs.readdirSync(benchmarkDir);
allBenchmarks = allBenchmarks.filter(fileName => _.endsWith(fileName, '.js'));

const benchmarkBlockTemplate = _.template(multiline(() => {
/*
[<%= filename %>](benchmark/<%= filename %>)
```
<%= benchmark_result %>
```
*/
}));

const result = [];

allBenchmarks.forEach((fileName) => {
  let output = execSync(`${matchaCommand} -R plain ./benchmark/${fileName}`).toString();

  // remove unnecessary output
  output = output.split('\n');
  _.range(5).forEach(() => {
    output.pop();
  });
  output = output.join('\n');
  // END remove unnecessary output

  const bmresult = benchmarkBlockTemplate({
    filename: fileName,
    benchmark_result: output
  });

  result.push(bmresult);
});

const readmeText = readmeTemplate({
  benchmark_result: result.join('\n\n')
});

fs.writeFileSync(readmeLocate, readmeText);
