#!/usr/bin/env node

'use strict'

// this will be overrided by .env and .env.local
process.env.NODE_ENV = 'production'

const express = require('express')
const debug = require('debug')('faluche-troyenne-api:bin')
const app = express()
const env = require('../src/env')

require('../src')(app, express)

app.listen(env.API_PORT, () =>
  debug(`server started on port ${env.API_PORT} [${env.NODE_ENV}]`)
)
