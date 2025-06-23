const express = require('express');
const nodeHtmlToImage = require('node-html-to-image');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); // For serving bg images if needed

app.post('/generate', async (req, res) => {
  const { data, tanggal } = req.body;
  const htmlTemplate = fs.readFileSync(path.join(__dirname, 'views', 'template.html'), 'utf8');

  try {
    const imageBuffer = await nodeHtmlToImage({
      html: htmlTemplate,
      content: { data, tanggal },
      puppeteerArgs: { args: ['--no-sandbox'] },
      encoding: 'buffer'
    });

    res.setHeader('Content-Type', 'image/png');
    res.send(imageBuffer);
  } catch (e) {
    console.error('Error:', e);
    res.status(500).send('Gagal generate gambar');
  }
});

app.get('/', (req, res) => {
  res.send('🎉 Ucapan HUT Image Generator Aktif!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Server jalan di http://localhost:${port}`));

app.get('/test', async (req, res) => {
  const html = fs.readFileSync(path.join(__dirname, 'views', 'template.html'), 'utf8');

  const data = [
    { nama: "Tes Satu", jabatan: "QA Engineer" },
    { nama: "Tes Dua", jabatan: "Support Staff" }
  ];
  const tanggal = "23 Juni 2025";

  try {
    const imageBuffer = await nodeHtmlToImage({
      html,
      content: { data, tanggal },
      puppeteerArgs: { args: ['--no-sandbox'] },
      encoding: 'buffer'
    });

    res.setHeader('Content-Type', 'image/png');
    res.send(imageBuffer);
  } catch (err) {
    console.error('❌ Error generate:', err);
    res.status(500).send('Gagal generate gambar');
  }
});