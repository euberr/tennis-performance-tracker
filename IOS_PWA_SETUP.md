# Setup PWA per iOS - Istruzioni

## Stato Attuale

✅ **Manifest configurato**: `src/manifest.webmanifest` è presente e corretto
✅ **Meta tags iOS aggiunti**: `src/index.html` contiene tutti i meta tag necessari
⚠️ **@angular/pwa NON installato**: Deve essere installato per il service worker
⚠️ **Icone mancanti**: Le icone devono essere create e aggiunte

## Comandi da Eseguire

### 1. Installa @angular/pwa (OBBLIGATORIO)

```bash
ng add @angular/pwa --project tennis-performance-tracker
```

Questo comando:
- Installa `@angular/pwa` e `@angular/service-worker`
- Crea `ngsw-config.json`
- Aggiorna `angular.json` e `main.ts`
- Aggiunge il service worker per funzionalità offline

### 2. Crea le Icone

Crea la cartella se non esiste:
```bash
mkdir -p src/assets/icons
```

Poi genera le icone usando uno di questi metodi:

#### Metodo A: Generatore Online (Raccomandato)
1. Vai su https://realfavicongenerator.net/
2. Carica un'icona base (almeno 512x512px)
3. Configura:
   - Colore sfondo: #0B3D2E
   - Colore accent: #F6E547
4. Scarica tutte le dimensioni
5. Metti i file in `src/assets/icons/`

#### Metodo B: PWA Builder
1. Vai su https://www.pwabuilder.com/imageGenerator
2. Carica icona base
3. Genera e scarica tutte le dimensioni

#### Metodo C: Placeholder Temporaneo
Usa https://dummyimage.com/ per creare placeholder:
- https://dummyimage.com/180x180/0B3D2E/F6E547.png&text=T → salva come `apple-touch-icon.png`
- https://dummyimage.com/192x192/0B3D2E/F6E547.png&text=T → salva come `icon-192x192.png`
- https://dummyimage.com/512x512/0B3D2E/F6E547.png&text=T → salva come `icon-512x512.png`

**Icone minime richieste:**
- `apple-touch-icon.png` (180x180px) - **CRITICO per iOS**
- `icon-192x192.png` - **CRITICO per PWA**
- `icon-512x512.png` - **CRITICO per PWA**

### 3. Verifica Build

```bash
npm run build
```

Verifica che nella cartella `dist/tennis-performance-tracker/` ci siano:
- `manifest.webmanifest`
- `assets/icons/apple-touch-icon.png`
- `assets/icons/icon-192x192.png`
- `assets/icons/icon-512x512.png`
- `ngsw.json` e `ngsw-worker.js` (dopo installazione @angular/pwa)

## Test su iOS

1. Deploya l'app su Netlify (o usa un server HTTPS locale)
2. Apri Safari su iPhone/iPad
3. Vai all'URL dell'app
4. Tocca il pulsante "Condividi" (box con freccia)
5. Seleziona "Aggiungi alla schermata Home"
6. Verifica che l'icona sia quella corretta (non una scorciatoia generica)

## Troubleshooting

### Icona non appare su iOS
- Verifica che `apple-touch-icon.png` sia 180x180px
- Verifica che il file sia accessibile: `https://tuo-dominio.com/assets/icons/apple-touch-icon.png`
- Verifica che il meta tag sia presente: `<link rel="apple-touch-icon" href="assets/icons/apple-touch-icon.png">`
- Pulisci cache Safari: Impostazioni > Safari > Cancella cronologia e dati

### Service Worker non funziona
- Verifica che @angular/pwa sia installato
- Verifica che il build sia in produzione: `ng build --configuration production`
- Controlla la console del browser per errori
