//https://github.com/docker/setup-buildx-action/issues/57
const core = require('@actions/core');
// const github = require('@actions/github');
const exec = require('@actions/exec');
const { config } = require('process');
const fs = require('fs');


function writeFile(path, content ){
  fs.writeFile(path ,content, err => {
    if (err) {
      console.error(err);
    }
    // file written successfully
});
}
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
    writeFile('/tmp/m_config.json',  JSON.stringify(m_config))

    console.log("start prepare id_rsa_key")
    var buff = Buffer.from(ssh_key, 'base64'); // Ta-da
    let p_key = buff.toString('ascii');
    writeFile('/tmp/id_rsa',  p_key)
    writeFile('/tmp/mallory.service',`
[Unit]
Description=HTTP/HTTPS proxy over SSH
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/mallory -config /tmp/m_config.json
ExecReload=/usr/local/bin/mallory -reload
Restart=always

[Install]
WantedBy=default.target
    `)

    var commands = 
    [
        'go install github.com/justmao945/mallory/cmd/mallory@latest',
        "cat /tmp/id_rsa",
        "cat /tmp/m_config.json",
        "echo $GOPATH",
        "mkdir -p /usr/local/bin/",
        "sudo cp /tmp/mallory.service /lib/systemd/system/mallory.service",
        "sudo cp /home/runner/go/bin/mallory /usr/local/bin/mallory",
        "sudo service  mallory start",
        "sudo service  mallory status"
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
