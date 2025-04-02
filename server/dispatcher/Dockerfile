#FROM gradle:jdk17-alpine
FROM eclipse-temurin

RUN apt-get update && apt-get -y upgrade
USER root
#RUN usermod -a -G gpio root && usermod -a -G adm root
WORKDIR /opt/dispatcher
