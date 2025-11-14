const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const artistaRoutes = require('./routes/artistaRoutes');
const conciertoRoutes = require('./routes/conciertoRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Comprobación rápida de la variable JWT_SECRET (no imprime el valor)
console.log('🔐 JWT_SECRET cargado?:', !!process.env.JWT_SECRET, 'longitud:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0);

// 🔒 Conexión a MySQL
db.connect((err) => {
  if (err) {
    console.error('❌ Error conectando a MySQL:', err.message);
  } else {
    console.log('✅ Conectado a MySQL');
  }
});

// 2️⃣ Inicializar Express
const app = express();

// 3️⃣ Middleware
// En desarrollo permitimos orígenes dinámicos para evitar errores CORS cuando Vite cambia de puerto.
// Cambiá esto a un origen concreto en producción.
app.use(cors({ origin: true, credentials: true }));
app.options('*', cors({ origin: true, credentials: true })); // responder preflights

app.use(express.json());

// 4️⃣ Rutas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/artistas', artistaRoutes);
app.use('/api/conciertos', conciertoRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 5️⃣ Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor funcionando 🚀');
});

// 6️⃣ Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🟢 Servidor corriendo en http://localhost:${PORT}`);
});
