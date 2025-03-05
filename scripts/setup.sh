#!/bin/sh
# Setup script for SailRace server
# v1.0 Bela Bursan <burszan@gmail.com>
#
# https://github.com/codingforentrepreneurs/Pi-Awesome/blob/main/how-tos/Docker%20%26%20Docker%20Compose%20on%20Raspberry%20Pi.md
# https://pimylifeup.com/raspberry-pi-nodejs/
#

NODE_MAJOR=20
NODE_VERSION="v20.11.0"

HOME="/home/bub/BURI/project"
SSH_KEY_PATH="$HOME/RaceStartSignal/server/secret"

# Machine shall be armv7l or x64
MACHINE="$(uname -m)"

NODE_INST_DIR="/opt/nodejs"
NODE_FILE="node-$NODE_VERSION-linux-$MACHINE"
NODE_TAR="$NODE_FILE.tar.xz"
NODE_DOWNLOAD_LINK="https://nodejs.org/dist/$NODE_VERSION/$NODE_TAR"
NODE_GPG="https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key"


## Install neccessary libraries
function install_libs()
{
    echo "Installing libs"
    sudo apt-get update && \
    sudo apt-get upgrade && \
    sudo apt install -y wget curl nano ca-certificates gnupg openssl python3-pip \
    python3 build-essential apt-transport-https openssh-client
}


## Installs Docker and docker-compose
function install_docker()
{
    echo "Installing Docker and compose..."
    sudo apt remove docker-ce* && \
    sudo apt-get autoremove && \
    curl -sSL https://get.docker.com | sh && \
    sudo usermod -a -G docker $(whoami) && \
    sudo python3 -m pip install docker-compose
    echo "Installing Docker done"
}


## Install NodeJS from official repo (can be old)
function install_node_official()
{
    echo "Installing NodeJS from official repo"
    curl -fsSL ${NODE_GPG} | sudo gpg --dearmor -o /usr/share/keyrings/nodesource.gpg
    echo "deb [signed-by=/usr/share/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list
    sudo apt update
    sudo apt install nodejs
    V=$(node -v)
    echo "Installed Node $V"
}


## Install NodeJS by downloading from node.org
function install_node_download()
{
    echo "Installing NodeJS by downloading it"
    cd /tmp
    wget "$NODE_DOWNLOAD_LINK" &&
    tar -xf "$NODE_TAR" &&
    sudo mv "$NODE_FILE" ${NODE_INST_DIR} &&
    sudo ln -s ${NODE_INST_DIR}/bin/node /usr/bin/node;
    sudo ln -s ${NODE_INST_DIR}/bin/node /usr/sbin/node;
    sudo ln -s ${NODE_INST_DIR}/bin/node /sbin/node;
    sudo ln -s ${NODE_INST_DIR}/bin/node /usr/local/bin/node;
    sudo ln -s ${NODE_INST_DIR}/bin/npm /usr/bin/npm;
    sudo ln -s ${NODE_INST_DIR}/bin/npm /usr/sbin/npm;
    sudo ln -s ${NODE_INST_DIR}/bin/npm /sbin/npm;
    sudo ln -s ${NODE_INST_DIR}/bin/npm /usr/local/bin/npm;
    sudo ln -s ${NODE_INST_DIR}/bin/npx /usr/bin/npx;
    sudo ln -s ${NODE_INST_DIR}/bin/npx /usr/sbin/npx;
    sudo ln -s ${NODE_INST_DIR}/bin/npx /sbin/npx;
    sudo ln -s ${NODE_INST_DIR}/bin/npx /usr/local/bin/npx;
    sudo rm "$NODE_TAR"
    echo "Installing NodeJS $NODE_VERSION"
}


function install_keys()
{
    #ssh-keygen -b 2048 -t rsa -f $SSH_KEY_PATH/id_rsa -q -N ""
    echo "cd to dir ../server/rest/node/secret/"
    cd ../server/rest/node/secret/
    openssl dhparam -out $SSH_KEY_PATH/dh-strong.pem 2048
    echo "generating keys..."
    openssl req -x509 -newkey rsa:4096 -keyout $SSH_KEY_PATH/sailrace-key.pem -out $SSH_KEY_PATH/sailrace-cert.pem -days 3650
    echo "Don't forget to set the password in .env file!!"
}


# # # # # # # S T A R T # # # # # # # # # # # #
echo "Setup Sailrace server"
install_libs
install_docker
install_keys
#install_node_official
#install_node_download

