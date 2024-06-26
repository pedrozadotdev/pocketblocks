#!/bin/sh

#Build Image
docker build -t ghcr.io/pedrozadotdev/pocketblocks:${PBL_VERSION} -t ghcr.io/pedrozadotdev/pocketblocks:latest --build-arg PBL_VERSION .
if [ $? -ne 0 ]
then
  echo "Build Fail. Aborting!"
  exit 1
fi

#Publish Image
sh -c "docker login ghcr.io -u ${GH_USER} --password ${GH_TOKEN}"
sh -c "docker push -a ghcr.io/pedrozadotdev/pocketblocks"