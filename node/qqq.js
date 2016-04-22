/**
 * Created by ThinkPad on 2016/4/18.
 */
"use strict";
let aa={"dd":1232,"ddd":333}
var qq=""
for (var i in aa){
    qq=qq+i+"="+aa[i]+"&"
}
console.log(qq)