

FROM node:12-alpine3.10

# Create app directory
ARG APP_DIR=/stock-ticker
RUN mkdir -p $APP_DIR/logs
WORKDIR $APP_DIR

# Install app dependencies
COPY package.json $APP_DIR

RUN npm install

# Bundle app source
COPY . $APP_DIR

ARG APP_HTTPS_PORT=8443

# Setting environment variables in docker container
ENV PORT=$APP_HTTPS_PORT

Expose $APP_HTTPS_PORT

CMD ["node", "app.js"]