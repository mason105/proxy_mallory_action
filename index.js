const core = require('@actions/core');
// const github = require('@actions/github');
const exec = require('@actions/exec');


async function main() {
    command = 'ls';
    args = [];
    let myOutput = '';
    let myError = '';
  
    return {
      code: await exec.exec(command, args, {
        listeners: {
          stdout: (data) => {
            myOutput += data.toString();
          },
          stderr: (data) => {
            myError += data.toString();
          },
        }
      }),
      stdout: myOutput,
      stderr: myError,
    };

    // await core.group('install pre-commit', async () => {
    //     // await exec.exec('pip', ['install', 'pre-commit']);
    //     await exec.exec('ls', [], await exec(cmd, [], {
    //         cwd,
    //         listeners: {
    //           stdout: (data: Buffer) => {
    //             myOutput += data.toString().trim();
    //           },
    //           stderr: (data: Buffer) => {
    //             myError += data.toString().trim();
    //           }
    //         }
    //       }););
    // });

}

main().catch((e) => core.setFailed(e.message));