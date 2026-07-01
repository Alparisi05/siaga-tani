import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log('======================================================');
  console.log(`   🛡️  CropShield Production Backend Server Loaded  🛡️   `);
  console.log(`   Situs dapat diakses di: http://localhost:${PORT}     `);
  console.log('======================================================');
});
