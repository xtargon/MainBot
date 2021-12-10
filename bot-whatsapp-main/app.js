const fs = require('fs');
const mimeDb = require('mime-db')
const express = require('express');
const moment = require('moment');
const ora = require('ora');
const chalk = require('chalk');
const ExcelJS = require('exceljs');
const qrcode = require('qrcode-terminal');

const { flowConversation } = require('./conversation')
const { Client, MessageMedia } = require('whatsapp-web.js');
const app = express();
app.use(express.urlencoded({ extended: true }))
const SESSION_FILE_PATH = './session.json';
let client;
let sessionData;

/*
 conexion a la base de datos:
*/
const tiempoTranscurrido = Date.now();
const hoy = new Date(tiempoTranscurrido+3);

var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/reactdb', {
  useNewUrlParser: true
}).then(() => {
  console.log('Database sucessfully connected!')
},
  error => {
    console.log('Could not connect to database : ' + error)
  }
)

let usersSchema = require('./models/users');
//extraccion de usuarios por status (Por pagar...)
const extractUserByStatus = () =>{
    var status = 0
    let users = [];

    usersSchema.find({'': status}, (error, data) => {
        if (error) {
            return next(error)
        } else {
            for(i=0; i<data.length; i++){
                
          }
        }
    })
} 

/**
 * Guardamos archivos multimedia que nuestro cliente nos envie!
 * @param {*} media 
 */
const saveMedia = (media) => {

    const extensionProcess = mimeDb[media.mimetype]
    const ext = extensionProcess.extensions[0]
    fs.writeFile(`./media/${media.filename}.${ext}`, media.data, { encoding: 'base64' }, function (err) {
        console.log('** Archivo Media Guardado **');
    });
}



/**
 * Enviamos archivos multimedia a nuestro cliente
 * @param {*} number 
 * @param {*} fileName 
 */
const sendMedia = (number, fileName) => {
    number = number.replace('@c.us', '');
    number = `${number}@c.us`
    const media = MessageMedia.fromFilePath(`./mediaSend/${fileName}`);
    client.sendMessage(number, media);
}

/**
 * Enviamos un mensaje simple (texto) a nuestro cliente
 * @param {*} number 
 */
const sendMessage = (number = null, text = null) => {
    number = number.replace('@c.us', '');
    number = `${number}@c.us`
    const message = text || `Hola`;
    client.sendMessage(number, message);
    readChat(number, message)
    console.log(`${chalk.red('⚡⚡⚡ Enviando mensajes....')}`);
}

/**
 * Escuchamos cuando entre un mensaje
 */
const listenMessage = () => {
    client.on('message', async msg => {
        const { from, to, body } = msg;  

        await greetCustomer(from);
        console.log(from);

        console.log(body);

        client.sendMessage(from, body);

        // await readChat(from, body)
        // console.log(`${chalk.red('⚡⚡⚡ Enviando mensajes....')}`);
        // console.log('Guardar este número en tu Base de Datos:', from);

    });
}

/**
 * Response a pregunta
 */

const replyAsk = (from, answer) => new Promise((resolve, reject) => {
    console.log(`---------->`, answer);
    if (answer === 'registro') {
        sendMessage( 'meme-1.png')
        resolve(true)
    }

})

/**
 * Revisamos si tenemos credenciales guardadas para inciar sessio
 * este paso evita volver a escanear el QRCODE
 */
const withSession = () => {
    // Si exsite cargamos el archivo con las credenciales
    const spinner = ora(`Cargando ${chalk.yellow('Validando session con Whatsapp...')}`);
    sessionData = require(SESSION_FILE_PATH);
    spinner.start();
    client = new Client({
        session: sessionData
    });

    client.on('ready', () => {
        console.log('Client is ready!');
        spinner.stop();

       // sendMessage("hola");
        // sendMedia();

        connectionReady();

    });



    client.on('auth_failure', () => {
        spinner.stop();
        console.log('** Error de autentificacion vuelve a generar el QRCODE (Borrar el archivo session.json) **');
    })


    client.initialize();
}

/**
 * Generamos un QRCODE para iniciar sesion
 */
const withOutSession = () => {
    console.log('No tenemos session guardada');
    client = new Client();
    client.on('qr', qr => {
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
        console.log('Client is ready!');
        connectionReady();
    });

    client.on('auth_failure', () => {
        console.log('** Error de autentificacion vuelve a generar el QRCODE **');
    })


    client.on('authenticated', (session) => {
        // Guardamos credenciales de de session para usar luego
        sessionData = session;
        fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
            if (err) {
                console.log(err);
            }
        });
    });

    client.initialize();
}

const connectionReady = () => {
    listenMessage();
    readExcel();
}

/**
 * Difundir mensaje a clientes
 */
