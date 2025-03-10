FROM node:lts-alpine3.21
# SailRace Node Server
# v1.0.0 Bela Bursan <burszan@gmail.com>
#

RUN apk upgrade --update-cache --available && \
    apk add bash nano openssl && \
    rm -rf /var/cache/apk/*

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
RUN mkdir -p /home/node/.ssh && chown -R node:node /home/node/.ssh
WORKDIR /home/node/app

RUN mkdir -p /home/node/app/secret && cd /home/node/app/secret/
RUN openssl dhparam -out /home/node/app/secret/dh-strong.pem 2048
RUN openssl req -x509 -newkey rsa:4096 -keyout /home/node/app/secret/signal-key.pem \
 -out /home/node/app/secret/signal-cert.pem -days 3650 \
 -subj "/C=US/ST=State/L=City/O=company/OU=Com/CN=www.racesignal.local" -passout pass:123456
 RUN chown -R node:node /home/node/app/secret

COPY --chown=node:node package*.json ./
USER node
RUN npm install
COPY --chown=node:node . .
EXPOSE 8080

CMD ["npm", "start"]
