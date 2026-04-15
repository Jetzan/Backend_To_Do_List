//Importar librerias
import express from "express";
import cors from "cors";
import routesTasks from './routes/task.routes.js';
import routesUser from './routes/auth.routes.js'

//Inicializar express
const app = express();




app.use(cors({
  origin: function(origin, callback) {
    const allowed = [
      'http://localhost:4200',
      'https://hugodelgadolucio.github.io'
    ];

    if (!origin) return callback(null, true); // Postman, etc.

    if (allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());



//Ruta principal

app.get('/',(req,res) =>{
    res.send('API funcionando')
});

app.use('/tasks',routesTasks);
app.use('/user',routesUser);



export default app;