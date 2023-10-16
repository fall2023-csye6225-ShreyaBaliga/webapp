#!/bin/bash
    sudo apt-get update
    sudo apt-get upgrade -y

    sudo apt-get install postgresql postgresql-contrib -y
    sudo postgresql-setup initdb
    sudo sed -i 's/ident/md5/g' /var/lib/pgsql/data/pg_hba.conf

    sudo systemctl start postgresql
    sudo systemctl enable postgresql

    sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD '1234567890';"

    sudo service postgresql initdb


    sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'munnipammi';"
    sudo -u postgres psql -c "CREATE DATABASE health_check;"
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE health_check TO postgres;"

    sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/g" /etc/postgresql/<version>/main/postgresql.conf
    echo "host all all 0.0.0.0/0 md5" | sudo tee -a /etc/postgresql/<version>/main/pg_hba.conf

    sudo systemctl restart postgresql

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