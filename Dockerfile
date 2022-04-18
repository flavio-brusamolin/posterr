FROM node:16.14.2
WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig*.json ./
COPY src ./src
RUN npm install
RUN npm run build


FROM node:16.14.2
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY --from=0 /usr/src/app/dist ./dist
CMD [ "npm", "run", "start" ]
