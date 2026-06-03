const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nombreCompleto: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  correo: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
}, {
  timestamps: true,
  paranoid: true, 
  tableName: 'usuarios',
  hooks: {
    afterDestroy: async (usuario, options) => {
      const Reserva = sequelize.models.Reserva;
      if (Reserva) {
        await Reserva.update(
          { estado: 'Cancelada' }, 
          { where: { UsuarioId: usuario.id, estado: 'Activa' }, transaction: options.transaction }
        );
      }
    }
  }
});

module.exports = Usuario;