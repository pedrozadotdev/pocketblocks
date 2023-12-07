FROM alpine:3 as downloader

ARG PBL_VERSION=v0.3.0

#Install dependencies
RUN apk add --no-cache \
    ca-certificates \
    unzip \
    wget \
    zip \
    zlib-dev

RUN wget https://github.com/internoapp/pocketblocks/releases/download/${PBL_VERSION}/pocketblocks_$(echo "${PBL_VERSION}" | cut -c 2-)_linux_amd64.zip \
    && unzip pocketblocks_$(echo "${PBL_VERSION}" | cut -c 2-)_linux_amd64.zip

FROM alpine:3

RUN mkdir -p /pocketblocks/data
COPY --from=downloader /pocketblocks /pocketblocks/pocketblocks

RUN chmod +x /pocketblocks/pocketblocks

WORKDIR /pocketblocks
EXPOSE 8080

ENTRYPOINT ["./pocketblocks", "serve", "--http=0.0.0.0:8080", "--dir=./data/pb_data", "--hooksDir=./data/pb_hooks", "--migrationsDir=./data/pb_migrations", "--publicDir=./data/pbl_public"]
