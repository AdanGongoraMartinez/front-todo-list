// server.js
import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import ejs from 'ejs'; // Importa ejs correctamente

// Obtener el directorio del archivo actual (equivalente a __dirname en CommonJS)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de vistas
app.set('views', path.join(__dirname, 'views'));
app.engine('html', ejs.renderFile); // Usa ejs.renderFile directamente
app.set('view engine', 'html');

// Página de login
app.get('/', (req, res) => {
    res.render('login.html');
});

// Manejo de formulario de login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const response = await axios.post('http://localhost:3000/auth/login', {
            email: email,
            password: password
        });

        if (response.data.success) {
            res.redirect('/tasks');
        } else {
            res.render('login.html', { error: 'Invalid credentials, try again.' });
        }
    } catch (error) {
        res.render('login.html', { error: 'Invalid credentials, try again.' });
    }
});

// Obtener todas las tareas
app.get('/tasks', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:3000/tasks');
        res.render('index.html', { tasks: response.data });
    } catch (error) {
        res.status(500).send('Error al obtener las tareas');
    }
});

// Crear una nueva tarea
app.post('/tasks', async (req, res) => {
    try {
        const task = { title: req.body.title };
        await axios.post('http://localhost:3000/tasks/create', task);
        res.redirect('/tasks');
    } catch (error) {
        res.status(500).send('Error al crear la tarea');
    }
});

// Actualizar tarea (completar/incompletar)
app.post('/tasks/:id/toggle', async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await axios.get(`http://localhost:3000/tasks/${taskId}`);
        await axios.post(`http://localhost:3000/tasks/update/${taskId}`, {
            completed: !task.data[0].completed
        });
        res.redirect('/tasks');
    } catch (error) {
        res.status(500).send('Error al actualizar la tarea');
    }
});

app.listen(5000, () => {
    console.log('Client is running on http://localhost:5000');
});

