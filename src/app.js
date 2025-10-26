import express from 'express';
import cors from 'cors';
import laporanRoutes from './routes/laporanRoutes.js';
import kecamatanRoutes from './routes/kecamatanRoutes.js';
import sungaiRoutes from './routes/sungaiRoutes.js';
import desaRoutes from './routes/desaRoutes.js';
import risikoRoutes from './routes/risikoRoutes.js'
import authRoutes from "./routes/authRoutes.js";
import './scheduler.js'

const app = express();

app.use(cors());
app.use(express.json({ limit: '20mb' }));

app.use('/kecamatan', kecamatanRoutes);
app.use('/desa', desaRoutes);
app.use('/sungai', sungaiRoutes);
app.use('/laporan', laporanRoutes);
app.use('/risiko', risikoRoutes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('API Pemetaan Banjir aktif ');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
