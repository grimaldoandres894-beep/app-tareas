const express = require("express");
const router = express.Router();
const db = require("../database");

// Crear tarea
router.post("/", (req, res) => {
 const { title, user_id } = req.body;

 db.run(
   "INSERT INTO tasks(title, user_id) VALUES(?, ?)",
   [title, user_id],
   function(err) {
     if (err) return res.send(err);
     res.send({ id: this.lastID, title, user_id });
   }
 );
});

// Obtener tareas con usuario (JOIN)
router.get("/", (req, res) => {
 db.all(`
   SELECT tasks.id, tasks.title, users.name
   FROM tasks
   JOIN users ON tasks.user_id = users.id
 `, [], (err, rows) => {
   res.send(rows);
 });
});

module.exports = router;
