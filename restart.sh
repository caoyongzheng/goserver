#! /bin/bash
export MARTINI_ENV=production
supervisorctl restart gotest
