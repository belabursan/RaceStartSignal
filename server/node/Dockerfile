FROM node:lts-alpine3.21
# SailRace Node Server
# v2.0.0 Bela Bursan <burszan@gmail.com>
#

ARG SSL_KEY_PASS
ENV NODE_TLS_REJECT_UNAUTHORIZED='0'

RUN apk upgrade --update-cache --available && \
    apk add bash nano openssl && \
    rm -rf /var/cache/apk/*

USER node

RUN mkdir -p /home/node/app/secret
RUN openssl dhparam -out /home/node/app/secret/dh-strong.pem 2048
RUN openssl req -x509 -newkey rsa:4096 -keyout /home/node/app/secret/signal-key.pem \
 -out /home/node/app/secret/signal-cert.pem -days 3650 \
 -subj "/C=SE/ST=./L=Malmoe/O=Lagunen/OU=Kappseglingsklubb/CN=172.19.0.70" -passout pass:${SSL_KEY_PASS}

WORKDIR /home/node/app/

COPY --chown=node:node . .
RUN npm install
#EXPOSE 8080

CMD ["npm", "start"]
