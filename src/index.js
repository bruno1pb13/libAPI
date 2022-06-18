let server = require('./server/index')



try{
    server().start()
}catch(err){
    throw new Error(err)
}