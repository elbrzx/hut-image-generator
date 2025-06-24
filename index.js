const express = require('express');
const nodeHtmlToImage = require('node-html-to-image');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); // untuk serve gambar & font

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
    console.error('❌ Error saat generate:', e);
    res.status(500).send('Gagal generate gambar');
  }
});

app.get('/', (req, res) => {
  res.send('🎉 Ucapan HUT Image Generator Aktif!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Server jalan di http://localhost:${port}`));

app.post('/generate', async (req, res) => {
  const { data, tanggal } = req.body;

  const jumlahOrang = data.length || 1;
  const namaUkuran = jumlahOrang <= 1 ? '48px' : jumlahOrang <= 3 ? '42px' : jumlahOrang <= 5 ? '36px' : '28px';
  const jabatanUkuran = jumlahOrang <= 1 ? '28px' : jumlahOrang <= 3 ? '24px' : jumlahOrang <= 5 ? '20px' : '18px';

  const htmlTemplate = fs.readFileSync(path.join(__dirname, 'views', 'template.html'), 'utf8');

  try {
    const imageBuffer = await nodeHtmlToImage({
      html: htmlTemplate,
      content: { data, tanggal, namaUkuran, jabatanUkuran },
      puppeteerArgs: { args: ['--no-sandbox'] },
      encoding: 'buffer'
    });

    res.setHeader('Content-Type', 'image/png');
    res.send(imageBuffer);
  } catch (e) {
    console.error('❌ Error saat generate:', e);
    res.status(500).send('Gagal generate gambar');
  }
});
