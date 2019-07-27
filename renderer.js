const zerorpc = require("zerorpc")
const unpickle = require("unpickle")

let client = new zerorpc.Client()


client.connect("tcp://127.0.0.1:4242")

client.invoke("echo", "server ready", (error, res) => {
  if(error || res !== 'server ready') {
    console.error(error)
  } else {
    console.log("server is ready")
  }
})

let result = document.querySelector('#result')

var btn = document.getElementById("init_can");

btn.addEventListener('click', () => {
  var canSettings = getAllSelectValues(Array.prototype.slice.call(document.getElementsByTagName('select'))) ;
  client.invoke("updateCan", canSettings,(error, res) => {
    console.log(canSettings)
    if(error) {
      console.error(error)
    } else {
      result.textContent = res
      console.log('read by python:'+ res)
    }
  })
})

function getAllSelectValues(select) {
  var result = [];
  var opt;
  
  for (var i=0, iLen=select.length; i<iLen; i++) {
    opt = select[i];
      result.push(opt.value || opt.text);   
  }
  return result;
} 

setInterval(checkStatus,1000)
setInterval(getMsgList,100)
function checkStatus(){
  client.invoke("checkCanStatus",(error, res) => {
  console.log(res)
})
}
function getMsgList(){
  client.invoke("getMsgList",(error, res) => {
  console.log(res)
})
}