# FCRI Operations

## Domain

- public domain: `fcri.science`

## Deployment Model

FCRI runs as a Next.js server application behind Nginx.

- build with Next.js standalone output
- run the app on a private localhost port
- serve public traffic through Nginx

## Production Checklist

1. install Node.js and Nginx
2. run `npm install`
3. run `npm run build`
4. run `npm run build`
5. install the systemd service from `deploy/systemd/fcri-web.service`
6. install the Nginx configuration from `deploy/nginx/fcri.science.conf`
7. validate home page, research routes, academics routes, support routes, and inquiry submission

## Operational Priorities

- preserve route integrity for research and paper pages
- keep support and donation messaging institution-grade
- maintain clean archive and academic navigation
