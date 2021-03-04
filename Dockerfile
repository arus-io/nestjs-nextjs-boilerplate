FROM node:14.15.1-alpine

# Required build args to populate in FE - remove
ARG site_domain
ARG api_domain
ARG intercom_id
ARG gtm_id

RUN test -n "$site_domain"
#RUN test -n "$api_domain"

ENV SITE_DOMAIN=$site_domain
ENV API_DOMAIN=$api_domain
ENV INTERCOM_ID=$intercom_id
ENV GTM_ID=$gtm_id
# ---------


WORKDIR /usr/local/app
RUN apk add g++ make python # postgresql-client
RUN apk add postgresql-client --repository=http://dl-cdn.alpinelinux.org/alpine/v3.11/main


# Installing dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn install

COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN yarn build

# Running the app
CMD [ "node", "dist/server/main" ]
