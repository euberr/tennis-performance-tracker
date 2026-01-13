# Guida Deploy PWA su Netlify

## Comandi da Eseguire

### 1. Installa @angular/pwa

```bash
ng add @angular/pwa --project tennis-performance-tracker
```

Questo comando:
- Installa `@angular/pwa` e `@angular/service-worker`
- Crea `ngsw-config.json` per configurare il service worker
- Aggiorna `angular.json` con la configurazione PWA
- Aggiunge il service worker in `main.ts`

### 2. Crea le icone PWA

Crea la cartella e aggiungi le icone:

```bash
mkdir -p src/assets/icons
```

Poi genera le icone usando uno di questi strumenti:
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator
- https://www.favicon-generator.org/

**Dimensioni richieste:**
- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

**Placeholder temporaneo:**
Se non hai ancora le icone, puoi creare placeholder semplici:
```bash
# Esempio con ImageMagick (se installato)
for size in 72 96 128 144 152 192 384 512; do
  convert -size ${size}x${size} xc:#0B3D2E -pointsize 24 -fill white -gravity center -annotate +0+0 "🎾" src/assets/icons/icon-${size}x${size}.png
done
```

Oppure usa https://dummyimage.com/ per creare placeholder:
- https://dummyimage.com/192x192/0B3D2E/FFFFFF.png&text=T
- https://dummyimage.com/512x512/0B3D2E/FFFFFF.png&text=T

### 3. Build per produzione

```bash
npm run build
```

Verifica che nella cartella `dist/tennis-performance-tracker/` ci siano:
- `index.html`
- `manifest.webmanifest`
- `_redirects`
- `ngsw.json` e `ngsw-worker.js` (generati da @angular/pwa)
- Cartella `assets/icons/` con tutte le icone

### 4. Test locale del build

```bash
# Installa un server HTTP locale (se non ce l'hai)
npm install -g http-server

# Vai nella cartella dist
cd dist/tennis-performance-tracker

# Avvia server locale
http-server -p 8080

# Apri http://localhost:8080 nel browser
# Verifica che il service worker si registri (DevTools > Application > Service Workers)
```

## Deploy su Netlify

### Opzione A: Deploy Manuale (Drag & Drop)

1. Esegui il build:
```bash
npm run build
```

2. Vai su https://app.netlify.com/drop
3. Trascina la cartella `dist/tennis-performance-tracker/` nella pagina
4. Netlify pubblicherà automaticamente l'app e ti darà un URL

### Opzione B: Deploy da Git (Raccomandato)

1. Assicurati che il codice sia su GitHub/GitLab/Bitbucket
2. Vai su https://www.netlify.com/
3. Clicca "New site from Git"
4. Connetti il repository
5. Configurazione build:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/tennis-performance-tracker`
6. Clicca "Deploy site"

Netlify userà automaticamente il file `netlify.toml` per la configurazione.

### Verifica PWA dopo il deploy

1. Apri l'app su mobile (o desktop con DevTools mobile)
2. Verifica che il manifest sia caricato (DevTools > Application > Manifest)
3. Verifica che il service worker sia registrato (DevTools > Application > Service Workers)
4. Testa l'installazione:
   - **Chrome/Edge**: Icona installa nella barra degli indirizzi
   - **Safari iOS**: Condividi > Aggiungi alla schermata Home
   - **Chrome Android**: Menu > Installa app
5. Testa offline: disconnetti internet e verifica che l'app funzioni

## Troubleshooting

### Service Worker non si registra
- Verifica che il build sia in produzione: `ng build --configuration production`
- Controlla la console del browser per errori
- Verifica che `ngsw.json` sia presente nel dist

### Manifest non viene caricato
- Verifica che `manifest.webmanifest` sia in `angular.json` assets
- Controlla che il path nel `index.html` sia corretto: `<link rel="manifest" href="manifest.webmanifest">`

### Routing non funziona su Netlify
- Verifica che `_redirects` sia in `angular.json` assets
- Controlla che il contenuto sia: `/*    /index.html   200`

### App non funziona offline
- Verifica che `ngsw-config.json` includa tutti gli asset necessari
- Controlla che il service worker sia attivo (DevTools > Application > Service Workers)
