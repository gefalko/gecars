#!/bin/bash
cd ./gecar2.src/gecar2
git pull gitlab_ssh master

#update simas filters
cd ./back/jobs
node update_make_models.js
node updateSimasFilters.js

#restart collector
forever list
forever stop collector.js
forever start collector.js debug
