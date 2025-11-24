const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// Alle Daten werden jetzt im Frontend verschlüsselt im localStorage gespeichert
// Der Server ist nur noch ein Pass-Through für die Static Files

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Warehouse Monitor läuft auf Port ${PORT}`);
  console.log('Alle Daten sind verschlüsselt und lokal gespeichert.');
});
