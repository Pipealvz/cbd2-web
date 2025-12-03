const db = require('../config/db-oracle');

module.exports = {
    getAll: async (req, res) => {
        try {
            const conn = await db.getConnection();
            const result = await conn.execute(`SELECT * FROM Rol`);
            await conn.close();
            res.json(result.rows);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    getById: async (req, res) => {
        try {
            const conn = await db.getConnection();
            const result = await conn.execute(
                `SELECT * FROM Rol WHERE id_rol = :id_rol`,
                [req.params.id_rol]
            );
            await conn.close();
            res.json(result.rows[0] || null);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    create: async (req, res) => {
        try {
            const conn = await db.getConnection();
            await conn.execute(
                `INSERT INTO Rol (id_rol, nombre_rol, descripcion_rol) VALUES (:id_rol, :nombre_rol, :descripcion_rol)`,
                [req.body.id_rol, req.body.nombre_rol, req.body.descripcion_rol]
            );
            await conn.commit();
            await conn.close();
            res.json({ message: "Creado correctamente" });
        } catch (err) {
            res.status(500).json({ error: err.message });
            res.json({ error: "Fallo al crear." });
        }
    },
    update: async (req, res) => {
        try {
            const conn = await db.getConnection();
            await conn.execute(
                `UPDATE Rol SET nombre_rol = :nombre_rol, descripcion_rol = :descripcion_rol WHERE id_rol = :id_rol`,
                [req.body.nombre_rol, req.body.descripcion_rol, req.params.id_rol]
            );
            await conn.commit();
            await conn.close();
            res.json({ message: "Actualizado correctamente" });
        } catch (err) {
            res.status(500).json({ error: err.message });
            res.json({ error: "Fallo al actualizar." });
        }
    },
    delete: async (req, res) => {
        try {
            const conn = await db.getConnection();
            await conn.execute(
                `DELETE FROM Rol WHERE id_rol = :id_rol`,
                [req.params.id_rol]
            );
            await conn.commit();
            await conn.close();
            res.json({ message: "Eliminado correctamente" });
        } catch (err) {
            res.status(500).json({ error: err.message });
            res.json({ error: "Fallo al eliminar." });
        }
    }
};
