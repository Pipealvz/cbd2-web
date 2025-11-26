const express = require('express');
const app = express();
require('dotenv').config();

const db = require('./config/db-oracle');
const monitorPool = require('./middleware/monitor-pool');
const routes = require('./routes/index');

app.use(express.json());
app.use(monitorPool);

app.use('/api', routes);

(async () => {
  try {
    await db.initialize();
    await db.testCon();
    console.log("Oracle inicializado correctamente.");

    app.listen(3000, () =>
      console.log("Servidor ejecutándose en puerto 3000")
    );

  } catch (err) {
    console.error("Error iniciando servidor:", err);
  }
})();