#!/bin/bash

SERVICE_NAME=wol-server
NODE_NAME=node-v4.4.7-linux-x64
INSTALL_DIR=/opt/wol-server

CURRENT_DIR="$(pwd)"

if [ "$(id -u)" != "0" ]; then
   echo "This script must be run as root" 1>&2
   exit 1
fi

echo "*** Application location: $INSTALL_DIR"
mkdir $INSTALL_DIR
mkdir $INSTALL_DIR/node

echo "*** Downloading NodeJS"
wget https://nodejs.org/dist/v4.4.7/$NODE_NAME.tar.gz -O /tmp/$NODE_NAME.tar.gz
tar -zxvf /tmp/$NODE_NAME.tar.gz -C /tmp/ >> /dev/null
cp /tmp/$NODE_NAME /$INSTALL_DIR/node
cp -ra /tmp/$NODE_NAME/. /$INSTALL_DIR/node

echo "*** Unziping appliaction"
unzip wol-server-1.0.0.zip -d $INSTALL_DIR >> /dev/null

chmod 755 $INSTALL_DIR -R
chown root:root $INSTALL_DIR -R

echo "*** Installing service appliaction"
cp wol-server-service /etc/init.d/$SERVICE_NAME
chmod 755 /etc/init.d/$SERVICE_NAME
chown root:root /etc/init.d/$SERVICE_NAME

cd /etc/rc3.d
ln -s ../init.d/${SERVICE_NAME} S10${SERVICE_NAME}
cd ${CURRENT_DIR}

echo "*** Starting appliacion"
/etc/init.d/wol-server start 

echo "*** Done"