# Build aşaması
FROM node:18-alpine as build

WORKDIR /app

# API Key'i build argümanı olarak al
ARG VITE_COINGECKO_API_KEY
ENV VITE_COINGECKO_API_KEY=$VITE_COINGECKO_API_KEY

# Package dosyalarını kopyala
COPY package.json package-lock.json* ./

# Bağımlılıkları yükle
RUN npm install

# Kaynak kodunu kopyala
COPY . .

# Production build oluştur
RUN npm run build

# Production aşaması
FROM nginx:alpine

# Build dosyalarını nginx'e kopyala
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx yapılandırması
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

