const core = require('@actions/core');
// const github = require('@actions/github');
const exec = require('@actions/exec');


async function main() {

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
    options.cwd = './lib';

    await core.group('install pre-commit', async () => {
        // await exec.exec('pip', ['install', 'pre-commit']);
        await exec.exec('ls', [], options);
    });

}

main().catch((e) => core.setFailed(e.message));