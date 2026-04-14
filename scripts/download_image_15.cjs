const https = require('https');
const fs = require('fs');
const path = require('path');

const url = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600';
const dest = path.join(process.cwd(), 'assets', 'images', 'image-15.jpg');

const file = fs.createWriteStream(dest);

https.get(url, (response) => {
    if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log('Image downloaded successfully.');
        });
    } else {
        console.error(`Failed to download image. Status code: ${response.statusCode}`);
    }
}).on('error', (err) => {
    fs.unlink(dest, () => {});
    console.error(`Error downloading image: ${err.message}`);
});
