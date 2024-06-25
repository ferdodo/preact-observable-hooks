FROM node
WORKDIR /preact-observable-hooks
RUN npm config set maxsockets 1
COPY package.json .
COPY npm-shrinkwrap.json .
RUN npm install
RUN npm audit --audit-level=low
COPY . .
RUN npm run build

FROM nginx
COPY --from=0 /preact-observable-hooks/public /usr/share/nginx/html
COPY --from=0 /preact-observable-hooks/docs /usr/share/nginx/html/docs
COPY --from=0 /preact-observable-hooks/reports /usr/share/nginx/html/reports
