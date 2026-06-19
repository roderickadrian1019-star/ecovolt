const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const Cupon = sequelize.define('Cupon', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  codigo: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  descripcion: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  porcentajeDescuento: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    validate: {
      min: 0.0,
      max: 100.0,
    }
  },
  fechaExpiracion: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
}, {
  timestamps: true,
  tableName: 'cupones',
  hooks: {
    // ON DELETE: al eliminar un cupón, los descuentos asociados
    // se marcan como inactivos para conservar el historial
    afterDestroy: async (cupon, options) => {
      const Descuento = sequelize.models.Descuento;
      if (Descuento) {
        await Descuento.update(
          { activo: false },
          {
            where: { CuponId: cupon.id, activo: true },
            transaction: options.transaction
          }
        );
      }
    }
  }
});

module.exports = Cupon;