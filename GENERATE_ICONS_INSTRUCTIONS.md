# Istruzioni per Generare le Icone PWA

## Metodo Automatico (Raccomandato)

Ho creato un tool HTML che genera automaticamente le icone con una racchetta da tennis.

### Passi:

1. **Apri il file `generate-icons.html` nel browser**
   - Doppio click sul file, oppure
   - Clicca destro → "Apri con" → Scegli il tuo browser

2. **Vedrai due anteprime delle icone** (192x192 e 512x512)

3. **Clicca "Genera e Scarica Tutte le Icone"**
   - Le icone verranno scaricate automaticamente nella cartella Download

4. **Sposta le icone nella cartella corretta:**
   ```
   src/assets/icons/icon-192x192.png
   src/assets/icons/icon-512x512.png
   ```

### Caratteristiche delle Icone:

- **Sfondo**: Verde campo (#0B3D2E)
- **Racchetta**: Giallo pallina (#F6E547)
- **Design**: Racchetta da tennis stilizzata con corde e manico

## Metodo Alternativo - PowerShell (Se il tool HTML non funziona)

Se preferisci, puoi usare questo comando PowerShell per scaricare placeholder:

```powershell
# Crea la cartella se non esiste
New-Item -ItemType Directory -Force -Path "src/assets/icons"

# Download placeholder (senza racchetta, solo colore)
Invoke-WebRequest -Uri "https://dummyimage.com/192x192/0B3D2E/F6E547.png&text=🎾" -OutFile "src/assets/icons/icon-192x192.png"
Invoke-WebRequest -Uri "https://dummyimage.com/512x512/0B3D2E/F6E547.png&text=🎾" -OutFile "src/assets/icons/icon-512x512.png"
```

## Verifica

Dopo aver creato le icone, verifica che esistano:

```powershell
Test-Path "src/assets/icons/icon-192x192.png"  # Dovrebbe restituire: True
Test-Path "src/assets/icons/icon-512x512.png"  # Dovrebbe restituire: True
```

## Prossimi Passi

Dopo aver creato le icone:

1. Installa @angular/pwa:
   ```bash
   ng add @angular/pwa --project tennis-performance-tracker
   ```

2. Build production:
   ```bash
   npm run build
   ```

3. Deploy su Netlify

4. Test su Chrome Android - dovrebbe comparire "Installa app" ✅
