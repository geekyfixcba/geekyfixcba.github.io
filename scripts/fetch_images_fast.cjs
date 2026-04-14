const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(process.cwd(), 'assets', 'images');

if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

const images = [
    { url: 'https://geekyfixcba.github.io/logo.png', name: 'logo.png' },
    { url: 'https://images.unsplash.com/photo-1581287053822-fd7bf4f4bfec?auto=format&fit=crop&q=80&w=600', name: 'image-1.jpg' },
    { url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=600', name: 'image-2.jpg' },
    { url: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=600', name: 'image-3.jpg' },
    { url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=600', name: 'image-4.jpg' },
    { url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600', name: 'image-5.jpg' },
    { url: 'https://images.unsplash.com/photo-1531297172868-9f140cece06b?auto=format&fit=crop&q=80&w=600', name: 'image-6.jpg' }, // fixed typo 06n -> 06b
    { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600', name: 'image-7.jpg' },
    { url: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=600', name: 'image-8.jpg' },
    { url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600', name: 'image-9.jpg' },
    { url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600', name: 'image-10.jpg' },
    { url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=600', name: 'image-11.jpg' },
    { url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600', name: 'image-12.jpg' },
    { url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600', name: 'image-13.jpg' },
    { url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=600', name: 'image-14.jpg' },
    { url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=600', name: 'image-15.jpg' },
    { url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600', name: 'image-16.jpg' },
    { url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=600', name: 'image-17.jpg' },
];

async function downloadImage(url, filename) {
    const filePath = path.join(ASSETS_DIR, filename);
    try {
        const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
        if (!response.ok) throw new Error(`Status ${response.status}`);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fs.writeFileSync(filePath, buffer);
        console.log(`Downloaded ${filename}`);
    } catch (err) {
        console.error(`Failed to download ${filename} from ${url}: ${err.message}`);
        // Fallback
        if (url.includes('unsplash')) {
            console.log(`Trying fallback for ${filename}...`);
            const fallbackUrl = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600';
            try {
                const res = await fetch(fallbackUrl, { signal: AbortSignal.timeout(10000) });
                const buf = Buffer.from(await res.arrayBuffer());
                fs.writeFileSync(filePath, buf);
                console.log(`Downloaded fallback for ${filename}`);
            } catch (e) {
                console.error(`Fallback failed for ${filename}: ${e.message}`);
            }
        }
    }
}

async function run() {
    const promises = images.map(img => downloadImage(img.url, img.name));
    await Promise.all(promises);
    console.log('All downloads finished.');
}

run();
