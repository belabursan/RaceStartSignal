FROM php:8.3-apache-bookworm
# PHP and Apache for SailRaceSignal
# 20204-02-05 Bela Bursan <burszan@gmail.com>
#

ARG DEBIAN_FRONTEND=noninteractive
ARG SSL_KEY_PASS
ARG SIGNAL_DOMAIN

# Update
RUN apt-get -y update --fix-missing && \
    apt-get upgrade -y && \
    apt-get --no-install-recommends install -y apt-utils openssl nano net-tools && \
    rm -rf /var/lib/apt/lists/*

# Install useful tools and install important libaries
RUN apt-get -y update && \
    apt-get -y --no-install-recommends install nano wget dialog libsqlite3-dev libsqlite3-0 \
    default-mysql-client zlib1g-dev libzip-dev libicu-dev && \
    apt-get -y --no-install-recommends install --fix-missing apt-utils build-essential git curl libonig-dev && \ 
    apt-get install -y iputils-ping && \
    apt-get -y --no-install-recommends install --fix-missing libcurl4 libcurl4-openssl-dev zip openssl && \
    rm -rf /var/lib/apt/lists/* && \
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install xdebug
RUN pecl install xdebug-3.3.1 && \
    docker-php-ext-enable xdebug && \
    mkdir /var/log/xdebug

# Install redis
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

# Other PHP8 Extensions
RUN docker-php-ext-install pdo_mysql && \
    docker-php-ext-install pdo_sqlite && \
    docker-php-ext-install bcmath && \
    docker-php-ext-install mysqli && \
    docker-php-ext-install curl && \
    docker-php-ext-install zip && \
    docker-php-ext-install -j$(nproc) intl && \
    docker-php-ext-install mbstring && \
    docker-php-ext-install gettext && \
    docker-php-ext-install calendar && \
    docker-php-ext-install exif

# Insure an SSL directory exists
RUN mkdir -p /etc/ssl/certs
RUN mkdir -p /etc/ssl/private
RUN openssl dhparam -out /etc/ssl/certs/dh-strong.pem 2048
RUN openssl req -x509 -newkey rsa:4096 -keyout /etc/ssl/private/ssl-cert-snakeoil.key \
 -out /etc/ssl/certs/ssl-cert-snakeoil.pem -days 3650 \
 -subj "/C=US/ST=State/L=City/O=company/OU=Com/CN=172.19.0.70" -passout pass:${SSL_KEY_PASS}


 RUN echo 'SSLCipherSuite EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH\n\
    SSLProtocol All -SSLv2 -SSLv3 -TLSv1 -TLSv1.1\n\
    SSLHonorCipherOrder On\n\
    Header always set X-Frame-Options DENY\n\
    Header always set X-Content-Type-Options nosniff\n\
    SSLCompression off\n\
    SSLUseStapling on\n\
    SSLStaplingCache "shmcb:logs/stapling-cache(150000)"\n\
    SSLSessionTickets Off\n' > /etc/apache2/conf-available/ssl-params.conf

RUN echo "ServerName ${SIGNAL_DOMAIN}" >> /etc/apache2/apache2.conf

# Enable SSL support
RUN a2enmod ssl && a2enmod rewrite && a2enmod rewrite headers &&\
 a2enconf ssl-params && a2ensite default-ssl


# Cleanup
RUN rm -rf /usr/src/*

#https://www.arubacloud.com/tutorial/how-to-enable-https-protocol-with-apache-2-on-ubuntu-20-04.aspx
