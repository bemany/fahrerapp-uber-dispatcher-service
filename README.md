# fahrerapp-uber-dispatcher-service

Dieses Projekt ermöglicht es, anhand der abfragen von uber-dispatcher-service nachrichten als pushup benachrichtigungen an den  Fahrerapp zu senden.

## Voraussetzungen

Bevor Sie mit der Einrichtung beginnen, stellen Sie bitte sicher, dass die folgenden Voraussetzungen erfüllt sind:

- **Node.js**: Sollte auf Ihrem System installiert sein. Installationsanleitungen finden Sie auf der offiziellen [Node.js Website](https://nodejs.org/).
- **Cloudflare-Konto**: Erforderlich für das Hosting und die Ausführung des Workers. Ein Konto können Sie [hier erstellen](https://www.cloudflare.com/).
- **Wrangler CLI**: Notwendig zum Deployen von Cloudflare Workers. Installieren Sie Wrangler global mit npm durch den folgenden Befehl:
  ```bash
  npm install -g wrangler
  ```

## Installation

Folgen Sie diesen Schritten, um das Projekt einzurichten:

1. **Klonen Sie das Repository:**
   ```bash
   git clone https://github.com/bemany/fahrerapp-uber-dispatcher-service.git
   ```
   
2. **Navigieren Sie in das Projektverzeichnis:**
   ```bash
   cd fahrerapp-uber-dispatcher-service
   ```

3. **Installieren Sie die Abhängigkeiten:**
   ```bash
   npm install
   ```

4. **Authentifizieren Sie sich bei Ihrem Cloudflare-Konto:**
   ```bash
   wrangler login
   ```

5. **Konfigurieren Sie den `account_id` in der `wrangler.toml`:**
   Öffnen Sie die Datei `wrangler.toml` in einem Texteditor Ihrer Wahl und tragen Sie Ihre `account_id` und den richtigen Worker namen bei `name` ein.

6. **Starten Sie den Worker:**
   ```bash
   wrangler publish
   ```

## Benutzung

Nach dem erfolgreichen Deployen können Sie die Funktionalität Ihres Cloudflare Workers über die bereitgestellte URL testen. Die genauen Endpunkte und deren Funktionen sollten in einer weiterführenden Dokumentation beschrieben werden.