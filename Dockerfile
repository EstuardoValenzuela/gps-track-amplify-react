FROM node:15.13-alpine
WORKDIR /demo_1
ENV PATH="./node_modules/.bin:$PATH"
COPY . .
RUN npm run build --prod
CMD ["npm", "start"]
