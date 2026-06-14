const fs = require('fs');
const https = require('https');
const path = require('path');

const outputTxt = fs.readFileSync('C:/Users/Naeem/.gemini/antigravity/brain/c38bd037-5c11-4760-84eb-be645a584608/.system_generated/steps/337/output.txt', 'utf8');
const data = JSON.parse(outputTxt);

const outDir = path.join(__dirname, 'stitch_html');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

async function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        // Handle redirects if any
        if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 303 || res.statusCode === 307) {
            https.get(res.headers.location, (res2) => {
                const file = fs.createWriteStream(dest);
                res2.pipe(file);
                file.on('finish', () => { file.close(); resolve(); });
            }).on('error', reject);
            return;
        }
        reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
        return;
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function main() {
  for (const screen of data.screens) {
    if (!screen.htmlCode || !screen.htmlCode.downloadUrl) continue;
    const filename = screen.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.html';
    const filepath = path.join(outDir, filename);
    console.log(`Downloading ${screen.title}...`);
    try {
      await download(screen.htmlCode.downloadUrl, filepath);
      console.log(`Saved ${filename}`);
    } catch (e) {
      console.error(e);
    }
  }
}

main();
