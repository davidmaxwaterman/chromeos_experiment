/*
 * Copyright (c) 2012, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

$(document).ready(function(){
  var opts={
    type:"GET",
    success:function(data){
      $("body").html("<h1>"+data+"</h1>");
    },
    error:function(data){
      console.log("error",data);
    },
    url:"test.txt"
  };
  $.ajax(opts);
});
