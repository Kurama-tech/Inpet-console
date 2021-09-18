# By Meer Sawood <msawood@redhat.com> 
# uses uib node.js 14 image to build and nginx 1.18 as the server
FROM registry.access.redhat.com/ubi8/nodejs-14 AS builder 
USER 0
WORKDIR  /tmp/src
RUN chown -R 1001:0 /tmp/src/
ADD package.json  /tmp/src/
ADD package-lock.json /tmp/src/
USER 1001
RUN npm install
ENV PATH="./tmp/src/node_modules/.bin:$PATH"
ADD . /tmp/src/
# Requires root user to build a production build
USER root
# Create A production build
RUN npm run build

FROM registry.access.redhat.com/ubi8/nginx-118

ADD nginx/nginx.conf "${NGINX_CONF_PATH}"
# if you want to add other configuration add here
COPY --from=builder /tmp/src/build ./
# Start Server
CMD nginx -g "daemon off;"