# Menggunakan image Node.js versi LTS (alpine untuk ukuran kecil)
FROM node:16-alpine

# Set direktori kerja di dalam container
WORKDIR /usr/src/app

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin semua file dari direktori lokal ke direktori kerja container
COPY . .

# Tentukan port yang akan digunakan aplikasi (pastikan sesuai dengan `server.js`)
EXPOSE 3002

# Jalankan server.js sebagai entry point
CMD ["node", "server.js"]
