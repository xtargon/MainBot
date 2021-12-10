let mongoose = require('mongoose'),
  express = require('express'),
  router = express.Router();
let jwt = require('jsonwebtoken');

const got = require('got');
const tiempoTranscurrido = Date.now();
const hoy = new Date(tiempoTranscurrido+3);

let studentSchema = require('../models/Student');
let adminSchema = require('../models/Admin');
let servicesSchema = require('../models/Services');

router.route('/create-service').post(ensureToken, (req, res, next) => {
  jwt.verify(req.token, 'ENSURE_KEY258741', (err, dat) =>{
      if(err){
          res.sendStatus(403)
          console.log('no autorized')
      } else {
        const serviceObject = {
           typeService:req.body.service,
           price: req.body.price,
           details: req.body.detailService
        };

        servicesSchema.create(serviceObject, (error, data) => {
            if (error) {
              return next(error)
            } else {
              console.log(hoy.toLocaleDateString())
              res.json(data)
            }
        })
      }
  })
});

router.route('/create-student').post(ensureToken, (req, res, next) => {

  jwt.verify(req.token, 'ENSURE_KEY258741', (err, dat) =>{
      if(err){
          res.sendStatus(403)
          console.log('no autorized')
      } else {
        servicesSchema.findOne({"typeService" : req.body.serviceState}, (err, data)=>{
            if (err) {
              console.log(err)
            }else{
              var e = new Date()
              const Limitnew = Number(req.body.vence);
              e.setMonth(e.getMonth() + Limitnew)
              var totalVence = e.getFullYear() +"/"+ (e.getMonth()+1) +"/"+ e.getDate()
              //var b = new Date(totalVence)
              if (req.body.serviceState == "Netflix") {
                var saldoNetflix = "";
                if(req.body.acount == 'Basico'){
                   saldoNetflix = Limitnew*3
                }

                if(req.body.acount == 'Estandar'){
                  saldoNetflix = Limitnew*9
                }

                if(req.body.acount == 'Premium'){
                saldoNetflix = Limitnew*12
                }

                 var userObject = {
                    phone:req.body.phone,
                    plan: data._id,
                    day: hoy.toLocaleDateString(),
                    status: 1,
                    vence: totalVence,
                    numberVence: req.body.vence,
                    typeAcount: req.body.acount,
                    pinNetflix: req.body.pinNet,
                    saldo: saldoNetflix,
                    mail: req.body.mail,
                    pass: req.body.pass,
                    perfilNet: req.body.perfilNet,
                    notes: ''
                  };

                studentSchema.create(userObject, (error, data) => {
                    if (error) {
                      return next(error)
                    } else {

                      console.log(hoy.toLocaleDateString())
                      res.json(data)

                    }
                })
              }
              else{
               var payThis = Limitnew*Number(data.price)
               var userObject = {
                  phone:req.body.phone,
                  plan: data._id,
                  day: hoy.toLocaleDateString(),
                  status: 1,
                  numberVence: req.body.vence,
                  vence: totalVence,
                  saldo: payThis,
                  mail: req.body.mail,
                  pass: req.body.pass,
                  perfilNet: req.body.perfilNet,
                  notes: ''
                };
                  studentSchema.create(userObject, (error, data) => {
                    if (error) {
                      return next(error)
                    } else {

                      console.log(hoy.toLocaleDateString())
                      res.json(data)

                    }
                })
              }
            }
        })
      }
  })
});

router.route('/admin').post((req, res, next) => {
    adminSchema.find({'name':req.body.name, 'pass': req.body.pass}, (err, data) => {
    if (err) {
      return 'none'
    }if(data[0] !== undefined) {
        var webToken = jwt.sign({data}, 'ENSURE_KEY258741')
        var response = {
          name: data[0].name,
          id: data[0]._id,
          volatilToken: webToken
        } 

        console.log(response)
        res.json(response)
    }
  })
});

