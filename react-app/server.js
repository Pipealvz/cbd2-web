const express = require('express');
const app = express();
require('dotenv').config();

const db = require('./config/db-oracle');
const routes = require('./routes/index');
const port = 26001;

app.use(express.json());

app.use('/api', routes);

(async () => {
  try {
    await db.initialize();
    await db.testCon();
    console.log("Oracle inicializado correctamente.");

    app.listen(port, () =>
      console.log(`Servidor ejecutándose en puerto ${port}`)
    );

  } catch (err) {
    console.error("Error iniciando servidor:", err);
  }
})();