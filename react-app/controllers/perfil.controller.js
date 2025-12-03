const db = require('../config/db-oracle');

module.exports = {
    getAll: async (req, res) => {
        try {
            const conn = await db.getConnection();
            const result = await conn.execute(`SELECT * FROM Perfil`);
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
                `SELECT * FROM Perfil WHERE id_perfil = :id_perfil`,
                [req.params.id_perfil]
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
                `INSERT INTO Perfil (id_perfil, id_rol, nombre_perfil, descripcion_perfil) VALUES (:id_perfil, :id_rol, :nombre_perfil, :descripcion_perfil)`,
                [req.body.id_perfil, req.body.id_rol, req.body.nombre_perfil, req.body.descripcion_perfil]
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
                `UPDATE Perfil SET id_rol = :id_rol, nombre_perfil = :nombre_perfil, descripcion_perfil = :descripcion_perfil WHERE id_perfil = :id_perfil`,
                [req.body.id_rol, req.body.nombre_perfil, req.body.descripcion_perfil, req.params.id_perfil]
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
                `DELETE FROM Perfil WHERE id_perfil = :id_perfil`,
                [req.params.id_perfil]
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
