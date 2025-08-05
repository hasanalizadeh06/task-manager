# 1. Base image
FROM node:18-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy dependencies
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of the app
COPY . .

# 6. Build the Next.js app
RUN npm run build

# 7. Expose the default Next.js port
EXPOSE 3000

# 8. Start the app
CMD ["npm", "run", "dev"]
