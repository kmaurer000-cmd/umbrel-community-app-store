# 🚀 UmbrelOS Deployment Guide

## Überblick
Die **Lager Monitor App** kann auf zwei Weisen auf UmbrelOS bereitgestellt werden:

## Option 1: Docker Image bauen und lokal ausführen (schnell)

### Schritt 1: Docker Image bauen
```bash
cd warehouse-monitor
docker build -t warehouse-monitor:latest ./app
```

### Schritt 2: Mit Docker-Compose starten
```bash
docker-compose up -d
```

Die App läuft dann auf `http://localhost:5000`

**PIN:** `9045`

---

## Option 2: Im UmbrelOS App Store veröffentlichen (persistent)

### Schritt 1: App zu GitHub pushen
```bash
git add warehouse-monitor/
git commit -m "Add Lager Monitor encrypted app"
git push
```

### Schritt 2: Docker Hub Image erstellen
```bash
# Login bei Docker Hub
docker login

# Image bauen und taggen
cd warehouse-monitor
docker build -t YOUR_DOCKERHUB_USERNAME/warehouse-monitor:latest ./app

# Image pushen
docker push YOUR_DOCKERHUB_USERNAME/warehouse-monitor:latest
```

### Schritt 3: umbrel-app.yml anpassen
```yaml
# In warehouse-monitor/umbrel-app.yml:
id: warehouse-monitor
image: YOUR_DOCKERHUB_USERNAME/warehouse-monitor:latest
```

### Schritt 4: Zum Umbrel Community App Store beitragen
1. Fork: https://github.com/getumbrel/umbrel-apps
2. Ordner `warehouse-monitor/` hinzufügen
3. Pull Request einreichen

---

## Option 3: Auf eigenem UmbrelOS installieren

### Voraussetzung: UmbrelOS läuft auf Ihrem System

### Installation:
```bash
# SSH in Ihren Umbrel-Server
ssh umbrel@YOUR_UMBREL_IP

# Auf dem Server:
cd ~/apps
git clone https://github.com/YOUR_USERNAME/warehouse-monitor.git
cd warehouse-monitor
docker-compose up -d
```

Dann auf `http://YOUR_UMBREL_IP:5000` zugreifen.

---

## 🔐 Sicherheitsmerkmale

✅ **PIN-Schutz:** 9045 (Base64-verschlüsselt)
✅ **AES-Verschlüsselung:** Alle Daten verschlüsselt
✅ **Offline-Modus:** Funktioniert ohne Internetverbindung
✅ **Lokal gespeichert:** Keine externen Datenbanken
✅ **15-Min Auto-Logout:** Nach Inaktivität automatisches Logout

---

## 📊 Umgebungsvariablen

```env
PORT=5000              # Port der App
NODE_ENV=production    # Production Mode
```

---

## 📱 Zugriff

**URL:** `http://YOUR_UMBREL_IP:5000`
**PIN:** `9045`

---

## 💾 Datenspeicherung

Alle Daten werden **verschlüsselt im Browser-localStorage** gespeichert:
- Keine externe Datenbank nötig
- Keine Netzwerkverzögerung
- Volle Datenkontrolle auf Ihrem Server

---

## 🐛 Troubleshooting

### App startet nicht?
```bash
docker-compose logs app
```

### Port 5000 bereits in Verwendung?
In `docker-compose.yml`:
```yaml
ports:
  - "8080:5000"  # Externe:interne Port
```

### PIN vergessen?
Der PIN ist im Code festgelegt: `9045`

---

## 📝 Weitere Hilfe

- Dokumentation: `replit.md`
- Quellcode: `warehouse-monitor/app/`
- Issues: GitHub Issues
