FROM mariadb:lts-noble
# Maria DB for SailRace
# 2024-02-05 Bela Bursan <burszan@gmail.com>
# v0.9.0

ARG SAILRACE_DATABASE
ENV SAILRACE_DATABASE=$SAILRACE_DATABASE

ADD ./config/my.cnf /etc/mysql/conf.d
ADD ./config/data.sql /etc/mysql/data.sql

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get -y install apt-utils \
    iputils-ping net-tools mariadb-client tzdata sed nano && \
chown -R mysql:root /var/lib/mysql/ && \
sed -i -r "s/MYSQL_DATABASE/$SAILRACE_DATABASE/g" /etc/mysql/data.sql && \
cp /etc/mysql/data.sql /docker-entrypoint-initdb.d
