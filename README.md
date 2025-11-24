# Lager Monitor für UmbrelOS

Eine vollständige Lagerverwaltungslösung für UmbrelOS.

## Features

- **Produktverwaltung**: Produkte mit Namen, SKU, Preis und Bestand verwalten
- **Wareneingang**: Neue Ware buchen und Bestand aktualisieren
- **Warenausgang**: Verkäufe und Entnahmen erfassen
- **Umsatzübersicht**: Verkaufsumsätze und Top-Produkte anzeigen
- **Persistente Datenbank**: Alle Daten werden in SQLite gespeichert

## Installation auf UmbrelOS

### Methode 1: Aus dem lokalen Verzeichnis

1. Bauen Sie das Docker-Image:
```bash
cd warehouse-monitor/app
docker build -t warehouse-monitor:latest .
```

2. Kopieren Sie das gesamte `warehouse-monitor` Verzeichnis in Ihr Umbrel App Store Verzeichnis:
```bash
rsync -av warehouse-monitor/ umbrel@umbrel-dev.local:/home/umbrel/umbrel/app-stores/community/warehouse-monitor/
```

3. Installieren Sie die App über die Umbrel Web-Oberfläche oder CLI:
```bash
npm run dev client -- apps.install.mutate -- --appId warehouse-monitor
```

### Methode 2: Über Custom App Store

1. Erstellen Sie einen Fork dieses Repositories
2. Fügen Sie den Fork als Custom App Store in Umbrel hinzu
3. Installieren Sie die App aus Ihrem Custom Store

## Verwendung

### Produkte hinzufügen
1. Klicken Sie auf "Neues Produkt"
2. Geben Sie Name, SKU und Preis ein
3. Speichern

### Wareneingang buchen
1. Wählen Sie ein Produkt aus
2. Klicken Sie auf "Buchen"
3. Wählen Sie "Wareneingang"
4. Geben Sie die Menge ein
5. Optional: Fügen Sie eine Notiz hinzu

### Warenausgang buchen
1. Wählen Sie ein Produkt aus
2. Klicken Sie auf "Buchen"
3. Wählen Sie "Warenausgang"
4. Geben Sie die Menge und optional einen Verkaufspreis ein
5. Die App berechnet automatisch den Umsatz

### Umsatz überwachen
1. Wechseln Sie zum Tab "Umsatz"
2. Sehen Sie Gesamtumsatz, verkaufte Artikel und Anzahl der Verkäufe
3. Überprüfen Sie die Umsätze nach Produkt

## Technische Details

- **Backend**: Node.js + Express
- **Datenbank**: SQLite (better-sqlite3)
- **Frontend**: Vanilla JavaScript, HTML, CSS
- **Container**: Docker (Node 18 Alpine)

## Datenpersistenz

Alle Daten werden im Volume `${APP_DATA_DIR}/data` gespeichert und bleiben bei App-Neustarts erhalten. Bei Deinstallation werden alle Daten gelöscht.

## Entwicklung

Lokale Entwicklung ohne Docker:

```bash
cd warehouse-monitor/app
npm install
npm start
```

Die App läuft dann auf http://localhost:3000

## API-Endpunkte

- `GET /api/products` - Alle Produkte abrufen
- `POST /api/products` - Neues Produkt erstellen
- `PUT /api/products/:id` - Produkt aktualisieren
- `DELETE /api/products/:id` - Produkt löschen
- `GET /api/transactions` - Transaktionen abrufen
- `POST /api/transactions` - Neue Transaktion buchen
- `GET /api/revenue` - Umsatzdaten abrufen

## Lizenz

MIT
