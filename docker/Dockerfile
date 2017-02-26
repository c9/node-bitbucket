FROM ubuntu:trusty

ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update


RUN apt-get install g++ -y
RUN apt-get install make -y
RUN apt-get install curl -y


RUN curl -sL https://deb.nodesource.com/setup | sudo bash -
RUN apt-get install nodejs -y 
RUN rm /usr/bin/node || true
RUN ln -s /usr/bin/nodejs /usr/bin/node
RUN npm cache clean -f
RUN npm install -g n
RUN  n 6.2.2
RUN rm /usr/bin/node
RUN ln -s /usr/local/n/versions/node/6.2.2/bin/node /usr/bin/node
RUN npm rebuild

#git required for some npm install packages
RUN apt-get install git -y