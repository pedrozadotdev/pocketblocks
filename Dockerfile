FROM alpine:3 as downloader

ARG POCKETBASE_VERSION=0.19.0

#Install dependencies
RUN apk add --no-cache \
    ca-certificates \
    unzip \
    wget \
    zip \
    zlib-dev

RUN wget https://github.com/pocketbase/pocketbase/releases/download/v${POCKETBASE_VERSION}/pocketbase_${POCKETBASE_VERSION}_linux_amd64.zip \
    && unzip pocketbase_${POCKETBASE_VERSION}_linux_amd64.zip

FROM alpine:3

COPY ./server /pocketblocks
COPY ./docker-run.sh /pocketblocks/docker-run.sh
COPY --from=downloader /pocketbase /pocketblocks/pocketbase

RUN chmod +x /pocketblocks/pocketbase && \
    chmod +x /pocketblocks/docker-run.sh && \
    mkdir /pocketblocks/data

WORKDIR /pocketblocks
EXPOSE 8080

CMD ["sh", "docker-run.sh"]
