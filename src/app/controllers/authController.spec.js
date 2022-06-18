
describe('Registrar Usuario', ()=>{

    const User = require('../models/user');

    //random 5 digit number

    const randomNumber = Math.floor(Math.random() * 100000);

    let adbUser = {
        name: `Adb-${randomNumber}`,
        email: `teste${randomNumber}@gmail.com`,
        password: '123456'
    }


    for(let x = 0; x <= 10; x++){
        it("Deve ser possivel criar um usuario", ()=>{
            return User.create(adbUser).then((user)=>{
                expect(user.email).toBe(adbUser.email);
            })
        })
        
        it("Deve ser possivel remover um usuario", ()=>{
            return User.remove({email: adbUser['email']}).then(()=>{
                expect(true).toBe(true);
            })
        })
    
    }

    it("O total de valores no banco deve ser igual a zero", ()=>{
        return User.count().then((count)=>{
            expect(count).toBe(0);
        })
    })

})