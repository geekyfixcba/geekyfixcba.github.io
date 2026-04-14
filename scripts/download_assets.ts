import fs from 'fs';
import path from 'path';
import https from 'https';

const ASSETS_DIR = path.join(process.cwd(), 'assets', 'images');

if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

async function downloadImage(url: string, filename: string): Promise<string> {
    const filePath = path.join(ASSETS_DIR, filename);
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                const fileStream = fs.createWriteStream(filePath);
                res.pipe(fileStream);
                fileStream.on('finish', () => {
                    fileStream.close();
                    resolve(filename);
                });
            } else {
                reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
            }
        }).on('error', (err) => {
            reject(err);
        });
    });
}

const urlMap: Record<string, string> = {};
let imageCounter = 1;

async function processFile(filePath: string) {
    let content = fs.readFileSync(filePath, 'utf8');
    const imgRegex = /https:\/\/images\.unsplash\.com\/photo-[^"'\s?]+/g;
    const logoRegex = /https:\/\/geekyfixcba\.github\.io\/logo\.png/g;
    const localAssetsRegex = /(?:\.\.\/)*assets\/images\/[^"'\s?]+/g;
    
    const unsplashUrls = content.match(imgRegex) || [];
    const logoUrls = content.match(logoRegex) || [];
    const localPaths = content.match(localAssetsRegex) || [];
    
    // Process URLs first to ensure they are downloaded
    for (const url of [...new Set([...unsplashUrls, ...logoUrls])]) {
        if (!urlMap[url]) {
            let filename = '';
            if (url.includes('logo.png')) {
                filename = 'logo.png';
            } else {
                filename = `image-${imageCounter++}.jpg`;
            }
            try {
                console.log(`Downloading ${url} as ${filename}...`);
                await downloadImage(url, filename);
                urlMap[url] = filename;
            } catch (err) {
                console.error(`Error downloading ${url}:`, err);
            }
        }
    }

    // Now replace all matches (URLs and local paths) with correct relative paths
    const allMatches = [...new Set([...unsplashUrls, ...logoUrls, ...localPaths])];
    
    for (const match of allMatches) {
        let filename = '';
        if (urlMap[match]) {
            filename = urlMap[match];
        } else if (match.includes('assets/images/')) {
            filename = match.split('assets/images/')[1].split('?')[0];
        } else {
            continue; // Should not happen if urlMap is populated
        }

        const currentDir = path.dirname(filePath);
        let relativePath = path.relative(currentDir, path.join(ASSETS_DIR, filename));
        
        // Ensure it doesn't start with a slash if it's in the same dir
        if (!relativePath.startsWith('.')) {
            relativePath = './' + relativePath;
        }
        // Actually, for root files, 'assets/images/logo.png' is fine, but './assets/images/logo.png' is also fine.
        // Let's normalize it to not have './' if it's just a direct subfolder for cleaner look, 
        // but relative path is safer.
        
        content = content.split(match).join(relativePath);
    }
    
    fs.writeFileSync(filePath, content);
}

async function main() {
    const files = ['index.html', 'servicios.html', 'startups/startups.html', 'merge.html'];
    for (const file of files) {
        const fullPath = path.join(process.cwd(), file);
        if (fs.existsSync(fullPath)) {
            console.log(`Processing ${file}...`);
            try {
                await processFile(fullPath);
            } catch (err) {
                console.error(`Error processing ${file}:`, err);
            }
        }
    }
    console.log('Done!');
}

main();
