/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

function registerEventHandlers() {
  $("#npm_install")
    .on("click",function() {

      process = require('process');
      process.version = require('version');
      Stream = require('stream');
      process.stderr = new Stream();
      //  copy pasta from `process.stderr.write.toString()`
      process.stderr.write = function (data, arg1, arg2) {
        var encoding, cb;

        // parse arguments
        if (arg1) {
          if (typeof arg1 === 'string') {
            encoding = arg1;
            cb = arg2;
          } else if (typeof arg1 === 'function') {
            cb = arg1;
          } else {
            throw new Error('bad arg');
          }
        }

        if (typeof data === 'string') {
          encoding = (encoding || 'utf8').toLowerCase();
          switch (encoding) {
          case 'utf8':
          case 'utf-8':
          case 'ascii':
          case 'ucs2':
          case 'ucs-2':
          case 'utf16le':
          case 'utf-16le':
            // This encoding can be handled in the binding layer.
            break;

          default:
            data = new Buffer(data, encoding);
          }
        } else if (!Buffer.isBuffer(data)) {
          throw new TypeError('First argument must be a buffer or a string.');
        }

        // If we are still connecting, then buffer this for later.
        if (this._connecting) {
          this._connectQueueSize += data.length;
          if (this._connectQueue) {
            this._connectQueue.push([data, encoding, cb]);
          } else {
            this._connectQueue = [[data, encoding, cb]];
          }
          return false;
        }

        return this._write(data, encoding, cb);
      }

      var npm = require("npm");
      console.log("MAXMAXMAX",npm);
      return false;
    })
    ;
};

$(document).ready( function(){
    registerEventHandlers();
} );
