FROM eclipse-temurin
# Docker file for SailRaceSignal-Dispatcher
# v1.0.0 Bela Bursan <burszan@gmail.com>
#
#https://maven.apache.org/guides/getting-started/maven-in-five-minutes.html

ENV DEBIAN_FRONTEND=noninteractive
ENV TZ="Europe/Stockholm"
RUN date

# Update and install needed stuff
RUN apt-get update &&\
    apt-get -y upgrade &&\
    apt-get -y install nano maven 

# Create user
#RUN useradd -rm -d /home/dispatcher -s /bin/bash -g root -G sudo -u 1001 dispatcher
#USER dispatcher

#RUN mkdir -p /home/dispatcher/app
WORKDIR /home/dispatcher/app

SHELL ["/bin/bash", "-c"]
