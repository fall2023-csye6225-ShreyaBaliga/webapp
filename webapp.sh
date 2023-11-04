#!/bin/bash

set -e

sudo apt update
sudo apt upgrade -y
sudo apt install -y nodejs npm unzip

# Download and install the Unified CloudWatch Agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/debian/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb

# Remove the CloudWatch Agent package (deb file) after installation
sudo rm -f amazon-cloudwatch-agent.deb

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
After=cloud-final.target


[Service]
User=csye6225
EnvironmentFile=/etc/environment
WorkingDirectory=/home/admin/webapp
ExecStart=/usr/bin/node /home/admin/webapp/index.js
Type=simple
Restart=always


[Install]
WantedBy=cloud-init.target' | sudo tee /etc/systemd/system/webapp.service"

sudo systemctl daemon-reload
sudo systemctl enable webapp
sudo systemctl start webapp
sudo systemctl status webapp
sudo systemctl enable amazon-cloudwatch-agent
sudo systemctl start amazon-cloudwatch-agent