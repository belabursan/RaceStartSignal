FROM php:8.3-apache-bookworm
# PHP and Apache for SailRaceSignal
# 20204-02-05 Bela Bursan <burszan@gmail.com>
# V0.9.RC3

ARG DEBIAN_FRONTEND=noninteractive
ARG SSL_KEY_PASS
ARG SIGNAL_DOMAIN

## Update
RUN apt-get -y update --fix-missing && apt-get upgrade -y && rm -rf /var/lib/apt/lists/*

## Install useful tools and install important libaries
RUN apt-get -y update && apt-get -y install nano openssl net-tools wget default-mysql-client libicu-dev curl\
    libonig-dev iputils-ping libcurl4 libcurl4-openssl-dev &&\
    rm -rf /var/lib/apt/lists/* && \
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

## Other PHP8 Extensions
RUN docker-php-ext-install pdo_mysql
RUN docker-php-ext-install mysqli
RUN docker-php-ext-install curl 
RUN docker-php-ext-install gettext 

# Start service
RUN service apache2 start

## Ensure an SSL directory exists
RUN mkdir -p /etc/ssl/certs && mkdir -p /etc/ssl/private


# https://stackoverflow.com/questions/75137218/whats-the-simplest-way-to-deploy-a-node-app-on-linux-mint
# openssl req -x509 -nodes -days 999999 -newkey rsa:2048 -keyout /etc/ssl/private/apache-selfsigned.key -out /etc/ssl/certs/apache-selfsigned.crt 
# https://superhero.ninja/2015/07/22/create-a-simple-https-server-with-openssl-s_server/

# SSL stuff
RUN echo "ServerName ${SIGNAL_DOMAIN}" >> /etc/apache2/apache2.conf
#RUN openssl dhparam -out /etc/ssl/certs/dh-strong.pem 2048
RUN openssl req -x509 -newkey rsa:4096 -sha256 -nodes -keyout /etc/ssl/private/signal-server-cert-pr.key \
 -out /etc/ssl/certs/signal-server-ca.crt -days 3650 \
 -subj "/C=SE/ST=./L=Malmoe/O=Lagunen/OU=Kappseglingsklubb/CN=${SIGNAL_DOMAIN}}" -passout pass:${SSL_KEY_PASS}

## Add ssl cert
RUN sed -i '/SSLCertificateFile.*snakeoil\.pem/c\SSLCertificateFile \/etc\/ssl\/certs\/signal-server-ca.crt' /etc/apache2/sites-available/default-ssl.conf
RUN sed -i '/SSLCertificateKeyFile.*snakeoil\.key/cSSLCertificateKeyFile /etc/ssl/private/signal-server-cert-pr.key\' /etc/apache2/sites-available/default-ssl.conf

# modules
RUN a2enmod rewrite && a2enmod rewrite headers && a2enmod ssl && a2enmod socache_shmcb
#site
RUN a2ensite default-ssl

## Cleanup
RUN rm -rf /usr/src/*

#https://www.arubacloud.com/tutorial/how-to-enable-https-protocol-with-apache-2-on-ubuntu-20-04.aspx
##  https://forums.docker.com/t/setup-local-domain-and-ssl-for-php-apache-container/116015
