const db = require('../config/db-oracle');

// Obtener todos los registros
exports.getAll = async (req, res) => {
  try {
    const result = await db.execute(`SELECT * FROM Detalle_Repuesto`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener por ID (usando id_repuesto como identificador)
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.execute(
      `SELECT * FROM Detalle_Repuesto WHERE id_repuesto = ${id}`
    );
    res.json(result.rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear nuevo registro
exports.create = async (req, res) => {
  try {
    const {
      id_repuesto,
      nombre_rep,
      descripcion_rep,
      serial_rep,
      id_marca,
      id_tipo_rep,
      estado_disp,
      id_factura,
      id_solicitud,
      precio_und
    } = req.body;

    await db.execute(
      `INSERT INTO Detalle_Repuesto (
        id_repuesto, nombre_rep, descripcion_rep, serial_rep,
        id_marca, id_tipo_rep, estado_disp, id_factura,
        id_solicitud, precio_und
      ) VALUES (
        ${id_repuesto}, ${nombre_rep}, ${descripcion_rep}, ${serial_rep},
        ${id_marca}, ${id_tipo_rep}, ${estado_disp}, ${id_factura},
        ${id_solicitud}, ${precio_und}
      )`
    );

    res.status(201).json({ message: 'Detalle_Repuesto creado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar registro
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre_rep,
      descripcion_rep,
      serial_rep,
      id_marca,
      id_tipo_rep,
      estado_disp,
      id_factura,
      id_solicitud,
      precio_und
    } = req.body;

    await db.execute(
      `UPDATE Detalle_Repuesto
       SET 
         nombre_rep = ${nombre_rep},
         descripcion_rep = ${descripcion_rep},
         serial_rep = ${serial_rep},
         id_marca = ${id_marca},
         id_tipo_rep = ${id_tipo_rep},
         estado_disp = ${estado_disp},
         id_factura = ${id_factura},
         id_solicitud = ${id_solicitud},
         precio_und = ${precio_und}
       WHERE id_repuesto = ${id}`
    );

    res.json({ message: 'Detalle_Repuesto actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar registro
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute(
      `DELETE FROM Detalle_Repuesto WHERE id_repuesto = ${id}`
    );
    res.json({ message: 'Detalle_Repuesto eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
