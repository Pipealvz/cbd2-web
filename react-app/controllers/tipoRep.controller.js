const db = require('../config/db-oracle');

module.exports = {
    getAll: async (req, res) => {
        let conn;
        try {
            conn = await db.getConnection();
            const result = await conn.execute(
                `SELECT id_tipo_rep, nombre_tipo_rep 
                 FROM TIPO_REP 
                 ORDER BY id_tipo_rep`
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
                `SELECT id_tipo_rep, nombre_tipo_rep 
                 FROM TIPO_REP 
                 WHERE id_tipo_rep = :id`,
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
            const { id_tipo_rep, nombre_tipo_rep } = req.body;

            if (!id_tipo_rep || !nombre_tipo_rep) {
                return res
                    .status(400)
                    .json({ error: "id_tipo_rep y nombre_tipo_rep son requeridos." });
            }

            conn = await db.getConnection();
            await conn.execute(
                `INSERT INTO TIPO_REP (id_tipo_rep, nombre_tipo_rep)
                 VALUES (:id_tipo_rep, :nombre_tipo_rep)`,
                { id_tipo_rep, nombre_tipo_rep }
            );
            await conn.commit();

            res.json({ message: "Tipo_Rep creado correctamente" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        } finally {
            if (conn) await conn.close();
        }
    },

    update: async (req, res) => {
        let conn;
        try {
            const { nombre_tipo_rep } = req.body;

            if (!nombre_tipo_rep) {
                return res.status(400).json({ error: "nombre_tipo_rep es requerido." });
            }

            conn = await db.getConnection();
            await conn.execute(
                `UPDATE TIPO_REP 
                 SET nombre_tipo_rep = :nombre_tipo_rep
                 WHERE id_tipo_rep = :id_tipo_rep`,
                {
                    nombre_tipo_rep,
                    id_tipo_rep: req.params.id
                }
            );
            await conn.commit();

            res.json({ message: "Tipo_Rep actualizado correctamente" });
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
                `DELETE FROM TIPO_REP WHERE id_tipo_rep = :id`,
                { id: req.params.id }
            );
            await conn.commit();

            res.json({ message: "Tipo_Rep eliminado correctamente" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        } finally {
            if (conn) await conn.close();
        }
    }
};
