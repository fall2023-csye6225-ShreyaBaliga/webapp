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
After=network.target

[Service]
User=csye6225
Type=simple
EnvironmentFile=/etc/environment
WorkingDirectory=/home/admin/webapp
ExecStart=/usr/bin/node /home/admin/webapp/index.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target' | sudo tee /etc/systemd/system/webapp.service"

sudo systemctl daemon-reload
sudo systemctl enable webapp
sudo systemctl start webapp
sudo systemctl status webapp