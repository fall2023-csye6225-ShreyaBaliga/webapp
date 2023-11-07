#!/bin/bash

set -e

sudo apt update
sudo apt upgrade -y
sudo apt install -y nodejs npm unzip

# Download and install the Unified CloudWatch Agent
sudo wget https://s3.amazonaws.com/amazoncloudwatch-agent/debian/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb

# Remove the CloudWatch Agent package (deb file) after installation
sudo rm -f amazon-cloudwatch-agent.deb

sudo cp /tmp/webapp.zip /opt/webapp.zip
sudo groupadd csye6225
sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225
sudo unzip /opt/webapp.zip -d /opt/csye6225/
sudo rm -f /opt/webapp.zip
sudo chown -R csye6225:csye6225 /opt/csye6225/webapp
sudo chmod -R 770 /opt/csye6225/webapp

# sudo unzip /home/admin/webapp.zip -d /home/admin/
# sudo rm -f /home/admin/webapp.zip
    
# # Creating new user and giving ownership to the webapp directory
# sudo groupadd csye6225
# sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225
# sudo chown -R csye6225:csye6225 /home/admin/webapp
# sudo chmod -R 755 /home/admin/webapp


cd /opt/csye6225/webapp
sudo npm install
echo "Server setup completed!!"

sudo systemctl enable amazon-cloudwatch-agent
sudo systemctl start amazon-cloudwatch-agent

# sudo sh -c "echo '[Unit]
# Description= My NPM Service
# After=cloud-final.target


# [Service]
# User=csye6225
# EnvironmentFile=/etc/environment
# WorkingDirectory=/home/admin/webapp
# ExecStart=/usr/bin/node /home/admin/webapp/index.js
# Type=simple
# Restart=always


# [Install]
# WantedBy=cloud-init.target' | sudo tee /etc/systemd/system/webapp.service"


sudo mv /tmp/webapp.service /lib/systemd/system/webapp.service

# sudo sh -c "echo '[Unit]
# Description= My Cloudwatch agent service
# After=cloud-final.target


# [Service]
# User=csye6225
# ExecStart=/opt/aws/amazon-cloudwatch-agent/bin/start-amazon-cloudwatch-agent -a fetch-config -m onPremise -c /home/admin/webapp/cloudwatch-config.json -s
# Restart=always


# [Install]
# WantedBy=cloud-init.target' | sudo tee /etc/systemd/system/amazon-cloudwatch-agent.service"

sudo systemctl daemon-reload
sudo systemctl enable webapp.service
sudo systemctl start webapp.service
sudo systemctl status webapp.service