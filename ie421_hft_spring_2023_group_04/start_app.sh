#!/bin/sh
vagrant ssh netcap_frontend -c 'cd ~/vagrant/src/netcap_app; pm2 delete netcap_app || : && pm2 start yarn --name netcap_app -- start'
vagrant ssh netcap_backend -c 'cd ~/vagrant/src/netcap_api; pm2 delete netcap_api || : && pm2 start yarn --name netcap_api -- start'
