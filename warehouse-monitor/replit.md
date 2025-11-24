# Lager Monitor für UmbrelOS - Vollständig Verschlüsselt

## Projektübersicht
Eine vollständige Lagerverwaltungs-App für UmbrelOS mit Produktverwaltung, Warenein-/ausgang und Umsatzübersicht. **Alle Daten sind lokal verschlüsselt im Browser gespeichert - keine externe Datenbank!**

## Datum
Erstellt: 24. November 2025
Letztes Update: 24. November 2025 - Vollständige Umstrukturierung auf verschlüsselte lokale Speicherung

## Technologie-Stack
- **Frontend**: Vanilla JavaScript + HTML5 + CSS3
- **Datenschutz**: AES-Verschlüsselung mit CryptoJS
- **Speicherung**: Encrypted localStorage (keine Datenbank!)
- **Backend**: Node.js 18 + Express (nur Static-File-Server)
- **Sicherheit**: PIN 9045 (Base64 verschlüsselt), 15-Minuten-Re-Authentifizierung
- **Container**: Docker
- **Plattform**: UmbrelOS 1.x

## Projektstruktur
```
warehouse-monitor/
├── umbrel-app.yml           # UmbrelOS App-Manifest
├── docker-compose.yml       # Docker-Konfiguration
├── README.md                # Dokumentation
└── app/
    ├── Dockerfile           # Container-Definition
    ├── package.json         # Node.js Dependencies
    ├── server.js            # Express Backend (Static-Server)
    └── public/
        ├── index.html       # Frontend UI
        ├── style.css        # Styling
        ├── app.js           # Frontend-Logik mit Verschlüsselung
        └── storage.js       # Verschlüsseltes Storage-System
```

## Features
1. **Produktverwaltung**: CRUD-Operationen verschlüsselt lokal
2. **Wareneingang**: Neue Ware buchen, Bestand lokal aktualisieren
3. **Warenausgang**: Verkäufe erfassen, Umsatz berechnen
4. **Umsatzübersicht**: Gesamtumsatz, verkaufte Artikel, Top-Produkte
5. **Lieferantenverwaltung**: Mit Threema/Telegram/Signal Kontakten
6. **Verschlüsselte Datenspeicherung**: AES-Verschlüsselung für alle Daten
7. **PIN-Sicherheit**: Erforderlich beim Start und alle 15 Minuten

## Sicherheitsfeatures
- ✅ **AES-Verschlüsselung**: Alle Daten mit CryptoJS verschlüsselt
- ✅ **Lokale Speicherung**: Keine Datenbank, alles im Browser
- ✅ **PIN-Authentifizierung**: 4-stelliger PIN (9045), Base64 verschlüsselt
- ✅ **Auto-Logout**: Nach 15 Minuten Inaktivität
- ✅ **Verschwommener Hintergrund**: UI-Kontext beim PIN-Modal
- ✅ **Keine Netzwerkübertragung**: Alle Daten bleiben lokal

## Installation auf UmbrelOS
1. Docker-Image bauen: `docker build -t warehouse-monitor:latest ./warehouse-monitor/app`
2. In Umbrel-App-Store kopieren
3. Über Web-UI oder CLI installieren

## Entwicklung
Für lokale Tests:
```bash
cd warehouse-monitor/app
npm install
npm start
```
Die App öffnet sich auf Port 5000 mit PIN-Authentifizierung.

## API-Struktur (nur Frontend)
- Kein Backend - alles lokal!
- localStorage Key: `app_suppliers`, `app_products`, `app_transactions` (alle verschlüsselt)
- ID-Zähler in localStorage mit Prefix

## Benutzerpräferenzen
- Sprache: Deutsch
- Projekt: Lagerverwaltung für UmbrelOS mit vollständiger Verschlüsselung
- Datenspeicherung: Nur lokal verschlüsselt, keine externe DB

## Verschlüsselungssystem
```javascript
// Alle Daten werden mit AES verschlüsselt:
const ENCRYPTION_SECRET = '9045WarehouseMonitor2025';
EncryptedStorage.set(key, data);        // Speichert verschlüsselt
EncryptedStorage.get(key);              // Lädt und entschlüsselt
```

## Performance
- ✅ Extrem schnell - keine Netzwerk-Latenz
- ✅ Offline-fähig - funktioniert ohne Internet
- ✅ Keine Datenbank-Verwaltung nötig
- ✅ Vorhersehbar - alle Daten lokal

## Wichtige Änderungen von vorher
- ❌ SQLite-Datenbank entfernt
- ❌ Alle API-Endpunkte für DB-Abfragen entfernt
- ✅ CryptoJS für AES-Verschlüsselung hinzugefügt
- ✅ Neues storage.js Modul für Datenverwaltung
- ✅ Server ist jetzt ein reiner Static-File-Server
- ✅ 100% lokale Datenspeicherung

