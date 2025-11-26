// Importar OracleDB
const oracledb = require('oracledb');
const path = require('path');

// Cargar variables .env
require('dotenv').config({
    path: path.join(__dirname, '..', '.env')
});

// Config global
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = false;

let pool;
const sql = `
            SELECT
                SYS_CONTEXT('USERENV', 'DB_NAME')        AS nombre_base_datos,
                SYS_CONTEXT('USERENV', 'SESSION_USER')   AS usuario_actual,
                (
                    SELECT DEFAULT_TABLESPACE
                    FROM DBA_USERS
                    WHERE USERNAME = SYS_CONTEXT('USERENV', 'SESSION_USER')
                ) AS tablespace_usuario
            FROM DUAL
        `;

// Config del pool
const poolConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECTION_STRING,

    poolMin: parseInt(process.env.DB_POOL_MIN) || 2,
    poolMax: parseInt(process.env.DB_POOL_MAX) || 10,
    poolIncrement: parseInt(process.env.DB_POOL_INCREMENT) || 2,
    poolTimeout: parseInt(process.env.DB_POOL_TIMEOUT) || 60,

    queueTimeout: 60000,
    enableStatistics: true
};

/**
 * Inicializa el pool **solo 1 vez**
 */
async function initialize() {
    if (pool) {
        console.log("Pool Oracle ya inicializado.");
        return;
    }

    try {
        console.log("Creando pool Oracle...");
        pool = await oracledb.createPool(poolConfig);
        console.log("Pool Oracle creado correctamente.");
    } catch (err) {
        console.error("ERROR creando el pool Oracle:", err);
        throw err;
    }
}

/**
 * Obtiene una conexión del pool
 */
async function getConnection() {
    if (!pool) {
        console.log("Pool no existe, creando...");
        await initialize();
    }

    return await pool.getConnection();
}

/**
 * Ejecuta una query rápida
 */
async function execute(query, params = {}) {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(query, params);
        await conn.commit();
        return result;
    } catch (err) {
        console.error("ERROR ejecutando query:", err);
        throw err;
    } finally {
        if (conn) await conn.close();
    }
}

/**
 * Cerrar pool al apagar servidor
 */
async function closePool() {
    try {
        if (pool) {
            console.log("Cerrando pool Oracle...");
            await pool.close(5);
            console.log("Pool Oracle cerrado.");
        }
    } catch (err) {
        console.error("ERROR cerrando pool:", err);
    }
}

async function testCon() {
    try {
        const result = await execute(sql);

        console.log("===== INFORMACIÓN ORACLE =====");
        console.log(result.rows[0]);
        console.log("================================");

        return result.rows[0];
    } catch (err) {
        console.error("ERROR en testCon():", err);
        throw err;
    }
}

module.exports = {
    initialize,
    getConnection,
    execute,
    closePool,
    testCon
};