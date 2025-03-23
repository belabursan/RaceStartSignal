FROM phpmyadmin

ARG SIGNAL_DOMAIN
RUN echo "\$cfg['Lang'] = 'en';" >> /etc/phpmyadmin/config.inc.php
RUN echo "ServerName ${SIGNAL_DOMAIN}" >> /etc/apache2/apache2.conf