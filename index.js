const express = require('express');
const nodeHtmlToImage = require('node-html-to-image');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();

// Serve folder public (bg-tonasa.png & fonts)
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.post('/generate', async (req, res) => {
  const { data, tanggal } = req.body;

  // Ambil HTML template
  const htmlTemplate = fs.readFileSync(path.join(__dirname, 'views', 'template.html'), 'utf8');
  const cssContent = fs.readFileSync(path.join(__dirname, 'views', 'template.css'), 'utf8');
  const finalHtml = htmlTemplate.replace('<!-- {{style}} -->', `<style>${cssContent}</style>`);


  // Kamu bisa sesuaikan top kalau mau pakai positioning manual
  const baseTop = 800;
  const space = 100 / Math.max(data.length, 1);
  const dataWithPosition = data.map((item, i) => ({
    ...item,
    topNama: baseTop + i * space * 2,
    topJabatan: baseTop + i * space * 2 + 40
  }));

  try {
    const imageBuffer = await nodeHtmlToImage({
      html: finalHtml,
      content: { data: dataWithPosition, tanggal },
      puppeteerArgs: { args: ['--no-sandbox'] },
      encoding: 'buffer',
      type: 'png',
      quality: 100
    });

    res.setHeader('Content-Type', 'image/png');
    res.send(imageBuffer);
  } catch (e) {
    console.error('❌ Error saat generate gambar:', e);
    res.status(500).send('Gagal generate gambar');
  }
});

// Tes server aktif
app.get('/', (req, res) => {
  res.send('🎉 Ucapan HUT Image Generator Aktif!');
});

// Jalankan server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server jalan di http://localhost:${port}`);
});
