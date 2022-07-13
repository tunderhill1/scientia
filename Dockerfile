FROM node:16

# Copy sources over
COPY . /scientia

# Install dependencies
WORKDIR /scientia
RUN yarn install --network-timeout 300000 && yarn build && yarn global add serve

# Start server
CMD ["serve", "-s", "build", "-l", "3000"]
