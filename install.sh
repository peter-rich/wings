# !/bin/bash
#!/bin/bash
# Ubuntu 18.04 LTS Minimal - amd64 bionic minimal image built on 2019-07-23
# Access scopes: Allow full access to all Cloud APIs
# Node version: v8.16.0
# Install python2.7 first if it is not installed: sudo apt install python2.7
sudo apt install python-pip
# Install dsub
git clone https://github.com/DataBiosphere/dsub
cd dsub
python setup.py install
source bash_tab_complete
cd ../
sudo rm -rf dsub
sudo apt install unzip
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
# Install project
cd ~
mkdir projects
cd projects
wget https://github.com/StanfordBioinformatics/wings/archive/dev.zip
unzip dev.zip
rm dev.zip
## Install frontend dependencies
cd wings-dev/new
npm install cjs-to-es6 -g
sh scripts/server-init.sh
cd js
npm i
npm run build
## Install backend dependencies
cd ../
npm i
## Use forever to run server as a daemon
npm install forever -g
sudo forever start server.js