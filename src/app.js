require('dotenv').config();
const express = require('express');
const sequelize = require('./Config/database');
const Usuario = require('./Models/Usuario');
const Estacion = require('./Models/Estacion');
const Conector = require('./Models/Conector');
const Reserva = require('./Models/Reserva');
const Cupon = require('./models/cupon');
const Descuento = require('./models/Descuento');


Estacion.hasMany(Conector, { onDelete: 'SET NULL', foreignKey: { allowNull: true } });
Conector.belongsTo(Estacion, { onDelete: 'SET NULL' });


Usuario.belongsToMany(Conector, { through: Reserva, onDelete: 'CASCADE' });
Conector.belongsToMany(Usuario, { through: Reserva, onDelete: 'CASCADE' });


Cupon.hasMany(Descuento, { onDelete: 'SET NULL', foreignKey: { allowNull: true } });
Descuento.belongsTo(Cupon, { onDelete: 'SET NULL' });


Reserva.hasMany(Descuento, { onDelete: 'CASCADE' });
Descuento.belongsTo(Reserva, { onDelete: 'CASCADE' });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

async function startServer() {
  try {
    console.log('Conectandose a la BD...');
    await sequelize.sync({ alter: true });
    console.log('Modelos se actualizaron correctamente');

    app.listen(PORT, () => {
      console.log(`Backend corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('No se pudo inicializar el ecosistema: ', error);
    process.exit(1);
  }
}

startServer();