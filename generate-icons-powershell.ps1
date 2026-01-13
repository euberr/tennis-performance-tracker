# Script PowerShell per generare le icone PWA
# Esegui: .\generate-icons-powershell.ps1

Write-Host "🎾 Generazione icone PWA con racchetta da tennis..." -ForegroundColor Yellow

# Crea la cartella se non esiste
$iconsDir = "src\assets\icons"
if (-not (Test-Path $iconsDir)) {
    New-Item -ItemType Directory -Force -Path $iconsDir | Out-Null
    Write-Host "✅ Cartella creata: $iconsDir" -ForegroundColor Green
}

# Verifica se ImageMagick è installato
$magickPath = Get-Command magick -ErrorAction SilentlyContinue
if (-not $magickPath) {
    Write-Host "❌ ImageMagick non trovato." -ForegroundColor Red
    Write-Host "`n📦 Installa ImageMagick:" -ForegroundColor Yellow
    Write-Host "   choco install imagemagick" -ForegroundColor Cyan
    Write-Host "`nOppure usa il file generate-icons.html nel browser." -ForegroundColor Yellow
    exit 1
}

Write-Host "`n🎨 Generazione icona 192x192..." -ForegroundColor Cyan

# Crea SVG temporaneo per la racchetta
$svg192 = @"
<svg width="192" height="192" xmlns="http://www.w3.org/2000/svg">
  <rect width="192" height="192" fill="#0B3D2E"/>
  <!-- Testa racchetta -->
  <ellipse cx="96" cy="70" rx="90" ry="120" fill="none" stroke="#F6E547" stroke-width="4"/>
  <ellipse cx="96" cy="70" rx="85" ry="115" fill="rgba(246,229,71,0.3)"/>
  <!-- Corde orizzontali -->
  <line x1="20" y1="30" x2="172" y2="30" stroke="#F6E547" stroke-width="1.5"/>
  <line x1="20" y1="45" x2="172" y2="45" stroke="#F6E547" stroke-width="1.5"/>
  <line x1="20" y1="60" x2="172" y2="60" stroke="#F6E547" stroke-width="1.5"/>
  <line x1="20" y1="75" x2="172" y2="75" stroke="#F6E547" stroke-width="1.5"/>
  <line x1="20" y1="90" x2="172" y2="90" stroke="#F6E547" stroke-width="1.5"/>
  <line x1="20" y1="105" x2="172" y2="105" stroke="#F6E547" stroke-width="1.5"/>
  <line x1="20" y1="120" x2="172" y2="120" stroke="#F6E547" stroke-width="1.5"/>
  <line x1="20" y1="135" x2="172" y2="135" stroke="#F6E547" stroke-width="1.5"/>
  <!-- Corde verticali -->
  <line x1="35" y1="20" x2="35" y2="150" stroke="#F6E547" stroke-width="1.5"/>
  <line x1="55" y1="20" x2="55" y2="150" stroke="#F6E547" stroke-width="1.5"/>
  <line x1="75" y1="20" x2="75" y2="150" stroke="#F6E547" stroke-width="1.5"/>
  <line x1="96" y1="20" x2="96" y2="150" stroke="#F6E547" stroke-width="1.5"/>
  <line x1="117" y1="20" x2="117" y2="150" stroke="#F6E547" stroke-width="1.5"/>
  <line x1="137" y1="20" x2="137" y2="150" stroke="#F6E547" stroke-width="1.5"/>
  <line x1="157" y1="20" x2="157" y2="150" stroke="#F6E547" stroke-width="1.5"/>
  <!-- Manico -->
  <rect x="80" y="150" width="32" height="38" fill="#F6E547"/>
  <rect x="80" y="150" width="32" height="38" fill="none" stroke="#0B3D2E" stroke-width="2"/>
  <line x1="80" y1="158" x2="112" y2="158" stroke="#0B3D2E" stroke-width="1"/>
  <line x1="80" y1="166" x2="112" y2="166" stroke="#0B3D2E" stroke-width="1"/>
  <line x1="80" y1="174" x2="112" y2="174" stroke="#0B3D2E" stroke-width="1"/>
  <line x1="80" y1="182" x2="112" y2="182" stroke="#0B3D2E" stroke-width="1"/>
  <!-- Punto centrale -->
  <circle cx="96" cy="70" r="3" fill="#F6E547"/>
