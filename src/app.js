require('dotenv').config();
const sequelize = require('./Config/database');
const Usuario = require('./Models/Usuario');
const Estacion = require('./Models/Estacion');
const Conector = require('./Models/Conector');
const Reserva = require('./Models/Reserva');

Estacion.hasMany(Conector);
Conector.belongsTo(Estacion);

Usuario.belongsToMany(Conector, { through: Reserva });
Conector.belongsToMany(Usuario, { through: Reserva })

const { start } = require('node:repl');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

async function startServer() {
    try {
        console.log('Conectandose a la BD...')
        await sequelize.sync({ alert:true });
        console.log('Modelos se actualizaron correctamente');

        app.listen(PORT, () => {
            console.log('Backend corriendo en http://localhost:${PORT}');
        })
    }  catch (error) {
        console.error('No se pudo inicializar el ecosistema: ', error)
        process.exit(1);
    }
}

startServer();