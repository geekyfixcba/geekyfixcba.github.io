const fs = require('fs');
const path = require('path');
const https = require('https');

const ASSETS_DIR = path.join(process.cwd(), 'assets', 'images');

if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

function downloadImage(url, filename) {
    const filePath = path.join(ASSETS_DIR, filename);
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                return downloadImage(res.headers.location, filename).then(resolve).catch(reject);
            }
            if (res.statusCode === 200) {
                const fileStream = fs.createWriteStream(filePath);
                res.pipe(fileStream);
                fileStream.on('finish', () => {
                    fileStream.close();
                    console.log(`Downloaded ${filename}`);
                    resolve(filename);
                });
            } else {
                reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
            }
        }).on('error', reject);
    });
}

const images = [
    { url: 'https://geekyfixcba.github.io/logo.png', name: 'logo.png' },
    { url: 'https://images.unsplash.com/photo-1581287053822-fd7bf4f4bfec?auto=format&fit=crop&q=80&w=600', name: 'image-1.jpg' }, // Hogar
    { url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=600', name: 'image-2.jpg' }, // Startups
    { url: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=600', name: 'image-3.jpg' }, // PC Lenta
    { url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=600', name: 'image-4.jpg' }, // Router
    { url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600', name: 'image-5.jpg' }, // Celular
    { url: 'https://images.unsplash.com/photo-1531297172868-9f140cece06n?auto=format&fit=crop&q=80&w=600', name: 'image-6.jpg' }, // Persona notebook
    { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600', name: 'image-7.jpg' }, // Componentes PC
    { url: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=600', name: 'image-8.jpg' }, // Impresora
    { url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600', name: 'image-9.jpg' }, // Personas aprendiendo
    { url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600', name: 'image-10.jpg' }, // Niño tablet
    { url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=600', name: 'image-11.jpg' }, // Fotos
    { url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600', name: 'image-12.jpg' }, // Soporte IT
    { url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600', name: 'image-13.jpg' }, // E-commerce
    { url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=600', name: 'image-14.jpg' }, // Networking
    { url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=600', name: 'image-15.jpg' }, // Perfiles Digitales
    { url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600', name: 'image-16.jpg' }, // Desarrollo Web
    { url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=600', name: 'image-17.jpg' }, // Mantenimiento
];

async function run() {
    for (const img of images) {
        try {
            await downloadImage(img.url, img.name);
        } catch (e) {
            console.error(e.message);
            if (img.url.includes('unsplash')) {
                const fallback = `https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600`;
                await downloadImage(fallback, img.name).catch(console.error);
            }
        }
    }
}

run();
