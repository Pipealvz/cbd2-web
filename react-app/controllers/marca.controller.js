const db = require('../config/db-oracle');

module.exports = {
    getAll: async (req, res) => {
        let conn;
        try {
            conn = await db.getConnection();
            const result = await conn.execute(
                `SELECT id_marca, nombre_marca FROM MARCA ORDER BY id_marca`
            );
            res.json(result.rows);
        } catch (err) {
            res.status(500).json({ error: err.message });
        } finally {
            if (conn) await conn.close();
        }
    },

    getById: async (req, res) => {
        let conn;
        try {
            conn = await db.getConnection();
            const result = await conn.execute(
                `SELECT id_marca, nombre_marca FROM MARCA WHERE id_marca = :id`,
                { id: req.params.id }
            );
            res.json(result.rows[0] || null);
        } catch (err) {
            res.status(500).json({ error: err.message });
        } finally {
            if (conn) await conn.close();
        }
    },

    create: async (req, res) => {
        let conn;
        try {
            const { id_marca, nombre_marca } = req.body;

            if (!id_marca || !nombre_marca) {
                return res.status(400).json({ error: "id_marca y nombre_marca son requeridos." });
            }

            conn = await db.getConnection();
            await conn.execute(
                `INSERT INTO MARCA (id_marca, nombre_marca) 
                 VALUES (:id_marca, :nombre_marca)`,
                { id_marca, nombre_marca }
            );
            await conn.commit();

            res.json({ message: "Marca creada correctamente" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        } finally {
            if (conn) await conn.close();
        }
    },

    update: async (req, res) => {
        let conn;
        try {
            const { nombre_marca } = req.body;

            if (!nombre_marca) {
                return res.status(400).json({ error: "nombre_marca es requerido." });
            }

            conn = await db.getConnection();
            await conn.execute(
                `UPDATE MARCA 
                 SET nombre_marca = :nombre_marca 
                 WHERE id_marca = :id_marca`,
                { nombre_marca, id_marca: req.params.id }
            );
            await conn.commit();

            res.json({ message: "Marca actualizada correctamente" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        } finally {
            if (conn) await conn.close();
        }
    },

    delete: async (req, res) => {
        let conn;
        try {
            conn = await db.getConnection();
            await conn.execute(
                `DELETE FROM MARCA WHERE id_marca = :id`,
                { id: req.params.id }
            );
            await conn.commit();
            res.json({ message: "Marca eliminada correctamente" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        } finally {
            if (conn) await conn.close();
        }
    }
};
