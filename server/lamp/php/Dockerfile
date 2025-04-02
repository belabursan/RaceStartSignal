FROM php:8.3-apache-bookworm
# PHP and Apache for SailRaceSignal
# 20204-02-05 Bela Bursan <burszan@gmail.com>
# V1.0.1

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

#     docker-php-ext-install bcmath && \
#RUN docker-php-ext-install mbstring 
#RUN docker-php-ext-install exif
# RUN docker-php-ext-install -j$(nproc) intl 
#RUN docker-php-ext-install calendar 

## Other PHP8 Extensions
RUN docker-php-ext-install pdo_mysql
RUN docker-php-ext-install mysqli
RUN docker-php-ext-install curl 
RUN docker-php-ext-install gettext 

# Start service
RUN service apache2 start

## Ensure an SSL directory exists
RUN mkdir -p /etc/ssl/certs && mkdir -p /etc/ssl/private

# SSL stuff
RUN echo "ServerName ${SIGNAL_DOMAIN}" >> /etc/apache2/apache2.conf
RUN openssl dhparam -out /etc/ssl/certs/dh-strong.pem 2048
RUN openssl req -x509 -newkey rsa:4096 -sha256 -nodes -keyout /etc/ssl/private/signal-ssl-cert.key \
 -out /etc/ssl/certs/signal-ssl-cert.pem -days 3650 \
 -subj "/C=SE/ST=./L=Malmoe/O=Lagunen/OU=Kappseglingsklubb/CN=${SIGNAL_DOMAIN}}" -passout pass:${SSL_KEY_PASS}

## Add ssl cert
RUN sed -i '/SSLCertificateFile.*snakeoil\.pem/c\SSLCertificateFile \/etc\/ssl\/certs\/signal-ssl-cert.pem' /etc/apache2/sites-available/default-ssl.conf
RUN sed -i '/SSLCertificateKeyFile.*snakeoil\.key/cSSLCertificateKeyFile /etc/ssl/private/signal-ssl-cert.key\' /etc/apache2/sites-available/default-ssl.conf

RUN mkdir -p /var/log/php && chmod 777 /var/log/php

# modules
RUN a2enmod rewrite && a2enmod rewrite headers && a2enmod ssl && a2enmod socache_shmcb
#site
RUN a2ensite default-ssl

## Cleanup
RUN rm -rf /usr/src/*

#https://www.arubacloud.com/tutorial/how-to-enable-https-protocol-with-apache-2-on-ubuntu-20-04.aspx
##  https://forums.docker.com/t/setup-local-domain-and-ssl-for-php-apache-container/116015
