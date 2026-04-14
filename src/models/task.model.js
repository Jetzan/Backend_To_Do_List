import pool from "../config/db.js";

export async function getAllTasksOfUser(nombre) {

    const [rows] = await pool.query('SELECT t.* FROM tareas t JOIN usuarios u ON t.id_usuario = u.id WHERE u.nombre = ?', [nombre]);
    return rows;
}

export async function createTaskOfUser(nombreUsuario, titulo , descripcion, pendiente, categoria, fecha_limite) {
    const [result] = await pool.query(`INSERT INTO tareas (id_usuario, titulo, descripcion, pendiente, categoria, fecha_limite ) VALUES ((SELECT id FROM usuarios WHERE nombre = ?),?,?,?,?,?);`,[nombreUsuario,titulo,descripcion,pendiente,categoria,fecha_limite]);

    return result;
}

export async function editTaskById(id,titulo,descripcion,pendiente,categoria,fecha_limite){
    const [result] = await pool.query('UPDATE tareas SET titulo = ? , descripcion = ? , pendiente = ?, categoria = ?, fecha_limite = ? WHERE id = ?',[titulo,descripcion,pendiente,categoria,fecha_limite,id]);

    return result;
}

export async function deleteTaskById(id){
    const [result] = await pool.query('DELETE FROM tareas WHERE id = ?',[id]);

    return result;
}

export async function getTasksByFilter(nombre,categoria){
    const [result ] = await pool.query("SELECT t.* FROM tareas t JOIN usuarios u WHERE u.nombre = ? and t.categoria = ?",[nombre,categoria]);

    return result;
}



export async function getTaskById(id){
    const [result] = await pool.query("SELECT * FROM tareas WHERE id = ?",[id]);
    return result[0];
}
