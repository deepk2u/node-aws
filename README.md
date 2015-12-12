# node-aws

This project gets file from s3 bucket using key
  1. runs on standard http
  2. get file to client without writing it on the server
  3. take advantage of multi-core systems using node.js cluster module
  

to run the application inside node-aws folder, run following commands on command line
    1. change config.json and enter your corresponding secret keys and also change bucket name in server.js file line: 33
    2. npm install
    3. node server.js (this will start your http server on 7777 port)

to get any file on browser http://your host:7777/file/<key>
