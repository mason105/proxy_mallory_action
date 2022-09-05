//https://github.com/docker/setup-buildx-action/issues/57
const core = require('@actions/core');
// const github = require('@actions/github');
const exec = require('@actions/exec');
const { config } = require('process');
const fs = require('fs');


async function main() {
    
    var host = core.getInput('host');
    var port = core.getInput('port');
    var user = core.getInput('user');
    var ssh_key = core.getInput('ssh_key');
    var proxy_url = core.getInput('proxy_url');

    console.log("start prepare config file")
    var m_config =
    {
        "id_rsa": "/tmp/id_rsa",
        "local_smart": ":1315",
        "local_normal": ":1316",
        "remote": "ssh://" + user + "@" + host + ":" + port,
        "blocked": proxy_url.split(",")
    }
    fs.writeFile('/tmp/m_config.json', JSON.stringify(m_config), err => {
        if (err) {
          console.error(err);
        }
        // file written successfully
    });


    var buff = Buffer.from(ssh_key, 'base64'); // Ta-da
    let p_key = buff.toString('ascii');
    console.log("start prepare id_rsa_key")
    fs.writeFile('/tmp/id_rsa', p_key, err => {
      if (err) {
        console.error(err);
      }
      // file written successfully
    });

    var commands = 
    [
        'go install github.com/justmao945/mallory/cmd/mallory@latest',
        "cat /tmp/id_rsa",
        "cat /tmp/m_config.json",
        // "mallory -config /tmp/m_config.json & "
    ];

    args = [];
    let myOutput = '';
    let myError = '';


    for (const command of commands) {
       console.log(command);
        await exec.exec(command, args, {
          listeners: {
            stdout: (data) => {
              console.log(data)
              myOutput += data.toString();
            },
            stderr: (data) => {
              console.log(data)
              myError += data.toString();
            },
          }
        })
        myOutput += "\r\n"
        myError += "\r\n"
    }

    console.log(myOutput)
    console.log(myError)
    // core.setOutput("time", time);
}

main().catch((e) => core.setFailed(e.message));