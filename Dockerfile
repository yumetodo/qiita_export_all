FROM node:12-alpine

ARG QIITA_ACCESS_TOKEN
ENV QIITA_ACCESS_TOKEN=$QIITA_ACCESS_TOKEN
COPY . /home/node/

USER node
WORKDIR /home/node
RUN \
    npm install && \
    mkdir /home/node/export

WORKDIR /home/node/export
ENTRYPOINT npx qiita_export_all
