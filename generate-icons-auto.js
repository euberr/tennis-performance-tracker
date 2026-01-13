// Script per generare automaticamente le icone usando Puppeteer
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generateIcons() {
    console.log('🎾 Generazione icone PWA con racchetta da tennis...\n');
    
    // Crea la cartella se non esiste
    const iconsDir = path.join(__dirname, 'src', 'assets', 'icons');
    if (!fs.existsSync(iconsDir)) {
        fs.mkdirSync(iconsDir, { recursive: true });
    }
    
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Carica il file HTML
    const htmlPath = path.join(__dirname, 'generate-icons.html');
    await page.goto(`file://${htmlPath}`);
    
    // Aspetta che le icone siano generate
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Genera icona 192x192
    console.log('📸 Generando icon-192x192.png...');
    const canvas192 = await page.$('#canvas192');
    const buffer192 = await canvas192.screenshot({ type: 'png' });
    const icon192Path = path.join(iconsDir, 'icon-192x192.png');
    fs.writeFileSync(icon192Path, buffer192);
    console.log(`✅ Creata: ${icon192Path}`);
    
    // Genera icona 512x512
    console.log('📸 Generando icon-512x512.png...');
    const canvas512 = await page.$('#canvas512');
    const buffer512 = await canvas512.screenshot({ type: 'png' });
    const icon512Path = path.join(iconsDir, 'icon-512x512.png');
    fs.writeFileSync(icon512Path, buffer512);
    console.log(`✅ Creata: ${icon512Path}`);
    
    await browser.close();
    console.log('\n✅ Icone generate con successo!');
}

generateIcons().catch(err => {
    console.error('❌ Errore:', err);
    process.exit(1);
});
