#!/bin/bash
    sudo apt-get update
    sudo apt-get upgrade -y

    sudo apt-get update
    sudo apt-get install -y ca-certificates curl gnupg
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg

    NODE_MAJOR=20
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list

    sudo apt-get update
    sudo apt-get install nodejs -y

    sudo apt-get install unzip -y
    

    unzip /home/admin/webapp.zip -d /home/admin/webapp

    cd /home/admin/webapp/webapp


    npm install

    echo "Server setup completed!!"


    sudo sh -c "echo '[Unit]
    Description= My NPM Service
    After = cloud-final.target

    [Service]
    User=admin
    WorkingDirectory=/home/admin/webapp/webapp
    ExecStart=/usr/bin/node index.js
    Restart=always
    EnvironmentFile=/etc/environment

    [Install]
    WantedBy=cloud-init.target' | sudo tee /etc/systemd/system/webapp.service"
    
    sudo systemctl daemon-reload
    sudo systemctl enable webapp
    sudo systemctl start webapp
    sudo systemctl status webapp 