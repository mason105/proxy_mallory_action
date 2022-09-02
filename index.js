const core = require('@actions/core');
// const github = require('@actions/github');
const exec = require('@actions/exec');


async function main() {
    command = 'go get github.com/justmao945/mallory/cmd/mallory';
    args = [];
    let myOutput = '';
    let myError = '';
  
    await exec.exec(command, args, {
        listeners: {
          stdout: (data) => {
            myOutput += data.toString();
          },
          stderr: (data) => {
            myError += data.toString();
          },
        }
      })

      await exec.exec("mallory", args, {
        listeners: {
          stdout: (data) => {
            myOutput += data.toString();
          },
          stderr: (data) => {
            myError += data.toString();
          },
        }
      })


    console.log(myOutput)
    console.log(myError)

}

main().catch((e) => core.setFailed(e.message));