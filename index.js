const express = require('express');
const nodeHtmlToImage = require('node-html-to-image');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); // serve bg image

app.post('/generate', async (req, res) => {
  const { data, tanggal } = req.body;
  const htmlTemplate = fs.readFileSync(path.join(__dirname, 'views', 'template.html'), 'utf8');

  // Buat posisi dinamis
  const baseTop = 800;
  const space = 100 / Math.max(data.length, 1); // jarak antar orang
  const dataWithPosition = data.map((item, i) => ({
    ...item,
    topNama: baseTop + i * space * 2,
    topJabatan: baseTop + i * space * 2 + 40
  }));

  try {
    const imageBuffer = await nodeHtmlToImage({
      html: htmlTemplate,
      content: { data: dataWithPosition, tanggal },
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
