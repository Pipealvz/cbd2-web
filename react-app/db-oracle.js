// db-oracle.js
// Ejemplo de conexión a Oracle DB desde Node.js usando oracledb

const oracledb = require('oracledb');

async function connectOracle() {
  try {
    // Cambia estos valores por los de tu entorno
    const connection = await oracledb.getConnection({
      user: 'tu_usuario',
      password: 'tu_contraseña',
      connectString: 'localhost/XEPDB1' // o el servicio que corresponda
    });
    console.log('Conexión exitosa a Oracle!');
    // Puedes ejecutar queries aquí
    await connection.close();
  } catch (err) {
    console.error('Error conectando a Oracle:', err);
  }
}

module.exports = { connectOracle };
