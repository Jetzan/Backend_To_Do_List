import { getUserByName, createUser } from "../models/user.model.js";

export const register = async (req, res) => {
    try {
        const { nombre, password } = req.body;

        //Valida que el nombre no este vacio o tenga solo espacios en blanco (por lo que usamos trim() para eliminar los espacios)
        if (!nombre || nombre.trim() === "") { 
            return res.status(400).json({ mensaje: "El nombre de usuario no puede estar vacío o con solo espacios en blanco" });
        }

        //Verificamos la BD para ver si el nombre de usuario ya esta en uso 
        const user = await getUserByName(nombre);

        //Validamos si el usuario ya existe, en caso de que si retonamos un 409 indicando el uso del nombre
        if (user) {
            return res.status(409).json({ mensaje: "El nombre de usuario ya esta en uso" });
        }

        //Verificamos que la contraseña no este vacia y tenga al menos 6 caracteres, en caso de que no mandamos un error 400
        if(password == null || password === "" ){
            return res.status(400).json({mensaje: "No puede estar vacia la contraseña o con solo espacios en blanco"});

        }else if(password.length <= 5){
            return res.status(400).json({mensaje: "La contraseña debe tener al menos 6 caracteres"});
            
        }

        const result = await createUser(nombre, password);

        //Retornamos un mensaje de exito con su debido status de 201 
        res.status(201).json({ message: "Usuario creado correctamente" })

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const login = async (req, res) => {
    try {

        const { nombre, password } = req.query;

        const user = await getUserByName(nombre);

        //Validamos si el usuario existe en la base de datos, si no mandamos un mensaje de error con el status 401
        if (!user) {
            return res.status(401).json({ mensaje: 'Credenciales invalidas' });
        }

        //Validamos que la contraseña sea correcta con el usuario, si no es correcta mandamos un mensaje con el status 401
        if (password != user.password) {
            return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
        }

        //Se completa el login mandamos un status 200 con un mensaje de exito 
        console.log(`Login correcto: ${nombre}`);
        res.status(200).json({ mensaje: 'Login correcto' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}