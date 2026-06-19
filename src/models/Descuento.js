const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const Descuento = sequelize.define('Descuento', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  montoAhorrado: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0.0,
    }
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  fechaAplicado: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  }
}, {
  timestamps: true,
  paranoid: true, // soft delete para conservar historial
  tableName: 'descuentos',
  hooks: {
    // ON DELETE: al eliminar un descuento, se recalcula
    // el total_pagar de la reserva asociada
    afterDestroy: async (descuento, options) => {
      const Reserva = sequelize.models.Reserva;
      if (Reserva && descuento.ReservaId) {
        const reserva = await Reserva.findByPk(
          descuento.ReservaId,
          { transaction: options.transaction }
        );
        if (reserva) {
          await reserva.update(
            { total_pagar: parseFloat(reserva.total_pagar) + parseFloat(descuento.montoAhorrado) },
            { transaction: options.transaction }
          );
        }
      }
    }
  }
});

module.exports = Descuento;