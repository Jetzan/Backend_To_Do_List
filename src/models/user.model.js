import pool from "../config/db.js";


 export async function createUser(nombre,password) {
    const [result] = await pool.query('INSERT INTO usuarios (nombre,password) VALUES (?, ?)',[nombre, password]);
    return result;
}

 export async function getUserByName(nombre) {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE nombre = ?',[nombre]);
    return rows[0];
}
