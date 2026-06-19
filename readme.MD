# Justificación de comportamientos ON DELETE

## 1. Estacion → Conector (`SET NULL`)

```js
Estacion.hasMany(Conector, { onDelete: 'SET NULL', foreignKey: { allowNull: true } });
Conector.belongsTo(Estacion, { onDelete: 'SET NULL' });
```

## Justificación
- Si se elimina una estación, la clave foránea `EstacionId`
  en el conector queda en `NULL` en lugar de eliminar el conector.

---

## 2. Usuario → Reserva (hook `afterDestroy`)

```js
hooks: {
  afterDestroy: async (usuario, options) => {
    await Reserva.update(
      { estado: 'Cancelada' },
      { where: { UsuarioId: usuario.id, estado: 'Activa' },
        transaction: options.transaction }
    );
  }
}
```

### Justificación
- Al eliminar un usuario sus reservas activas cambian a `Cancelada`
  en lugar de borrarse físicamente.

---

## 3. Conector → Reserva (`CASCADE`)

```js
Usuario.belongsToMany(Conector, { through: Reserva, onDelete: 'CASCADE' });
Conector.belongsToMany(Usuario, { through: Reserva, onDelete: 'CASCADE' });
```

### Justificación
- Si se elimina un conector, todas sus reservas se eliminan
  en cascada automáticamente.

---

## 4. Cupon → Descuento (`SET NULL`)

```js
Cupon.hasMany(Descuento, { onDelete: 'SET NULL', foreignKey: { allowNull: true } });
Descuento.belongsTo(Cupon, { onDelete: 'SET NULL' });
```

### Justificación
- Si se elimina un cupón, los descuentos que lo usaron conservan
  su registro pero con `CuponId` en `NULL`.

---

## 5. Reserva → Descuento (`CASCADE`)

```js
Reserva.hasMany(Descuento, { onDelete: 'CASCADE' });
Descuento.belongsTo(Reserva, { onDelete: 'CASCADE' });
```

### Justificación
- Si se elimina una reserva, todos sus descuentos se eliminan
  en cascada automáticamente.

---

# El diagrama del MER
![alt text](image.png)