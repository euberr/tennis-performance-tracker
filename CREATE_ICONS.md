# Istruzioni per Creare le Icone PWA

## Icone Minime Richieste (CRITICHE)

Devi creare **almeno** queste 2 icone per rendere l'app installabile:

1. `src/assets/icons/icon-192x192.png` - 192x192 pixel
2. `src/assets/icons/icon-512x512.png` - 512x512 pixel

## Metodo Rapido - DummyImage (Placeholder)

### Opzione 1: Download Diretto

Apri questi URL nel browser e salva i file nella cartella `src/assets/icons/`:

1. **icon-192x192.png**:
   ```
   https://dummyimage.com/192x192/0B3D2E/F6E547.png&text=T
   ```
   - Clicca destro sull'immagine → "Salva immagine come..."
   - Nome: `icon-192x192.png`
   - Cartella: `src/assets/icons/`

2. **icon-512x512.png**:
   ```
   https://dummyimage.com/512x512/0B3D2E/F6E547.png&text=T
   ```
   - Clicca destro sull'immagine → "Salva immagine come..."
   - Nome: `icon-512x512.png`
   - Cartella: `src/assets/icons/`

### Opzione 2: PowerShell (Windows)

```powershell
# Crea la cartella se non esiste
New-Item -ItemType Directory -Force -Path "src/assets/icons"

# Download icon-192x192.png
Invoke-WebRequest -Uri "https://dummyimage.com/192x192/0B3D2E/F6E547.png&text=T" -OutFile "src/assets/icons/icon-192x192.png"

# Download icon-512x512.png
Invoke-WebRequest -Uri "https://dummyimage.com/512x512/0B3D2E/F6E547.png&text=T" -OutFile "src/assets/icons/icon-512x512.png"
```

## Metodo Professionale - RealFaviconGenerator

1. Vai su https://realfavicongenerator.net/
2. Carica un'icona base (almeno 512x512px)
3. Configura:
   - Colore sfondo: #0B3D2E
   - Colore accent: #F6E547
4. Scarica tutte le dimensioni
5. Estrai `icon-192x192.png` e `icon-512x512.png`
6. Metti in `src/assets/icons/`

## Verifica

Dopo aver creato le icone, verifica che esistano:

```bash
# Windows PowerShell
Test-Path "src/assets/icons/icon-192x192.png"
Test-Path "src/assets/icons/icon-512x512.png"

# Dovrebbero restituire: True
```

## Note Importanti

- Le icone devono essere **PNG**
- Le dimensioni devono essere **esattamente** 192x192 e 512x512 pixel
- Le icone devono essere **raggiungibili** dopo il build (in `dist/tennis-performance-tracker/assets/icons/`)
