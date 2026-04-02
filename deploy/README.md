# FCRI Deployment

## Hosting Model

FCRI is deployed as a Next.js server behind Nginx.

## Expected Runtime

- Next.js server listens on `127.0.0.1:3001`
- domain: `fcri.science`
- TLS terminated at Nginx

## Files

- `nginx/fcri.science.conf`
- `systemd/fcri-web.service`

## Verification

- `/`
- `/research`
- `/academics`
- `/support`
- `POST /api/inquiries`
- representative paper routes
