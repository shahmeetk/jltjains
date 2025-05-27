import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Serve static files from client/dist with /jltjains base path
app.use('/jltjains', express.static(path.join(__dirname, 'client/dist')));

// Redirect root to /jltjains/
app.get('/', (req, res) => {
  res.redirect('/jltjains/');
});

// Handle SPA routing - serve index.html for any route under /jltjains
app.get('/jltjains/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Preview server running at http://localhost:${PORT}/jltjains/`);
});
