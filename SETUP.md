# Setup e Comandi Angular CLI

## Comandi per Creare il Progetto

Se vuoi ricreare il progetto da zero, ecco i comandi Angular CLI necessari:

```bash
# Crea nuovo progetto Angular standalone
ng new tennis-performance-tracker --routing=false --style=css --standalone

# Naviga nella cartella
cd tennis-performance-tracker

# Installa dipendenze (già fatto se usi il progetto esistente)
npm install
```

## Struttura File Completa

```
tennistrain/
├── .gitignore
├── README.md
├── SETUP.md
├── angular.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
└── src/
    ├── index.html
    ├── main.ts
    ├── styles.css
    ├── favicon.ico
    └── app/
        ├── app.component.ts
        ├── app.component.html
        ├── app.component.css
        ├── app.routes.ts
        ├── core/
        │   ├── storage.service.ts
        │   └── models/
        │       ├── tournament.model.ts
        │       ├── match.model.ts
        │       ├── training-session.model.ts
        │       ├── nutrition-log.model.ts
        │       └── daily-metrics.model.ts
        ├── dashboard/
        │   ├── dashboard.component.ts
        │   ├── dashboard.component.html
        │   └── dashboard.component.css
        ├── tournaments/
        │   ├── tournaments.component.ts
        │   ├── tournaments.component.html
        │   └── tournaments.component.css
        ├── matches/
        │   ├── matches.component.ts
        │   ├── matches.component.html
        │   └── matches.component.css
        ├── training/
        │   ├── training.component.ts
        │   ├── training.component.html
        │   └── training.component.css
        ├── nutrition/
        │   ├── nutrition.component.ts
        │   ├── nutrition.component.html
        │   └── nutrition.component.css
        ├── daily-metrics/
        │   ├── daily-metrics.component.ts
        │   ├── daily-metrics.component.html
        │   └── daily-metrics.component.css
        ├── settings/
        │   ├── settings.component.ts
        │   ├── settings.component.html
        │   └── settings.component.css
        └── shared/
            └── components/
                ├── metric-card/
                │   ├── metric-card.component.ts
                │   ├── metric-card.component.html
                │   └── metric-card.component.css
                └── button/
                    ├── button.component.ts
                    ├── button.component.html
                    └── button.component.css
```

## Note Importanti

1. **Tutti i file sono già creati** - Non è necessario eseguire comandi Angular CLI per generare i componenti, sono già tutti presenti.

2. **Standalone Components** - Tutti i componenti sono standalone, quindi non serve un NgModule.

3. **Routing** - Il routing è configurato in `app.routes.ts` con lazy loading.

4. **Persistenza** - Il servizio `StorageService` gestisce IndexedDB con fallback a LocalStorage.

## Avvio dell'Applicazione

```bash
# Installa dipendenze (solo la prima volta)
npm install

# Avvia il server di sviluppo
npm start

# Oppure
ng serve
```

L'app sarà disponibile su `http://localhost:4200`

## Build

```bash
# Build per produzione
npm run build

# Oppure
ng build
```

## Test

```bash
# Esegui i test (se configurati)
npm test

# Oppure
ng test
```
