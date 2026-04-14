const fs = require('fs');
const path = require('path');

const files = ['index.html', 'servicios.html', 'startups/startups.html', 'merge.html'];

for (const file of files) {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        
        // Fix double dot-slash
        content = content.replace(/\.\/\.\//g, './');
        
        // Remove query params from local image paths
        content = content.replace(/(\.\/|\.\.\/)assets\/images\/([^"'\s?]+)\?[^"'\s]*/g, '$1assets/images/$2');
        
        // Fix undefined image
        content = content.replace(/assets\/images\/undefined/g, 'assets/images/image-13.jpg');

        fs.writeFileSync(fullPath, content);
        console.log(`Fixed ${file}`);
    }
}
