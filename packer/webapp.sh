#!/bin/bash

set -e

sudo apt update
sudo apt upgrade -y
sudo apt install -y nodejs npm unzip


sudo unzip /home/admin/webapp.zip -d /home/admin/
sudo rm -f /home/admin/webapp.zip
    
# Creating new user and giving ownership to the webapp directory
sudo groupadd csye6225
sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225
sudo chown -R csye6225:csye6225 /home/admin/webapp
sudo chmod -R 755 /home/admin/webapp


cd /home/admin/webapp
sudo npm install
echo "Server setup completed!!"


sudo sh -c "echo '[Unit]
Description= My NPM Service
After=cloud-init.target
Requires=cloud-init.target

[Service]
User=csye6225
Type=simple
EnvironmentFile=/etc/environment
WorkingDirectory=/home/admin/webapp
ExecStart=/usr/bin/node /home/admin/webapp/index.js
Restart=always
RestartSec=10

[Install]
WantedBy=cloud-init.target' | sudo tee /etc/systemd/system/webapp.service"

sudo systemctl daemon-reload
sudo systemctl enable webapp
sudo systemctl start webapp
sudo systemctl status webapp