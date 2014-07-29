
FROM    ubuntu:14.04
MAINTAINER Dustin Whittle <dustin.whittle@appdynamics.com>

RUN groupadd -r appdynamics
RUN useradd --create-home --gid appdynamics unprivilegeduser

RUN apt-get update && DEBIAN_FRONTEND=noninteractive sudo apt-get install -yq \
	apt-utils \
	aufs-tools \
	automake \
	build-essential \
	curl \
	git \
	iptables \
	nginx \
	openssh-server \
	nodejs \
	mongodb \
	--no-install-recommends

RUN	git clone --no-checkout https://github.com/Appdynamics/acme-wine-cellar.git /opt/appdynamics/acme-wine-cellar && cd /opt/appdynamics/acme-wine-cellar && npm install

WORKDIR	/opt/appdynamics/acme-wine-cellar

CMD    ["/usr/bin/node", "/opt/appdynamics/wine-store-app/serverwithanalytics.js"]
