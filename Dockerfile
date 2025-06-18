# Dockerfile
FROM node:20.10.0-alpine

# create app directory
WORKDIR /usr/src/app

# install dependencies
COPY package*.json ./
RUN npm install --production

# copy source and build
COPY . .
RUN npm run build

# expose your app’s port (adjust if different)
EXPOSE 3000

# start the server (assumes "start" script runs your built app)
CMD ["npm", "run", "start"]
