#!/bin/bash

# Cleans / removes docker volumes 
docker volume rm $(docker volume ls -q)

# Cleans the docker cache.
docker system prune -a

# Removes the Docker and Docker compose 
sudo apt-get remove docker docker-engine docker.io containerd runc
sudo apt-get purge docker-ce docker-ce-cli containerd.io
sudo rm -rf /var/lib/docker
sudo rm -rf /var/lib/containerd
sudo rm /usr/local/bin/docker-compose