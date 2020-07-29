FROM node:10-alpine
EXPOSE 3000 9229

RUN apk add git python3 g++ gcc make ffmpeg x264 openssl openssl-dev autoconf gcc g++ yasm coreutils faac-dev freetype-dev lame-dev make libtheora-dev libvorbis-dev libvpx-dev x264-dev xvidcore-dev

WORKDIR /back

COPY package.json /back
#COPY package-lock.json /back

RUN npm install

COPY . /back

RUN npm run build

CMD ./scripts/start.sh
