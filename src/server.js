import 'dotenv/config';



//Importar el componentes app(servidor de express)
import app from "./app.js";





//Asignar puerto
const PORT = process.env.PORT || 3000;


// Escuchar en el puerto asignado
app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`);

});