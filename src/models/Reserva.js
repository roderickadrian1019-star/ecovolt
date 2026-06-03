const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const Reserva = sequelize.define('Reserva', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  fecha_reserva: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  hora_inicio: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM('Activa', 'Completada', 'Cancelada'),
    defaultValue: 'Activa',
    allowNull: false,
  },
  total_pagar: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0.0,
    }
  }
}, {
  timestamps: true,
  tableName: 'reservas'
});

module.exports = Reserva;