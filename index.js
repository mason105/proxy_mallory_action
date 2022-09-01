const core = require('@actions/core');
// const github = require('@actions/github');
const exec = require('@actions/exec');


async function main() {
    await core.group('install pre-commit', async () => {
        // await exec.exec('pip', ['install', 'pre-commit']);
        await exec.exec('ls', []);
    });

}

main().catch((e) => core.setFailed(e.message));