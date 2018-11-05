#!/bin/bash

cd react/

if [ -z `which yarn` ];
  then npm run lint;
  else yarn lint;
fi;
