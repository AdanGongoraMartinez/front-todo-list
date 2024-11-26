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
            res.render('success.html', { message: response.data.message });
        } else {
            res.render('login.html', { error: 'Invalid credentials, try again.' });
        }
    } catch (error) {
        res.render('login.html', { error: 'Invalid credentials, try again.' });
    }
});

app.listen(5000, () => {
    console.log('Client is running on http://localhost:5000');
});

