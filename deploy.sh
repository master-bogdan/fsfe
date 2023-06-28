#! /usr/bin/bash

# This script is used to deploy the FSFE website. It is called by the cronjob
now=$(date +"%Y-%m-%d %H:%M:%S")
git pull origin main