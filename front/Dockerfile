FROM node:12-alpine
#RUN apt-get update && apt-get install -y apt-transport-https ca-certificates

#RUN apk update && apk add ca-certificates && rm -rf /var/cache/apk/*
#COPY ./mycert.crt /usr/local/share/ca-certificates/mycert.crt
#RUN update-ca-certificates

#RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list


WORKDIR /front
#RUN apt-get install -y yarn zsh vim
RUN apk add yarn zsh vim curl git python make g++



RUN yarn global add @vue/cli typescript
COPY package.json /front
#COPY yarn.lock /front
RUN yarn install
CMD ["yarn", "serve"]