router.route('/updateStatus').get((req, res) => {

  function sendRememberDay (days){
    var day = new Date()
    day.setDate(day.getDate() + days)
//buscando tolos los usuarios en la base de datos
    studentSchema.find((error, data) => {
      for (var i = 0; i<data.length; i++) {
          if (day == new Date(data[i].vence) ){

              var numWhats = data[i].phone 
              var saldo = data[i].saldo
              var sendMensagge = data[i].send
              var idUpdate = data[i]._id
              var typeAcountThis = data[i].typeAcount

              console.log("pr pagar")

              servicesSchema.findById(data[i].plan, (err, plan)=>{
                  if (days == 2) {
                    got.post("http://localhost:9000/missing2",{searchParams: {send: sendMensagge, phone: numWhats, service: plan.typeService, pay: saldo, typeAcount: typeAcountThis}})
                  }
                  if (days == 1) {
                    got.post("http://localhost:9000/missing1",{searchParams: {send: sendMensagge, phone: numWhats, service: plan.typeService, pay: saldo, typeAcount: typeAcountThis}})
                  }
                  if (days == 0) {
                    studentSchema.findByIdAndUpdate(idUpdate,{$set: {'status': 0}}, (err, data2)=>{})
                    got.post("http://localhost:9000/noMissing",{searchParams: {send: sendMensagge, phone: numWhats, service: plan.typeService, pay: saldo, typeAcount: typeAcountThis}})
                  }
              })
          }
      }
    })
  }
  sendRememberDay(1)
  sendRememberDay(2)
  sendRememberDay(0)






});


function ensureToken(req, res, next){
  const bererHeader = req.headers['authorization'];
  if (bererHeader != undefined) {
      const berer = bererHeader.split(" ")
      const bererToken = berer[1]
      req.token = bererToken
      next()

  } else {
    console.log('/***')
  }
}

router.route('/').get(ensureToken, (req, res) => {
  var arrayResponse = []

  jwt.verify(req.token, 'ENSURE_KEY258741', (err, dat) =>{
      if(err){
          res.sendStatus(403)
          console.log('no autorized')
      } else {
//si el toquen existe buscamos todos los usuarios en la base de datos
          studentSchema.find((error, data) => {
            if (error) {
              return next(error)
            } else {
//ahora deglosamos los datos y los procesamos uno por uno buscando su plan correspondiente
                for (let i=0; i < data.length; i++) {
                 servicesSchema.findById(data[i].plan, (err, plan)=>{

                    if (err) {
                      console.log(err)
                    }else{
                      
                      var setingState = ""

                      if (data[i].status == 0) {
                        setingState = "Suspendido 😕"
                      }
                      if (data[i].status == 1) {
                        setingState = "Pagado 😀"
                      }
                      if (data[i].status == 2) {
                        setingState = "Prorroga 😐"
                      }
//editamos el plan: primero era id ahora es el nombre correspondiente y los agrupamos en un array
                    if (data[i].typeAcount != '') {
                      var expired = new Date(data[i].vence)
                      var totalVence = expired.getFullYear() +"/"+ (expired.getMonth()+1) +"/"+ expired.getDate()
                      var long = new Date(data[i].day)
                      var totalDay = long.getFullYear() +"/"+ (long.getMonth()+1) +"/"+ long.getDate()

                      var jsonResponse =  {
                        phone: data[i].phone,
                        plan: plan.typeService,
                        planDetails: plan.details,
                        day: totalDay,
                        id: data[i]._id,
                        status: setingState,
                        vence: totalVence,
                        saldo: data[i].saldo,
                        numVence: data[i].numberVence,
                        typeAcounts: data[i].typeAcount,
                        pinNetflix: data[i].pinNetflix,
                        mail: data[i].mail,
                        pass: data[i].pass,
                        perfilNet: data[i].perfilNet,
                        nota: data[i].notes
                      }
                      arrayResponse.push(jsonResponse)
                      add(arrayResponse)
                    }
                    else{
                      var expired = new Date(data[i].vence)
                      var totalVence = expired.getFullYear() +"/"+ (expired.getMonth()+1) +"/"+ expired.getDate()
                      var long = new Date(data[i].day)
                      var totalDay = long.getFullYear() +"/"+ (long.getMonth()+1) +"/"+ long.getDate()

                      var jsonResponse =  {
                        phone: data[i].phone,
                        plan: plan.typeService,
                        planDetails: plan.details,
                        day: totalDay,
                        id: data[i]._id,
                        status: setingState,
                        vence: totalVence,
                        saldo: data[i].saldo,
                        numVence: data[i].numberVence,
                        typeAcounts: '',
                        pinNetflix: '',
                        mail: data[i].mail,
                        pass: data[i].pass,
                        perfilNet: data[i].perfilNet,
                        nota: data[i].notes
                      }

                      arrayResponse.push(jsonResponse)
                      add(arrayResponse)
                    }                       
                  }
                })
              }
          }
//ahora esperamos a que el for agrupe todos los usuarios editados y verificamos que la cantidad de elementos en el array
//sea la misma que esta en la base de datos!
            function add(elementsPrepare){
              if (elementsPrepare.length == data.length) {
                res.json(elementsPrepare)
              }
            }
          }).sort({date: 'desc'})
      }
  })
})

