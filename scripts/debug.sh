#!/bin/bash

echo
if [ "$#" -eq 0 ]
  then
    f="server/server.js"
  else
    f="$1"
fi

echo Open the Chrome browser to "chrome://inspect" to debug "$f" file.
echo

node --inspect-brk "$f"
