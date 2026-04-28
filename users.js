const express = require("express");
const router = express.Router();
const db = require("../database");

// Crear usuario
router.post("/", (req, res) => {
 const { name } = req.body;

 db.run("INSERT INTO users(name) VALUES(?)", [name], function(err) {
   if (err) return res.send(err);
   res.send({ id: this.lastID, name });
 });
});

// Obtener usuarios
router.get("/", (req, res) => {
 db.all("SELECT * FROM users", [], (err, rows) => {
   res.send(rows);
 });
});

module.exports = router;
