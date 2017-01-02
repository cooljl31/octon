FROM node:argon
# Setup working directory
WORKDIR /usr/src/app
RUN npm install --quiet -g npm
# Copy package.json
COPY package.json /usr/src/app/package.json
# Install dependencies
RUN npm install --quiet
# Add code
COPY . /usr/src/app
# Set BASE_URL
ENV BASE_URL "https://octon.xyz"
# Build code
RUN npm run build
# Set env
ENV NODE_ENV "production"
# Expose express port
EXPOSE 3000
# Run project
CMD [ "npm", "start" ]
