FROM node:22-alpine AS builder

COPY package*.json  ./

RUN npm install --legacy-peer-deps && mkdir /app && mv ./node_modules /app/node_modules

WORKDIR /app

COPY . .

RUN npm run build

FROM nginx:alpine


RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist/portfolio-ui/browser /usr/share/nginx/html

COPY /nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080

CMD [ "nginx","-g","daemon off;" ]