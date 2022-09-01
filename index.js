const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');


await exec.exec('node', ['index.js', 'foo=bar']);