router.route('/services').get(ensureToken, (req, res) => {
  var arrayResponse = []

  jwt.verify(req.token, 'ENSURE_KEY258741', (err, dat) =>{
      if(err){
          res.sendStatus(403)
          console.log('no autorized')

      } else {
          servicesSchema.find((err, service)=>{
              if (err) {
                console.log(err)
              }else{
                res.json(service)
              }
          })
      }
  })
})

router.route('/edit-student/:id').get((req, res) => {
  studentSchema.findById(req.params.id, (error, data) => {
    servicesSchema.findById(data.plan, (err, plan)=>{

        const userObject = {
          phone:data.phone,
          status: data.status,
          plan: plan.typeService,
          saldo: data.saldo,
          numVence: data.numberVence,
          vence: data.vence,
          note: data.notes
        };

        if (error) {
          return next(error)
        } else {
          res.json(userObject)
        }
    })
  })
})

router.route('/update-service').put((req, res, next) => {
    const objectService = {
      typeService: req.body.name,
      price: req.body.price
    }
    servicesSchema.findByIdAndUpdate(req.body.id, {$set: objectService},
    (error, data) => {
      if (error) {
        return next(error);
        console.log(error)
      } else {
        res.json(data)
        console.log('service updated successfully !')
      }
    })
})

router.route('/update-user/:id').put((req, res, next) => {
    servicesSchema.find({"typeService" : req.body.plan}, (err, dataService)=>{
        if (err) {
              res.json({'message': 'non selected'})
        }else{

         var lemitProsess = new Date(req.body.vence)
         //e.setMonth(e.getMonth() + lemitProsess)
         //var totalVence = e.getFullYear() +"/"+ (e.getMonth()+1) +"/"+ e.getDate()
         var b = new Date()

         missingThisMonths = 0
         while(b < lemitProsess){
           b.setMonth(b.getMonth() + 1)
           missingThisMonths++ 
         }
         console.log(missingThisMonths)
         console.log()
                if (dataService[0].typeService == "Netflix") {
                  var saldoNetflix = "";
                  if(req.body.typeAcc == 'Basico'){
                     saldoNetflix = missingThisMonths*3
                  }

                  if(req.body.typeAcc == 'Estandar'){
                    saldoNetflix = missingThisMonths*9
                  }

                  if(req.body.typeAcc == 'Premium'){
                    saldoNetflix = missingThisMonths*12
                  }

                  const userObject = {
                      phone: req.body.phone,
                      status: req.body.status,
                      vence: lemitProsess,
                      numberVence: req.body.numVence,
                      typeAcount: req.body.typeAcc,
                      saldo: saldoNetflix,
                      plan: dataService[0]._id,
                      notes: req.body.nota,
                      perfilNet: req.body.perfilNet,
                      pinNetflix: req.body.pinNet,
                      send: req.body.send
                  };

                  studentSchema.findByIdAndUpdate(req.params.id, {
                    $set: userObject
                  }, (error, data) => {
                    if (error) {
                      return next(error);
                      console.log(error)
                    } else {
                      res.json(data)
                      console.log('Student updated successfully !')
                    }
                  })

              }else{
                  const userObject = {
                      phone: req.body.phone,
                      status: req.body.status,
                      vence: lemitProsess,
                      numberVence: req.body.numVence,
                      typeAcount: req.body.typeAcc,
                      saldo: Number(dataService[0].price)*missingThisMonths,
                      plan: dataService[0]._id,
                      notes: req.body.nota,
                      perfilNet: '',
                      pinNetflix: '',
                      send: req.body.send
                  };

                  studentSchema.findByIdAndUpdate(req.params.id, {
                    $set: userObject
                  }, (error, data) => {
                    if (error) {
                      return next(error);
                      console.log(error)
                    } else {
                      res.json(data)
                      console.log('Student updated successfully !')
                    }
                  })

              }
        }
    })
    console.log( new Date(req.body.vence))
})

router.route('/delete-user/:id').delete(ensureToken,(req, res, next) => {
  jwt.verify(req.token, 'ENSURE_KEY258741', (err, dat) =>{
      if(err){
          res.sendStatus(403)
          console.log('no autorized')
      } else {
        studentSchema.findByIdAndRemove(req.params.id, (error, data) => {
          if (error) {
            return next(error);
          } else {
            res.status(200).json({
              msg: data
            })
          }
        })        
      }
  })
})
module.exports = router;