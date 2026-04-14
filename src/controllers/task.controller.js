import { getAllTasksOfUser, createTaskOfUser, editTaskById, deleteTaskById, getTasksByFilter, getTaskById } from '../models/task.model.js';
import { getUserByName } from '../models/user.model.js';

// Función auxiliar para convertir a booleano (NUEVO)
const toBoolean = (val) => {
    if (typeof val === "boolean") return val;
    if (typeof val === "string") {
        const s = val.toLowerCase().trim();
        return s === "true" || s === "1" || s === "yes" || s === "si";
    }
    if (typeof val === "number") return val === 1;
    return false;
};

const taskValidate = (titulo, descripcion, categoria, fecha_limite) =>{
    // El titulo es lo importante para crear la tarea, por lo que verificamos que no este vacio o tenga solo espacios en blanco
    if (!titulo || titulo.trim() === "") {
        return { error: "El título es obligatorio" };
    }
        
    // No sucede lo mismo con la descripcion porque puede ser opcional
    const descripcionFinal = descripcion && descripcion.trim() !== "" ? descripcion : "";

    // Si la categoria esta vacia o en blanco, le asignamos una categoria General por defecto 
    const categoriaFinal = categoria && categoria.trim() !== "" ? categoria : "General";

    // Validación de fecha
    const fechaTarea = new Date(fecha_limite);
    const hoy = new Date();
    const fechaFinal = (!fecha_limite || fechaTarea < hoy) ? hoy : fechaTarea;

    return { titulo, descripcion: descripcionFinal, categoria: categoriaFinal, fecha_limite: fechaFinal };
}

export const getTasks = async (req, res) => {
    try {
        const { nombre } = req.query;

        // Verificamos que el nombre de usuario no este vacio o tenga solo espacios en blanco 
        if(!nombre || nombre.trim() === "") {
            return res.status(400).json({ mensaje: "El nombre de usuario no puede estar vacío" });
        }

        const user = await getUserByName(nombre);

        // Verificamos que el usuario exista en la BD
        if (!user) {
            return res.status(404).json({ mensaje: 'Usuario no existe' });
        }

        const tasks = await getAllTasksOfUser(nombre);

        res.json(tasks);
    } catch (error) {
        console.log('Error al obtener las tareas: ', error);
        res.status(500).json({ mensaje: 'Error al obtener las tareas' });
    }
}

export const createTask = async (req, res) => {
    try {
        const { nombreUsuario, titulo, descripcion, pendiente, categoria, fecha_limite } = req.body;

        // NUEVO: Convertimos 'pendiente' a booleano real soportando 1, 0, "true", "false"
        const pendienteFinal = toBoolean(pendiente);

        // Verificamos que el nombre de usuario no este vacio o tenga solo espacios en blanco
        if (!nombreUsuario || nombreUsuario.trim() === "") { 
            return res.status(400).json({ mensaje: "Usuario obligatorio" });
        }

        //Validamos los campos de la tarea, si hay error se manda un status 400
        const validacion = taskValidate(titulo, descripcion, categoria, fecha_limite);
        if (validacion.error) {
            return res.status(400).json({ mensaje: validacion.error });
        }

        const user = await getUserByName(nombreUsuario);

        // Verificamos que el usario existe en la BD antes de crear la tarea
        if (!user) {
            return res.status(404).json({ mensaje: 'Usuario no existe' });
        }

        await createTaskOfUser(nombreUsuario, validacion.titulo, validacion.descripcion, pendienteFinal, validacion.categoria, validacion.fecha_limite);
        
        // Se crea la tarea correctamente, mandamos un status 201 con un mensaje de exito
        res.status(201).json({ message: "Tarea creada correctamente" });
    } catch (error) {
        console.log('Error al crear la tarea: ', error);
        res.status(500).json({ mensaje: 'Error al crear tarea' });
    }
}

export const editTask = async (req, res) => {
    try {
        const { id, titulo, descripcion, pendiente, categoria, fecha_limite } = req.body;

        // Validar que exista un id que se asocie para editar, eliminar y consultar la tarea
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ mensaje: "ID inválido" });
        }

        // NUEVO: Verificar si la tarea existe en la BD antes de intentar editar
        const taskExists = await getTaskById(id);
        if (!taskExists) {
            return res.status(404).json({ mensaje: "No se puede editar: La tarea no existe" });
        }

        //Validacion de tarea, si hay error mandamos un status
        const validacion = taskValidate(titulo, descripcion, categoria, fecha_limite);
        if (validacion.error) {
            return res.status(400).json({ mensaje: validacion.error });
        }

        // NUEVO: Conversión de booleano
        const pendienteFinal = toBoolean(pendiente);


        await editTaskById(id, validacion.titulo, validacion.descripcion, pendienteFinal, validacion.categoria, validacion.fecha_limite);
        res.status(200).json({ message: "Tarea editada correctamente" });
    } catch (error) {
        console.log('Error al editar tarea: ', error);
        res.status(500).json({ mensaje: 'Error al editar tarea' });
    }
}

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.body;

        // Validar que exista un id que se asocie
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ mensaje: "ID inválido" });
        }

        // NUEVO: Verificar si la tarea existe antes de borrar
        const taskExists = await getTaskById(id);
        if (!taskExists) {
            return res.status(404).json({ mensaje: "No se puede eliminar: La tarea no existe" });
        }

        await deleteTaskById(id);

        // Tarea es eliminada con exito
        res.status(200).json({ message: "Tarea eliminada correctamente" });
    } catch (error) {
        console.log('Error al eliminar tarea: ', error);
        res.status(500).json({ mensaje: 'Error al eliminar tarea' });
    }
}

export const getTasksFilter = async (req, res) => {
    try {
        let { nombre, categoria } = req.body;

        // Valida que el nombre no este vacio o tenga solo espacios en blanco
        if (!nombre || nombre.trim() === "") {
            return res.status(400).json({ mensaje: "Nombre obligatorio" });
        }

        // Si la categoria esta vacia o en blanco obtendremos solo las tareas generales
        if (!categoria || categoria.trim() === "") {
            categoria = "General";
        }
        
        const tasks = await getTasksByFilter(nombre, categoria);

        // Se obtienen las tareas con el filtro aplicado 
        res.status(200).json(tasks);
    } catch (error) {
        console.log('Error al filtrar las tareas: ', error);
        res.status(500).json({ mensaje: 'Error al filtrar tarea' });
    }
}

export const getTask = async (req, res) => {
    try {
        const { id } = req.query;

        // Validar que exista un id que se asocie
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ mensaje: "ID inválido" });
        }

        const task = await getTaskById(id);

        // Validamos si la tarea existe en la base de datos
        if (!task) {
            return res.status(404).json({ mensaje: "Tarea no encontrada" });
        }

        // Las tareas se obtienen con exito
        res.status(200).json(task);
    } catch (error) {
        console.log('Error al obtener tarea: ', error);
        res.status(500).json({ mensaje: 'Error al obtener tarea' });
    }
}