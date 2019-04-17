# Copyright (C) 2019 Ethan Pini <contact@eth-p.dev>
# MIT License
# ----------------------------------------------------------------------------------------------------------------------
FROM ubuntu:bionic
ENV DEBIAN_FRONTENT=noninteractive
RUN apt-get update -y

# ----------------------------------------------------------------------------------------------------------------------
# Repository Tools
# ----------------------------------------------------------------------------------------------------------------------
RUN apt-get install -y \
	apt-utils \
	curl \
	software-properties-common

# ----------------------------------------------------------------------------------------------------------------------
# Repository Sources
# ----------------------------------------------------------------------------------------------------------------------
RUN add-apt-repository ppa:git-core/ppa
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -

# Wine.
RUN dpkg --add-architecture i386
RUN curl -s 'https://dl.winehq.org/wine-builds/winehq.key' | apt-key add -
RUN apt-add-repository 'deb https://dl.winehq.org/wine-builds/ubuntu/ bionic main'
RUN apt-get update

# ----------------------------------------------------------------------------------------------------------------------
# Tools
# ----------------------------------------------------------------------------------------------------------------------
RUN apt-get install -y \
	build-essential \
	git \
	git-lfs \
	gnupg2 \
	nodejs \
	winehq-stable \
	zip
