FROM eclipse-temurin
# Docker file for SailRaceSignal-Dispatcher
# v1.0.0 Bela Bursan <burszan@gmail.com>
#

ARG PI4J_VERSION=3.0.1
ENV DEBIAN_FRONTEND=noninteractive

# Update and install needed stuff
RUN apt-get update &&\
    apt-get -y upgrade &&\
    apt-get -y install nano curl git wget unzip maven i2c-tools vim java-common libxi6 libxrender1 libxtst6

# Create user
RUN useradd -rm -d /home/dispatcher -s /bin/bash -g root -G sudo -u 1001 dispatcher

# Install Pi4J (needed for gpio's)
RUN mkdir -p /opt/pi4j &&\
    cd /tmp &&\
    wget https://github.com/Pi4J/download/raw/main/pi4j-${PI4J_VERSION}.zip -P /tmp &&\
    unzip -d /opt/pi4j /tmp/pi4j-${PI4J_VERSION}.zip

#RUN usermod -a -G gpio root && usermod -a -G adm root
WORKDIR /home/dispatcher

# Cleanup
RUN rm -rf /tmp/pi4j-${PI4J_VERSION}.zip
