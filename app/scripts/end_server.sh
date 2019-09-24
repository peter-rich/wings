#!/bin/bash
cd ~/_CODE_/wings-SCGPM/app
lsof -i :8081 | awk -v i=2 -v j=2 'FNR==i {system("kill -9 " $2)}'
deactivate