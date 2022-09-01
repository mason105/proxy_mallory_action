const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');

let myOutput = '';
let myError = '';

const options = {};
options.listeners = {
  stdout: (data: Buffer) => {
    myOutput += data.toString();
  },
  stderr: (data: Buffer) => {
    myError += data.toString();
  }
};


await exec.exec('git', ['rev-parse', '--short', 'HEAD'], options);