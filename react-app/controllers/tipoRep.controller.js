const db = require('../config/db-oracle');

module.exports = {
    getAll: async (req, res) => {
        try {
            const conn = await db.getConnection();
            const result = await conn.execute(`SELECT * FROM Tipo_Rep`);
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
                `SELECT * FROM Tipo_Rep WHERE id_tipo_rep = :id`,
                [req.params.id]
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
                `INSERT INTO Tipo_Rep (id_tipo_rep, nombre_tipo_rep) VALUES (:id, :name)`,
                [req.body.id, req.body.name]
            );
            await conn.commit();
            await conn.close();
            res.json({ message: "Creado correctamente" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    update: async (req, res) => {
        try {
            const conn = await db.getConnection();
            await conn.execute(
                `UPDATE Tipo_Rep SET nombre_tipo_rep = :name WHERE id_tipo_rep = :id`,
                [req.body.name, req.params.id]
            );
            await conn.commit();
            await conn.close();
            res.json({ message: "Actualizado correctamente" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    delete: async (req, res) => {
        try {
            const conn = await db.getConnection();
            await conn.execute(
                `DELETE FROM Tipo_Rep WHERE id_tipo_rep = :id`,
                [req.params.id]
            );
            await conn.commit();
            await conn.close();
            res.json({ message: "Eliminado correctamente" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};
