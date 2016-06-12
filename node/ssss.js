"use strict";
var fs = require("fs");//excel
console.log(new Date().getTime())
let xlsx=require("node-xlsx")
let name="public/file/1465719850440.xlsx"

let list = xlsx.parse(name);
let sheet1=list[0].data
console.log(sheet1.slice(0,1))

