import express from 'express'
import bodyParser from 'body-parser'
import { createReadStream } from 'fs'
import crypto from 'crypto'
import http from 'http'

import instanceExpress from './app.js'
const app = instanceExpress(express, bodyParser, createReadStream, crypto, http);
app.listen(process.env.PORT||8080);