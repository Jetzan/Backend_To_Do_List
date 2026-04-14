//Importar librerias
import express from "express";
import cors from "cors";
import routesTasks from './routes/task.routes.js';
import routesUser from './routes/auth.routes.js'

//Inicializar express
const app = express();

// Middlewares
app.use(cors({
    origin: 'http://localhost:4200'
}));
app.use(express.json());



//Ruta principal

app.get('/',(req,res) =>{
    res.send('API funcionando')
});

app.use('/tasks',routesTasks);
app.use('/user',routesUser);



export default app;