const readExcel = async () => {
    const pathExcel = `./chats/clientes-saludar.xlsx`;
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(pathExcel);
    const worksheet = workbook.getWorksheet(1);
    const columnNumbers = worksheet.getColumn('A');
    columnNumbers.eachCell((cell, rowNumber) => {
        const numberCustomer = cell.value

        const columnDate = worksheet.getRow(rowNumber);
        let prevDate = columnDate.getCell(2).value;
        prevDate = moment.unix(prevDate);
        const diffMinutes = moment().diff(prevDate, 'minutes');

        // Si ha pasado mas de 60 minuitos podemos enviar nuevamente
        if (diffMinutes > 60) {
            sendMessage(numberCustomer)
            columnDate.getCell(2).value = moment().format('X')
            columnDate.commit();

        }
    });

    workbook.xlsx.writeFile(pathExcel);

}


/**
 * Guardar historial de conversacion
 * @param {*} number 
 * @param {*} message 
 */
const readChat = async (number, message) => {
    const pathExcel = `./chats/${number}.xlsx`;
    const workbook = new ExcelJS.Workbook();
    const today = moment().format('DD-MM-YYYY hh:mm')

    if (fs.existsSync(pathExcel)) {
        /**
         * Si existe el archivo de conversacion lo actualizamos
         */
        const workbook = new ExcelJS.Workbook();
        workbook.xlsx.readFile(pathExcel)
            .then(() => {
                const worksheet = workbook.getWorksheet(1);
                const lastRow = worksheet.lastRow;
                var getRowInsert = worksheet.getRow(++(lastRow.number));
                getRowInsert.getCell('A').value = today;
                getRowInsert.getCell('B').value = message;
                getRowInsert.commit();
                workbook.xlsx.writeFile(pathExcel);
            });

    } else {
        /**
         * NO existe el archivo de conversacion lo creamos
         */
        const worksheet = workbook.addWorksheet('Chats');
        worksheet.columns = [
            { header: 'Fecha', key: 'number_customer' },
            { header: 'Mensajes', key: 'message' }
        ];
        worksheet.addRow([today, message]);
        workbook.xlsx.writeFile(pathExcel)
            .then(() => {

                console.log("saved");
            })
            .catch((err) => {
                console.log("err", err);
            });
    }
}

/**
 * Saludos a primera respuesta
 * @param {*} req 
 * @param {*} res 
 */

const greetCustomer = (from) => new Promise((resolve, reject) => {
    from = from.replace('@c.us', '');

    const pathExcel = `./chats/${from}@c.us.xlsx`;
    if (!fs.existsSync(pathExcel)) {
        const firstMessage = [
            'Bienvenido al servicio de straming',
            'Si quieres registrarte escribe *registro*"'
        ].join(' ')

        sendMessage(from, firstMessage)
        
    }
    resolve(true)
})

/**
 * Controladores
 */

const sendMessagePost = (req, res) => {
    const { message, number } = req.body
    console.log(message, number);
    sendMessage(number, message)
    res.send({ status: 'Enviado!' })
}

/**
 * Rutas
 */

app.post('/missing1', (req, res) => {
    console.log(req.query.phone)
    client.sendMessage(req.query.phone+'@c.us', 'Buenas! a partir de hoy falta 1 dia para terminar tu servicio: '+req.query.service+', si deseas continuar con él es necesario que realices el pago al numero de cuenta {NUMERO_CUENTA}  en caso de ser depósito o si es por medio de transferencia a la cuenta {CUENTA_TRANSFERENCIA}te recuerdo que tu plan actual es $'+req.query.pay+'.')
})


app.post('/missing2', (req, res) => {
    console.log(req.query.phone)
    client.sendMessage(req.query.phone+'@c.us', 'Buenas! a partir de hoy falta 2 dias para terminar tu servicio: '+req.query.service+', si deseas continuar con él es necesario que realices el pago al numero de cuenta {NUMERO_CUENTA}  en caso de ser depósito o si es por medio de transferencia a la cuenta {CUENTA_TRANSFERENCIA}te recuerdo que tu plan actual es $'+req.query.pay+'.')
})


app.post('/noMissing', (req, res) => {
    console.log(req.query.phone)
    client.sendMessage(req.query.phone+'@c.us', 'Buenas! hoy termina tu servicio: '+req.query.service+', si deseas continuar con él es necesario que realices el pago al numero de cuenta {NUMERO_CUENTA}  en caso de ser depósito o si es por medio de transferencia a la cuenta {CUENTA_TRANSFERENCIA}te recuerdo que tu plan actual es $'+req.query.pay+'.')
})

app.post('/send', sendMessagePost);


/**
 * Revisamos si existe archivo con credenciales!
 */
(fs.existsSync(SESSION_FILE_PATH)) ? withSession() : withOutSession();


app.listen(9000, () => {
    console.log('Server ready!');
})