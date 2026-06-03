const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const Conector = sequelize.define('Conector', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  tipo: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  potenciaMaxKw: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
  }
}, {
  timestamps: true,
  tableName: 'conectores'
});

module.exports = Conector;