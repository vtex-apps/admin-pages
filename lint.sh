#!/bin/bash
FILES='./**/*.ts'
if [ ! -z "$1" ]
then
  FILES="$@"
fi

echo $FILES

cd react/

if [ -z `which yarn` ];
  then npm run lint $FILES;
  else yarn lint $FILES;
fi;
