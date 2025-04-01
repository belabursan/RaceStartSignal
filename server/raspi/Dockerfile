FROM gradle:jdk17-alpine
# FROM eclipse-temurin

ARG MYSQL_USER
ARG MYSQL_PASSWORD
ARG MYSQL_DATABASE

RUN usermod -a -G gpio root && usermod -a -G adm root
WORKDIR /home/app


