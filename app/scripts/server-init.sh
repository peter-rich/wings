#!/bin/bash
# meant to be called by js/package.json
rm -rf ./credentials
mkdir credentials
cp config.js js/src/config-generated-es6.js
cd js/src/
cjs-to-es6 config-generated-es6.js
mv config-generated-es6.js constants.js