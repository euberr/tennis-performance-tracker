# Placeholder Icons - Istruzioni

## Icone Richieste

Per completare la configurazione PWA, devi creare le seguenti icone PNG:

### Icone Standard PWA
- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png` ⚠️ **RICHIESTO**
- `icon-384x384.png`
- `icon-512x512.png` ⚠️ **RICHIESTO**

### Icona iOS Specifica
- `apple-touch-icon.png` ⚠️ **RICHIESTO per iOS** (180x180px o 192x192px)

## Come Creare le Icone

### Opzione 1: Generatore Online (Raccomandato)

1. Vai su https://realfavicongenerator.net/
2. Carica un'icona base (almeno 512x512px)
3. Configura:
   - Colore di sfondo: #0B3D2E (field green)
   - Colore accent: #F6E547 (tennis ball yellow)
4. Scarica tutte le dimensioni
5. Metti i file PNG in questa cartella

### Opzione 2: PWA Builder Image Generator

1. Vai su https://www.pwabuilder.com/imageGenerator
2. Carica un'icona base
3. Genera tutte le dimensioni
4. Scarica e metti in questa cartella

### Opzione 3: Placeholder Temporaneo (Solo per Test)

Se vuoi solo testare la configurazione, puoi creare placeholder semplici:

**Per Windows (PowerShell):**
```powershell
# Installa ImageMagick se non ce l'hai: choco install imagemagick
# Poi esegui:
$sizes = @(72, 96, 128, 144, 152, 192, 384, 512, 180)
foreach ($size in $sizes) {
    $name = if ($size -eq 180) { "apple-touch-icon.png" } else { "icon-${size}x${size}.png" }
    magick -size ${size}x${size} xc:"#0B3D2E" -pointsize $([math]::Floor($size/3)) -fill "#F6E547" -gravity center -annotate +0+0 "🎾" "src/assets/icons/$name"
}
```

**Alternativa: Usa un tool online**
- Vai su https://dummyimage.com/
- Genera: `https://dummyimage.com/180x180/0B3D2E/F6E547.png&text=T` per apple-touch-icon
- Genera: `https://dummyimage.com/192x192/0B3D2E/F6E547.png&text=T` per icon-192x192
- Genera: `https://dummyimage.com/512x512/0B3D2E/F6E547.png&text=T` per icon-512x512

## Note

- **apple-touch-icon.png** deve essere 180x180px (o 192x192px, iOS lo scala)
- Le icone devono essere PNG con sfondo opaco (iOS non supporta trasparenza per apple-touch-icon)
- Colori consigliati: sfondo #0B3D2E (field green), icona/logo #F6E547 (tennis ball yellow)
