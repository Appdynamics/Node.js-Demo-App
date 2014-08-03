rm forever.log
forever start -l $PWD/forever.log -o $PWD/server.log -e $PWD/server.err --killSignal=SIGTERM  server.js
