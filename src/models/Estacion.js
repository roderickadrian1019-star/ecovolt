const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const Estacion = sequelize.define('Estacion', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING(120),
    allowNull: false,
  },
  latitud: {
    type: DataTypes.DECIMAL(9, 6),
    allowNull: false,
    validate: {
      min: -4.0,  
      max: 13.0,  
    }
  },
  longitud: {
    type: DataTypes.DECIMAL(9, 6),
    allowNull: false,
    validate: {
      min: -79.0, 
      max: -66.0, 
    }
  },
  precioKw: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0.0,
    }
  },
}, {
  timestamps: true,
  tableName: 'estaciones',
  hooks: {
    beforeUpdate: (estacion) => {
      if (estacion.changed('precioKw')) {
        const precioAnterior = estacion._previousDataValues.precioKw;
        const precioNuevo = estacion.precioKw;
        if (precioNuevo > precioAnterior * 1.5) {
          throw new Error('Cambio de precio absurdo detectado. No se permite un aumento mayor al 50%.');
        }
      }
    }
  }
});

module.exports = Estacion;