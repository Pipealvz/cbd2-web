const db = require("../config/db-oracle");

module.exports = function monitorPool(req, res, next) {
    const stats = db.getPoolStats();

    if (stats) {
        console.log("===== ORACLE POOL STATUS =====");
        console.log(`Conexiones abiertas: ${stats.open}`);
        console.log(`Conexiones en uso : ${stats.inUse}`);
        console.log(`Conexiones libres : ${stats.free}`);
        console.log(`Pool min/max     : ${stats.min}/${stats.max}`);
        console.log("================================");
    } else {
        console.log("Pool de Oracle NO inicializado.");
    }

    next();
};