FROM node:lts-alpine3.21
# SailRace Node Server
# v1.0.0 Bela Bursan <burszan@gmail.com>
#

RUN apt-get update && \
    apt-get upgrade && \
    apt install -y wget curl nano ca-certificates gnupg openssl python3-pip \
    python3 build-essential apt-transport-https openssh-client


RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
RUN mkdir -p /home/node/.ssh && chown -R node:node /home/node/.ssh
WORKDIR /home/node/app

RUN mkdir -p /home/node/app/secret && cd /home/node/app/secret/
RUN openssl dhparam -out /home/node/app/secret/dh-strong.pem 2048
RUN openssl req -x509 -newkey rsa:4096 -keyout /home/node/app/secret/signal-key.pem -out /home/node/app/secret/signal-cert.pem -days 3650

COPY --chown=node:node package*.json ./
USER node
RUN npm install
COPY --chown=node:node . .
EXPOSE 8080

CMD ["npm", "start"]
