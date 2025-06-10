# Dockerfile สำหรับ Backend (Lumen Application)
# Path: STRATEGIC-KPI-REPORT-PYO/backend/Dockerfile

# --- Stage 1: composer_dependencies ---
# ใช้ Composer Image เพื่อติดตั้ง PHP Dependencies
FROM composer:2 as composer_dependencies

WORKDIR /app

# COPY เฉพาะ composer.json และ composer.lock เพื่อให้ Docker Cache Layer ทำงานได้ดี
# (หาก composer.json/lock ไม่มีการเปลี่ยนแปลง Docker จะไม่ติดตั้ง dependencies ใหม่)
COPY composer.json composer.lock ./

# ติดตั้ง Composer Dependencies
# --no-dev: ไม่รวม dev dependencies
# --optimize-autoloader: สร้าง autoloader ที่เหมาะกับการ production
# --no-scripts: ไม่รัน scripts ที่กำหนดใน composer.json (อาจมีปัญหาเรื่อง permissions)
RUN composer install --no-dev --optimize-autoloader --no-scripts

# --- Stage 2: php_lumen_runtime ---
# ใช้ PHP FPM Alpine Image สำหรับรัน Lumen Application ใน Production
FROM php:8.2-fpm-alpine AS php_lumen_runtime

WORKDIR /var/www/html

# ติดตั้ง System Dependencies ที่จำเป็นสำหรับ PHP Extensions และ Nginx
# เปลี่ยน php8- เป็น php82- สำหรับ PHP 8.2 บน Alpine Linux ตาม Error ก่อนหน้า
# และลบ docker-php-ext-install ออกไปชั่วคราว เนื่องจาก package ถูกติดตั้งด้วย apk แล้ว หรือเป็น built-in
RUN apk add --no-cache \
    nginx \
    curl \
    libzip-dev \
    sqlite-dev \
    php82-pdo_mysql \
    php82-redis \
    php82-bcmath \
    php82-ctype \
    php82-json \
    php82-xml \
    php82-mbstring \
    php82-openssl \
    php82-tokenizer \
    php82-fileinfo \
    php82-gmp \
    php82-calendar \
    && rm -rf /var/cache/apk/*

# COPY Vendor Directories จาก Stage composer_dependencies
COPY --from=composer_dependencies /app/vendor /var/www/html/vendor

# COPY โค้ด Lumen Application ทั้งหมด
# จุดนี้จะ COPY ไฟล์ทั้งหมดจาก Build Context (ซึ่งคือ ./backend) ไปยัง /var/www/html ใน Container 
COPY . /var/www/html 

# สร้างและกำหนดสิทธิ์สำหรับโฟลเดอร์ /run/nginx ที่ Nginx ต้องการ
RUN mkdir -p /run/nginx && chown -R www-data:www-data /run/nginx

# กำหนดสิทธิ์ให้โฟลเดอร์ storage และ bootstrap/cache ของ Lumen
# เพื่อให้ Lumen สามารถเขียนไฟล์ได้ (เช่น cache, logs) 
RUN mkdir -p /var/www/html/storage /var/www/html/bootstrap/cache \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache


# COPY Nginx configuration files
# Docker จะหาไฟล์เหล่านี้จาก Build Context (./backend) + Path ที่ระบุ 
# ดังนั้นไฟล์เหล่านี้ต้องอยู่ที่ STRATEGIC-KPI-REPORT-PYO/backend/docker/nginx/
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx/sites-enabled/default.conf /etc/nginx/sites-enabled/default.conf

# กำหนด Port ที่ Container จะ expose ออกไป
EXPOSE 80

# กำหนดคำสั่งที่จะรันเมื่อ Container เริ่มต้น
# รัน php-fpm ในโหมด daemon (-D) และ Nginx ในโหมด non-daemon (-g "daemon off;")
# เพื่อให้ Container ทำงานใน Foreground และ Docker สามารถ monitor ได้
CMD php-fpm -D && nginx -g "daemon off;"