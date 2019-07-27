const zerorpc = require("zerorpc")
let client = new zerorpc.Client()

console.log("lkdjfhggsdklfghsdfljkgh")

client.connect("tcp://127.0.0.1:4242")

while(true){
checkstatus(client)
}

    function checkstatus(client){
        client.invoke("checkstatus",(error, res) => {
        console.log(res)
    })
}