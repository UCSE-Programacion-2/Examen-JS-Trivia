const express = require('express');
const cors = require('cors');
const path = require('path');
const preguntas = require('./data/preguntas.json');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Ruta base
app.get('/', (req, res) => {
  res.send('Servidor de Trivia de Conocimiento corriendo. Preguntas en /api/preguntas');
});

// Obtener todas las preguntas (opcionalmente filtradas por categoría)
app.get('/api/preguntas', (req, res) => {
  const { categoria } = req.query;
  if (categoria && categoria !== 'todas') {
    const filtradas = preguntas.filter(
      (p) => p.categoria.toLowerCase() === categoria.toLowerCase(),
    );
    return res.json(filtradas);
  }
  return res.json(preguntas);
});

// Obtener categorías disponibles
app.get('/api/categorias', (req, res) => {
  const categorias = [...new Set(preguntas.map((p) => p.categoria))];
  res.json(categorias);
});

// Validar respuesta enviada
app.post('/api/validar', (req, res) => {
  const { idPregunta, respuestaSeleccionada } = req.body;
  const pregunta = preguntas.find((p) => p.id === Number(idPregunta));

  if (!pregunta) {
    return res.status(404).json({ error: 'Pregunta no encontrada' });
  }

  const esCorrecta = pregunta.respuestaCorrecta === Number(respuestaSeleccionada);
  return res.json({
    correcta: esCorrecta,
    respuestaCorrecta: pregunta.respuestaCorrecta,
    textoRespuestaCorrecta: pregunta.opciones[pregunta.respuestaCorrecta],
  });
});

app.use('/data', express.static(path.join(__dirname, 'data')));

app.listen(PORT, () => {
  console.log(`Servidor de Trivia corriendo en http://localhost:${PORT}`);
  console.log(`API de preguntas: http://localhost:${PORT}/api/preguntas`);
});
