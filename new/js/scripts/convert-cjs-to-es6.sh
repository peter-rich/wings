#!/bin/bash
ls ../
cp ../config.js ./config-generated-es6.js
cjs-to-es6 config-generated-es6.js
mv config-generated-es6.js constants.js