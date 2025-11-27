const db = require('../config/db-oracle');

module.exports = {
    getAll: async (req, res) => {
        try {
            const conn = await db.getConnection();
            const result = await conn.execute(`SELECT * FROM Marca`);
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
                `SELECT * FROM Marca WHERE id_marca = :id`,
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
                `INSERT INTO Marca (id_marca, nombre_marca) VALUES (:id, :name)`,
                { id: req.body.id, name: req.body.name }
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
                `UPDATE Marca SET nombre_marca = :name WHERE id_marca = :id`,
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
                `DELETE FROM Marca WHERE id_marca = :id`,
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
