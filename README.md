# Tennis Performance Tracker

App Angular 15 standalone per il tracciamento delle performance tennistiche.

## Caratteristiche

- **Dashboard** con statistiche e metriche
- **Tornei** - Gestione completa dei tornei
- **Partite** - Tracciamento partite con score, performance, RPE
- **Allenamenti** - Registrazione sessioni di allenamento
- **Nutrizione** - Log nutrizionale legato a partite e allenamenti
- **Metriche Giornaliere** - Peso, sonno, stress, energia
- **Impostazioni** - Export/Import dati

## Tecnologie

- Angular 15 (Standalone Components)
- IndexedDB con fallback LocalStorage
- TypeScript
- CSS puro (no librerie UI esterne)

## Installazione

1. Installa le dipendenze:
```bash
npm install
```

2. Avvia il server di sviluppo:
```bash
npm start
```

3. Apri il browser su `http://localhost:4200`

## Build per produzione

```bash
npm run build
```

I file compilati saranno nella cartella `dist/tennis-performance-tracker`.

## Struttura del Progetto

```
src/
├── app/
│   ├── core/
│   │   ├── models/          # Interfacce TypeScript
│   │   └── storage.service.ts # Servizio IndexedDB
│   ├── dashboard/           # Dashboard principale
│   ├── tournaments/         # Gestione tornei
│   ├── matches/             # Gestione partite
│   ├── training/            # Gestione allenamenti
│   ├── nutrition/           # Log nutrizionale
│   ├── daily-metrics/       # Metriche giornaliere
│   ├── settings/            # Impostazioni
│   ├── shared/              # Componenti condivisi
│   └── app.component.*      # Componente principale
├── styles.css               # Stili globali
└── main.ts                  # Entry point
```

## Persistenza Dati

L'app utilizza IndexedDB per la persistenza locale. Se IndexedDB non è disponibile, viene utilizzato LocalStorage come fallback.

Tutti i dati sono salvati localmente nel browser. Per fare un backup, usa la funzione Export nelle Impostazioni.

## Palette Colori

- Verde Campo: `#1B5E20` / `#2E7D32`
- Giallo Pallina: `#FDD835`
- Bianco: `#FFFFFF`

## Note

- App single-user, senza autenticazione
- Nessun backend richiesto
- Dati salvati solo localmente
- Responsive design (mobile-first)
- PWA ready - installabile su mobile

## Deploy su Netlify

### Prerequisiti

1. Installa @angular/pwa (se non già installato):
```bash
ng add @angular/pwa --project tennis-performance-tracker
```

2. Crea le icone PWA:
   - Crea la cartella `src/assets/icons/`
   - Aggiungi icone PNG nelle dimensioni: 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512
   - Puoi usare un generatore online come https://realfavicongenerator.net/ o https://www.pwabuilder.com/imageGenerator

### Build per produzione

```bash
npm run build
```

Il build sarà disponibile nella cartella `dist/tennis-performance-tracker/`

### Deploy Manuale (Drag & Drop)

1. Esegui il build:
```bash
npm run build
```

2. Vai su [Netlify Drop](https://app.netlify.com/drop)
3. Trascina la cartella `dist/tennis-performance-tracker/` nella pagina
4. Netlify pubblicherà automaticamente l'app

### Deploy da Git (Raccomandato)

1. Pusha il codice su GitHub/GitLab/Bitbucket
2. Vai su [Netlify](https://www.netlify.com/)
3. Clicca "New site from Git"
4. Connetti il repository
5. Configurazione build:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/tennis-performance-tracker`
6. Clicca "Deploy site"

Netlify userà automaticamente il file `netlify.toml` per la configurazione.

### Verifica PWA

Dopo il deploy:
1. Apri l'app su mobile
2. Aggiungi alla schermata home (iOS/Android)
3. Verifica che funzioni offline (dopo il primo caricamento)

### Note sul Service Worker

Il service worker viene generato automaticamente da @angular/pwa durante il build. 
Assicurati di eseguire sempre `ng build --configuration production` per il deploy.
