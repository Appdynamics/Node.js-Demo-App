#!/bin/bash
COUNTER=0;
while true;do
	curl http://localhost:3000/wines
    curl http://localhost:3000/wines/52571f5df61501afc3000003
	curl http://localhost:3000/wines/52571f5df61501afc3000007
	curl http://localhost:3000/#wines
sleep 1
done
