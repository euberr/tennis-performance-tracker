// Script per generare le icone PWA con racchetta da tennis
// Esegui: node generate-icons.js

const fs = require('fs');
const path = require('path');

// Crea la cartella se non esiste
const iconsDir = path.join(__dirname, 'src', 'assets', 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

// Funzione per generare PNG da SVG usando canvas (se disponibile) o fallback
function generateIcon(size) {
    const canvas = require('canvas');
    const { createCanvas } = canvas;
    
    const canvasEl = createCanvas(size, size);
    const ctx = canvasEl.getContext('2d');
    
    const scale = size / 512;
    const centerX = size / 2;
    const centerY = size / 2;
    
    // Sfondo verde campo
    ctx.fillStyle = '#0B3D2E';
    ctx.fillRect(0, 0, size, size);
    
    // Disegna la racchetta
    const headWidth = 240 * scale;
    const headHeight = 320 * scale;
    const headX = centerX - headWidth / 2;
    const headY = centerY - headHeight / 2 - 20 * scale;
    
    // Bordo esterno della testa (giallo)
    ctx.strokeStyle = '#F6E547';
    ctx.fillStyle = '#F6E547';
    ctx.lineWidth = 10 * scale;
    ctx.beginPath();
    ctx.ellipse(centerX, headY + headHeight / 2, headWidth / 2, headHeight / 2, 0, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Riempimento interno
    ctx.fillStyle = 'rgba(246, 229, 71, 0.3)';
    ctx.beginPath();
    ctx.ellipse(centerX, headY + headHeight / 2, headWidth / 2 - 5 * scale, headHeight / 2 - 5 * scale, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Corda orizzontale
    ctx.strokeStyle = '#F6E547';
    ctx.lineWidth = 3 * scale;
    const stringSpacing = (headHeight - 20 * scale) / 9;
    for (let i = 1; i < 9; i++) {
        const y = headY + 10 * scale + stringSpacing * i;
        ctx.beginPath();
        ctx.moveTo(headX + 15 * scale, y);
        ctx.lineTo(headX + headWidth - 15 * scale, y);
        ctx.stroke();
    }
    
    // Corda verticale
    const verticalSpacing = (headWidth - 30 * scale) / 7;
    for (let i = 1; i < 7; i++) {
        const x = headX + 15 * scale + verticalSpacing * i;
        ctx.beginPath();
        ctx.moveTo(x, headY + 10 * scale);
        ctx.lineTo(x, headY + headHeight - 10 * scale);
        ctx.stroke();
    }
    
    // Manico
    const handleWidth = 35 * scale;
    const handleHeight = 100 * scale;
    const handleX = centerX - handleWidth / 2;
    const handleY = headY + headHeight;
    
    ctx.fillStyle = '#F6E547';
    ctx.fillRect(handleX, handleY, handleWidth, handleHeight);
    
    ctx.strokeStyle = '#0B3D2E';
    ctx.lineWidth = 4 * scale;
    ctx.strokeRect(handleX, handleY, handleWidth, handleHeight);
    
    // Impugnatura
    ctx.strokeStyle = '#0B3D2E';
    ctx.lineWidth = 2.5 * scale;
    for (let i = 1; i < 5; i++) {
        const y = handleY + handleHeight / 5 * i;
        ctx.beginPath();
        ctx.moveTo(handleX + 5 * scale, y);
        ctx.lineTo(handleX + handleWidth - 5 * scale, y);
        ctx.stroke();
    }
    
    // Punto centrale
    ctx.fillStyle = '#F6E547';
    ctx.beginPath();
    ctx.arc(centerX, headY + headHeight / 2, 8 * scale, 0, 2 * Math.PI);
    ctx.fill();
    
    // Salva come PNG
    const buffer = canvasEl.toBuffer('image/png');
    const filename = `icon-${size}x${size}.png`;
    const filepath = path.join(iconsDir, filename);
    fs.writeFileSync(filepath, buffer);
    console.log(`✅ Creata: ${filepath}`);
}

// Prova a generare le icone
try {
    console.log('🎾 Generazione icone PWA con racchetta da tennis...\n');
    generateIcon(192);
    generateIcon(512);
    console.log('\n✅ Icone generate con successo!');
} catch (error) {
    if (error.code === 'MODULE_NOT_FOUND' && error.message.includes('canvas')) {
        console.error('❌ Errore: Il modulo "canvas" non è installato.');
        console.log('\n📦 Installa il modulo canvas:');
        console.log('   npm install canvas');
        console.log('\nOppure usa il file generate-icons.html nel browser.');
        process.exit(1);
    } else {
        console.error('❌ Errore:', error.message);
        process.exit(1);
    }
}
