FROM node

WORKDIR /

COPY . .

RUN npm install

CMD ["node", "src/index.js"]
