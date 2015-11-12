#!/usr/bin/env node --harmony_destructuring

var args = process.argv.slice(2)
var { log } = console

log(args[0])
