const db = require('../config/db-oracle');

// Obtener todas las facturas
exports.getAll = async (req, res) => {
  try {
    const result = await db.execute(`SELECT * FROM Factura`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener factura por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.execute(
      `SELECT * FROM Factura WHERE id_factura = :id`,
      { id }
    );

    res.json(result.rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear nueva factura
exports.create = async (req, res) => {
  try {
    const {
      id_factura,
      subtotal_servicio,
      subtotal_repuestos,
      total_fact,
      fecha_emision,
      id_metodo,
      id_estado_pago
    } = req.body;

    await db.execute(
      `
      INSERT INTO Factura (
        id_factura,
        subtotal_servicio,
        subtotal_repuestos,
        total_fact,
        fecha_emision,
        id_metodo,
        id_estado_pago
      ) VALUES (
        :id_factura,
        :subtotal_servicio,
        :subtotal_repuestos,
        :total_fact,
        TO_DATE(:fecha_emision, 'YYYY-MM-DD'),
        :id_metodo,
        :id_estado_pago
      )
      `,
      {
        id_factura,
        subtotal_servicio,
        subtotal_repuestos,
        total_fact,
        fecha_emision,
        id_metodo,
        id_estado_pago
      },
      { autoCommit: true }
    );

    res.status(201).json({ message: 'Factura creada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar factura
exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      subtotal_servicio,
      subtotal_repuestos,
      total_fact,
      fecha_emision,
      id_metodo,
      id_estado_pago
    } = req.body;

    await db.execute(
      `
      UPDATE Factura
      SET
        subtotal_servicio = :subtotal_servicio,
        subtotal_repuestos = :subtotal_repuestos,
        total_fact = :total_fact,
        fecha_emision = TO_DATE(:fecha_emision, 'YYYY-MM-DD'),
        id_metodo = :id_metodo,
        id_estado_pago = :id_estado_pago
      WHERE id_factura = :id
      `,
      {
        subtotal_servicio,
        subtotal_repuestos,
        total_fact,
        fecha_emision,
        id_metodo,
        id_estado_pago,
        id
      },
      { autoCommit: true }
    );

    res.json({ message: 'Factura actualizada correctamente' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar factura
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    await db.execute(
      `DELETE FROM Factura WHERE id_factura = :id`,
      { id },
      { autoCommit: true }
    );

    res.json({ message: 'Factura eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
