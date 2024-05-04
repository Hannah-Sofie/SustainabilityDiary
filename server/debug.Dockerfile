FROM node:21.6.1-slim

LABEL author="Hannah"
LABEL version="0.0.2"

EXPOSE 8083/tcp

RUN groupadd team3-gr

RUN useradd -g team3-gr usr


RUN mkdir /team3

WORKDIR /team3

COPY --chown=usr:team3-gr . /team3

RUN npm install

# running as root
# USER usr

# adding -- watch for reload
CMD ["node", "--inspect=0.0.0.0", "--watch", "server/server.js"]