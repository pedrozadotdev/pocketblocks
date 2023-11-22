#!/bin/sh

if [ -f ./data/pocketbase ]; then
  echo "$(date +"%Y/%m/%d %T") [CONTAINER]: Data directory already setup. Skipping..."
else
  mkdir data/pb_hooks
  mkdir data/pbl_public
  cd data && cp -s ../pocketbase .
  cd pb_hooks && cp -s ../../pb_hooks/* .
  cd ../..
  echo "$(date +"%Y/%m/%d %T") [CONTAINER]: Data directory setup!"
fi

cd pb_public && ln -s ../data/pbl_public pbl && cd ..

cd data && ./pocketbase serve --http=0.0.0.0:8080 --publicDir="../pb_public"
