#!/bin/bash
#installs the neccesary stuff on the server(the raspi 4b)
# Copy/paste this file to the raspi and run it

USER="dispatcher"
PASS="Dispatcher2025"
GIT_TAG="v1.0.0"
HOST_NAME="signalrunner"


echo "Welcome to the install script for the server"
echo "  Installing neccesary packages"
sudo apt-get update && 
sudo apt-get -y DEBIAN_FRONTEND=noninteractive upgrade && sudo apt-get install -y git nano \
        apt-transport-https ca-certificates curl ntp wget binutils curl pigpio spi-tools systemd-timesyncd
sudo install -m 0755 -d /etc/apt/keyrings

#Add user and add it to sudoers
echo -e "\n Adding user stuff"
sudo useradd -m $USER && sudo passwd $USER
#sudo usermod -a -G sudo ${USER}
sudo usermod -a -G gpio ${USER}
sudo usermod -a -G video ${USER}
# Change the password for the user
sudo chpasswd <<EOF
$USER:$PASS
EOF
#sudo echo "${USER}:${PASS}" | chpasswd
yes '' | ssh-keygen -b 4096 -N '' > /dev/null
#ssh-keygen -t rsa -b 4096 -N '' <<<$'\n'

# Hostname
echo "Setting hostname -> ${HOST_NAME}"
sudo hostnamectl set-hostname ${HOST_NAME}

# Docker stuff
echo -e "\n Adding docker stuff"
sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc &&
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null &&
sudo apt-get update && sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin && \
sudo usermod -a -G docker ${USER}

# Enable spi
sudo dtparam spi=on
sudo dtparam audio=off
sudo dtparam i2s=off
sudo dtparam audio=off

# Adding network time sync stuff
echo -e "\n Enabling time/ntp stuff"
# https://blog.pishop.co.za/time-sync-from-the-network-on-the-raspberry-pi/
echo -e "\nexport TZ=\"Europe/Stockholm\"\ntimedatectl set-timezone Europe/Stockholm\n" >> ~/.bashrc
sudo timedatectl set-timezone Europe/Stockholm
sudo timedatectl set-ntp true
timedatectl
timedatectl timesync-status -a
# nn /etc/systemd/timesycd.conf -> #FallbackNTP=0.debian.pool.ntp.org 1.debian.pool.ntp.org 2.debian.pool.ntp.org 3.debian.pool.ntp.org
# nn /etc/systemd/timesycd.conf -> #FallbackNTP=0.se.pool.ntp.org 1.se.pool.ntp.org 2.se.pool.ntp.org 3.se.pool.ntp.org

# git stuff
echo "git stuff.."
echo "1. copy /home/${USER}/.ssh/id_rsa.pub to github first!!"
echo "2. after reboot log in as ${USER}"
echo "3. clone git to user home: git clone https://github.com/belabursan/RaceStartSignal.git"
echo "4. got to ~/RaceStartSignal/server"
echo "5. copy template.env to .env"
echo "6. edit .env, set needed parameters"
echo "7. run the server with docker: docker compose up/down (--build) (--detach)"
echo "8. Add autostart ->"
# autostart
sudo ln -s /home/buri/RaceStartSignal/host/signalrunner.service /etc/systemd/system/signalrunner.service

sleep 10
echo -e "\nRebooting in 10..."
sleep 10
#Reboot
echo -e "\n Rebooting the system"
sleep 1
sudo reboot
