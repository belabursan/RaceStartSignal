FROM php:8.3-apache-bookworm
# PHP and Apache for SailRaceSignal
# 20204-02-05 Bela Bursan <burszan@gmail.com>
# V1.0.0

ARG DEBIAN_FRONTEND=noninteractive
ARG SSL_KEY_PASS
ARG SIGNAL_DOMAIN

## Update
RUN apt-get -y update --fix-missing && apt-get upgrade -y && rm -rf /var/lib/apt/lists/*

## Install useful tools and install important libaries
RUN apt-get -y update --fix-missing  && \
    apt-get -y --no-install-recommends install apt-utils openssl nano net-tools wget dialog \
    default-mysql-client libicu-dev && \
    apt-get -y --no-install-recommends install --fix-missing  build-essential git curl libonig-dev && \
    apt-get install -y iputils-ping && \
    apt-get -y --no-install-recommends install --fix-missing libcurl4 libcurl4-openssl-dev && \
    rm -rf /var/lib/apt/lists/* && \
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer


## SQLite support
RUN apt-get -y update --fix-missing  && apt-get -y --no-install-recommends install libsqlite3-dev libsqlite3-0

## Zip support
RUN apt-get -y update --fix-missing  && apt-get -y --no-install-recommends install libzip-dev libzip-dev zip 

## Install xdebug
RUN pecl install xdebug-3.3.1 && \
    docker-php-ext-enable xdebug && \
    mkdir /var/log/xdebug

## Install redis
#[Disabled for now, if needed, enable in docker-compose.yml too!] RUN pecl install redis-6.0.2 && docker-php-ext-enable redis

## IMAGICK DISABLE START
## Imagick Commit to install from https://github.com/Imagick/imagick
#ARG IMAGICK_COMMIT="28f27044e435a2b203e32675e942eb8de620ee58"
#
# Install imagick
#RUN apt-get update && \
#    apt-get -y --no-install-recommends install --fix-missing libmagickwand-dev && \
#    rm -rf /var/lib/apt/lists/*
#
#RUN cd /usr/local/src && \
#    git clone https://github.com/Imagick/imagick && \
#    cd imagick && \
#    git checkout ${IMAGICK_COMMIT} && \
#    phpize && \
#    ./configure && make && make install && \
#    cd .. && rm -rf imagick && \
#    docker-php-ext-enable imagick
## IMAGICK DISABLE STOP

## Other PHP8 Extensions
RUN docker-php-ext-install pdo_mysql && \
#    docker-php-ext-install pdo_sqlite && \
    docker-php-ext-install bcmath && \
    docker-php-ext-install mysqli && \
    docker-php-ext-install curl && \
#    docker-php-ext-install zip && \
    docker-php-ext-install -j$(nproc) intl && \
    docker-php-ext-install mbstring && \
    docker-php-ext-install gettext && \
    docker-php-ext-install calendar && \
    docker-php-ext-install exif

## Ensure an SSL directory exists
RUN mkdir -p /etc/ssl/certs && mkdir -p /etc/ssl/private
RUN openssl dhparam -out /etc/ssl/certs/dh-strong.pem 2048
RUN openssl req -x509 -newkey rsa:4096 -sha256 -nodes -keyout /etc/ssl/private/signal-ssl-cert.key \
 -out /etc/ssl/certs/signal-ssl-cert.pem -days 3650 \
 -subj "/C=SE/ST=./L=Malmoe/O=Lagunen/OU=Kappseglingsklubb/CN=${SIGNAL_DOMAIN}}" -passout pass:${SSL_KEY_PASS}

RUN a2enmod rewrite && a2enmod ssl && a2enmod socache_shmcb

## Add ssl cert
RUN sed -i '/SSLCertificateFile.*snakeoil\.pem/c\SSLCertificateFile \/etc\/ssl\/certs\/signal-ssl-cert.pem' /etc/apache2/sites-available/default-ssl.conf
RUN sed -i '/SSLCertificateKeyFile.*snakeoil\.key/cSSLCertificateKeyFile /etc/ssl/private/signal-ssl-cert.key\' /etc/apache2/sites-available/default-ssl.conf

RUN echo "ServerName ${SIGNAL_DOMAIN}" >> /etc/apache2/apache2.conf
RUN a2ensite default-ssl

## Enable SSL support
#RUN a2enmod ssl && a2enmod socache_shmcb && a2enmod rewrite && a2enmod rewrite headers
#RUN a2ensite default-ssl

## Cleanup
RUN rm -rf /usr/src/*

#https://www.arubacloud.com/tutorial/how-to-enable-https-protocol-with-apache-2-on-ubuntu-20-04.aspx
##  https://forums.docker.com/t/setup-local-domain-and-ssl-for-php-apache-container/116015
