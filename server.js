// server.js
import express from 'express';
import dotenv from 'dotenv';
import { obtenerJoyas, obtenerJoyasConFiltro } from './consultas.js';
import generarEnlacesJoyas from './helpers/hateoas.js'
const app = express();
const PORT = 3000;
app.use(express.json());
dotenv.config();

app.get('/joyas', async (req, res) => {
  console.log('Parámetros de consulta recibidos:', req.query); // Log para depurar
  const limit = parseInt(req.query.limit) || 6; // Convierte el valor a número y usa 10 si no se proporciona
  const page = parseInt(req.query.page)
  const order_by = req.query.order_by || 'id_ASC'; // Asegúrate de proporcionar un valor predeterminado para 'order_by'
  try {
    const joyas = await obtenerJoyas({ limits: limit, order_by: order_by, page: page });
    const joyasConEnlaces = generarEnlacesJoyas(joyas);
    res.json(joyasConEnlaces);
  } catch (error) {
    console.error('Error al obtener medicamentos:', error); // Log para depurar
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/joyas/filtros', async (req, res) => {
  try {
    const queryStrings = req.query;
    const joyas = await obtenerJoyasConFiltro(queryStrings);
    res.json(joyas);
  } catch (error) {
    res.status(500).send('Error interno del servidor')
  }
});

app.get("*", (req, res) => {
  res.status(404).send("Esta ruta no existe")
})
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

