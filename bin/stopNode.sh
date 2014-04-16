#!/bin/bash

echo `ps -ef | grep node | grep -v grep | awk '{print $2}'`

kill -9 `ps -ef | grep node | grep -v grep | awk '{print $2}'`

echo "killing node process"
