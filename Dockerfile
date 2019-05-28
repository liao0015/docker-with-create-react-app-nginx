FROM node:10

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

# not needed for development
# COPY . ./

EXPOSE 3000

CMD ["yarn", "start"]