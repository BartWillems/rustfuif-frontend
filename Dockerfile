FROM node:12 as build

WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn --production

COPY .env.production /app
COPY public /app/public
COPY src /app/src

RUN yarn run build

FROM nginx:alpine

# Make sure nginx can run as non-root
RUN chown -R nginx /var/cache/nginx && \
    chmod 777 /var/run && \
    ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log

COPY ./docker/nginx.conf /etc/nginx/nginx.conf

RUN mkdir -p /usr/share/nginx/html/material-preview

COPY --from=build /app/build /usr/share/nginx/html/material-preview

RUN chown -R nginx /usr/share/nginx/html && \
    chmod -R 544 /usr/share/nginx/html

USER nginx

EXPOSE 8080