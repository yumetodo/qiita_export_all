FROM node:12-alpine

ARG QIITA_ACCESS_TOKEN
ENV QIITA_ACCESS_TOKEN=$QIITA_ACCESS_TOKEN
COPY . /home/node/

USER root
WORKDIR /home/node
RUN \
    npm ci && \
    mkdir /home/node/export

WORKDIR /home/node/export
ENTRYPOINT [ "/usr/local/bin/npx", "qiita_export_all" ]
CMD [ "" ]
