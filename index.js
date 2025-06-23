const express = require('express');
const nodeHtmlToImage = require('node-html-to-image');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/generate', async (req, res) => {
  const { data, tanggal } = req.body;
  const htmlTemplate = fs.readFileSync(path.join(__dirname, 'views', 'template.html'), 'utf8');

  // Hitung posisi dinamis
  const dataWithPosition = data.map((item, i) => ({
    ...item,
    topNama: 700 + i * 200,
    topJabatan: 760 + i * 200
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

app.get('/test', async (req, res) => {
  const html = fs.readFileSync(path.join(__dirname, 'views', 'template.html'), 'utf8');

  const dummy = [
    { nama: "AZIS HM.", jabatan: "Partnership Program Jr Officer" },
    { nama: "WAHYUDIN, ST.", jabatan: "Spv of PdM Elins Workshop" }
  ];
  const tanggal = "23 Juni 2025";
  const dataWithPosition = dummy.map((item, i) => ({
    ...item,
    topNama: 700 + i * 200,
    topJabatan: 760 + i * 200
  }));

  try {
    const imageBuffer = await nodeHtmlToImage({
      html,
      content: { data: dataWithPosition, tanggal },
      puppeteerArgs: { args: ['--no-sandbox']()
