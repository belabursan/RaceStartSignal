#FROM gradle:jdk17-alpine
FROM eclipse-temurin

ARG PI4J_VERSION=3.0.1
ARG GRADLE_VERSION=8.10.2
ENV DEBIAN_FRONTEND=noninteractive

# Update and install needed stuff
RUN apt-get update && \
    apt-get -y upgrade && \
    apt-get -y install nano curl git wget unzip maven

# Create user
RUN useradd -rm -d /home/dispatcher -s /bin/bash -g root -G sudo -u 1001 dispatcher

# Create working directories
RUN mkdir -p /opt/gradle && \
    mkdir -p /opt/dispatcher && \
    mkdir -p /opt/pi4j


# Install gradle
RUN cd /tmp &&\
    wget https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip -P /tmp &&\
    unzip -d /opt/gradle /tmp/gradle-${GRADLE_VERSION}-bin.zip &&\
    echo "\nexport GRADLE_HOME=/opt/gradle/gradle-${GRADLE_VERSION}\n\
export PATH=$PATH:/opt/gradle/gradle-${GRADLE_VERSION}/bin:/opt/gradle/gradle-${GRADLE_VERSION}\n" >> /etc/profile

# Install Pi4J (needed for gpio's)
RUN cd /tmp && \
    wget https://github.com/Pi4J/download/raw/main/pi4j-${PI4J_VERSION}.zip -P /tmp &&\
    unzip -d /opt/pi4j /tmp/pi4j-${PI4J_VERSION}.zip &&\
    echo "\nexport PATH=$PATH:/opt/pi4j/pi4j-${PI4J_VERSION}:/opt/pi4j/pi4j-${PI4J_VERSION}/bin\n" >> /etc/profile


#RUN usermod -a -G gpio root && usermod -a -G adm root
WORKDIR /opt/dispatcher