</svg>
"@

$svg512 = @"
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#0B3D2E"/>
  <!-- Testa racchetta -->
  <ellipse cx="256" cy="186" rx="240" ry="320" fill="none" stroke="#F6E547" stroke-width="10"/>
  <ellipse cx="256" cy="186" rx="230" ry="310" fill="rgba(246,229,71,0.3)"/>
  <!-- Corde orizzontali -->
  <line x1="50" y1="80" x2="462" y2="80" stroke="#F6E547" stroke-width="4"/>
  <line x1="50" y1="120" x2="462" y2="120" stroke="#F6E547" stroke-width="4"/>
  <line x1="50" y1="160" x2="462" y2="160" stroke="#F6E547" stroke-width="4"/>
  <line x1="50" y1="200" x2="462" y2="200" stroke="#F6E547" stroke-width="4"/>
  <line x1="50" y1="240" x2="462" y2="240" stroke="#F6E547" stroke-width="4"/>
  <line x1="50" y1="280" x2="462" y2="280" stroke="#F6E547" stroke-width="4"/>
  <line x1="50" y1="320" x2="462" y2="320" stroke="#F6E547" stroke-width="4"/>
  <line x1="50" y1="360" x2="462" y2="360" stroke="#F6E547" stroke-width="4"/>
  <!-- Corde verticali -->
  <line x1="90" y1="50" x2="90" y2="400" stroke="#F6E547" stroke-width="4"/>
  <line x1="145" y1="50" x2="145" y2="400" stroke="#F6E547" stroke-width="4"/>
  <line x1="200" y1="50" x2="200" y2="400" stroke="#F6E547" stroke-width="4"/>
  <line x1="256" y1="50" x2="256" y2="400" stroke="#F6E547" stroke-width="4"/>
  <line x1="312" y1="50" x2="312" y2="400" stroke="#F6E547" stroke-width="4"/>
  <line x1="367" y1="50" x2="367" y2="400" stroke="#F6E547" stroke-width="4"/>
  <line x1="422" y1="50" x2="422" y2="400" stroke="#F6E547" stroke-width="4"/>
  <!-- Manico -->
  <rect x="214" y="400" width="84" height="100" fill="#F6E547"/>
  <rect x="214" y="400" width="84" height="100" fill="none" stroke="#0B3D2E" stroke-width="5"/>
  <line x1="214" y1="420" x2="298" y2="420" stroke="#0B3D2E" stroke-width="3"/>
  <line x1="214" y1="440" x2="298" y2="440" stroke="#0B3D2E" stroke-width="3"/>
  <line x1="214" y1="460" x2="298" y2="460" stroke="#0B3D2E" stroke-width="3"/>
  <line x1="214" y1="480" x2="298" y2="480" stroke="#0B3D2E" stroke-width="3"/>
  <!-- Punto centrale -->
  <circle cx="256" cy="186" r="8" fill="#F6E547"/>
</svg>
"@

# Salva SVG temporanei
$svg192Path = "$env:TEMP\icon-192.svg"
$svg512Path = "$env:TEMP\icon-512.svg"
$svg192 | Out-File -FilePath $svg192Path -Encoding UTF8
$svg512 | Out-File -FilePath $svg512Path -Encoding UTF8

# Converti SVG in PNG
try {
    & magick convert "$svg192Path" "$iconsDir\icon-192x192.png"
    Write-Host "✅ Creata: $iconsDir\icon-192x192.png" -ForegroundColor Green
    
    & magick convert "$svg512Path" "$iconsDir\icon-512x512.png"
    Write-Host "✅ Creata: $iconsDir\icon-512x512.png" -ForegroundColor Green
    
    Write-Host "`n✅ Icone generate con successo!" -ForegroundColor Green
} catch {
    Write-Host "❌ Errore durante la conversione: $_" -ForegroundColor Red
    exit 1
} finally {
    # Rimuovi file temporanei
    Remove-Item $svg192Path -ErrorAction SilentlyContinue
    Remove-Item $svg512Path -ErrorAction SilentlyContinue
}
