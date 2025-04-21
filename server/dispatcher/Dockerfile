FROM eclipse-temurin
# Docker file for SailRaceSignal-Dispatcher
# v0.9.0 Bela Bursan <burszan@gmail.com>
#
#https://maven.apache.org/guides/getting-started/maven-in-five-minutes.html


ARG HOME=/root
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ="Europe/Stockholm"
RUN date

# Update and install needed stuff
RUN apt-get update &&\
    apt-get -y upgrade &&\
    apt-get -y install nano maven 

#RUN useradd -m -d ${HOME} ${USER}
#USER ${USER}

# maven stuff
COPY ./m2.tar.gz /tmp
RUN mkdir -p ${HOME}/.m2 && tar xvzf /tmp/m2.tar.gz --strip-components=1 --directory ${HOME}/.m2 && ls -la ${HOME}

WORKDIR ${HOME}/app
SHELL ["/bin/bash", "-c"]
