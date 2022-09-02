const core = require('@actions/core');
// const github = require('@actions/github');
const exec = require('@actions/exec');
const { config } = require('process');
const { json } = require('stream/consumers');
const fs = require('fs');


async function main() {
    
    const host = core.getInput('host');
    const port = core.getInput('port');
    const user = core.getInput('user');
    const ssh_key = core.getInput('ssh_key');
    const proxy_url = core.getInput('proxy_url');


    command = 'go install github.com/justmao945/mallory/cmd/mallory@latest';
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

    var buff = Buffer.from(ssh_key, 'base64'); // Ta-da
    let p_key = buff.toString('ascii');

    fs.writeFile('/tmp/id_rsa', p_key, err => {
      if (err) {
        console.error(err);
      }
      // file written successfully
    });

    config=
    {
        "id_rsa": "/tmp/id_rsa",
        "local_smart": ":1315",
        "local_normal": ":1316",
        "remote": "ssh://" + user + "@" + host + ":" + port,
        "blocked": proxy_url.split(",")
    }

      
      fs.writeFile('/tmp/m_config.json', JSON.stringify(config), err => {
        if (err) {
          console.error(err);
        }
        // file written successfully
      });
      command = " "

      await exec.exec("cat /tmp/id_rsa", args, {
        listeners: {
          stdout: (data) => {
            myOutput += data.toString();
          },
          stderr: (data) => {
            myError += data.toString();
          },
        }
      })

      await exec.exec("cat /tmp/m_config.json", args, {
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