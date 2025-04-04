#!/bin/bash
#installs the neccesary stuff on the server
USER="test"
PASS="test"

echo "Welcome to the install script for the server"
echo "  Installing neccesary packages"
sudo apt-get update && sudo apt-get install -y apt-transport-https ca-certificates curl ntp wget binutils curl yes
sudo install -m 0755 -d /etc/apt/keyrings

#Add user and add it to sudoers
echo -e "\n Adding user stuff"
sudo useradd -m $USER && sudo passwd $USER
sudo usermod -a -G sudo ${USER} && sudo usermod -a -G gpio ${USER}
# Change the password for the user
sudo chpasswd <<EOF
$USER:$PASS
EOF
#sudo echo "${USER}:${PASS}" | chpasswd
yes '' | ssh-keygen -b 4096 -N '' > /dev/null
#ssh-keygen -t rsa -b 4096 -N '' <<<$'\n'

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

# Adding ntp stuff
echo -e "\n Adding ntp stuff"
sudo service ntp stop
sudo ntpd -gq
sudo service ntp start

#Reboot
echo -e "\n Rebooting the system"
sleep 2
sudo reboot
