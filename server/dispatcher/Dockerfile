FROM eclipse-temurin
# Docker file for SailRaceSignal-Dispatcher
# v1.0.0 Bela Bursan <burszan@gmail.com>
#
#https://maven.apache.org/guides/getting-started/maven-in-five-minutes.html

ARG PI4J_VERSION=3.0.1
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ="Europe/Stockholm"
RUN date

# Update and install needed stuff
RUN apt-get update &&\
    apt-get -y upgrade &&\
    apt-get -y install nano wget unzip maven i2c-tools vim java-common libxi6 libxrender1 libxtst6

# Install Pi4J (needed for gpio's)
RUN mkdir -p /opt/pi4j &&\
    cd /tmp &&\
    wget https://github.com/Pi4J/download/raw/main/pi4j-${PI4J_VERSION}.zip -P /tmp &&\
    unzip -d /opt/pi4j /tmp/pi4j-${PI4J_VERSION}.zip

# Cleanup
RUN rm -rf /tmp/pi4j-${PI4J_VERSION}.zip

# Create user
RUN useradd -rm -d /home/dispatcher -s /bin/bash -g root -G sudo -u 1001 dispatcher
USER dispatcher

#RUN usermod -a -G gpio root && usermod -a -G adm root
RUN mkdir -p /home/dispatcher/app
WORKDIR /home/dispatcher/app

SHELL ["/bin/bash", "-c"]
#mvn package -DskipTests=true
#java -cp target/app-0.0.1.jar com.buri.App
