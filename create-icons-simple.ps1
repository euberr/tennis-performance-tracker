# Script semplice per creare le icone usando il tool HTML
Write-Host "Generazione icone PWA..." -ForegroundColor Yellow

# Crea la cartella se non esiste
$iconsDir = "src\assets\icons"
if (-not (Test-Path $iconsDir)) {
    New-Item -ItemType Directory -Force -Path $iconsDir | Out-Null
}

# Usa un servizio online per generare placeholder
Write-Host "Scaricando icone..." -ForegroundColor Yellow

try {
    $webClient = New-Object System.Net.WebClient
    
    # Crea icona 192x192
    Write-Host "Scaricando icon-192x192.png..." -ForegroundColor Gray
    $url192 = 'https://dummyimage.com/192x192/0B3D2E/F6E547.png&text=T'
    $webClient.DownloadFile($url192, "$iconsDir\icon-192x192.png")
    
    # Crea icona 512x512
    Write-Host "Scaricando icon-512x512.png..." -ForegroundColor Gray
    $url512 = 'https://dummyimage.com/512x512/0B3D2E/F6E547.png&text=T'
    $webClient.DownloadFile($url512, "$iconsDir\icon-512x512.png")
    
    Write-Host "Icone create in: $iconsDir" -ForegroundColor Green
    Write-Host "Nota: Queste sono placeholder. Usa generate-icons.html per icone con racchetta dettagliata" -ForegroundColor Yellow
    
} catch {
    Write-Host "Errore: $_" -ForegroundColor Red
    Write-Host "Usa il file generate-icons.html nel browser invece." -ForegroundColor Yellow
}
