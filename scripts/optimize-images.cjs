const fs=require("node:fs"),sharp=require("sharp");
(async()=>{
await sharp("images/site-photo.jpg").rotate().resize({width:680,withoutEnlargement:true}).webp({quality:82}).toFile("images/site-photo.webp");
await sharp("images/portfolio-preview.png").resize({width:1000,withoutEnlargement:true}).webp({quality:82}).toFile("images/portfolio-preview.webp");
const icon='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#0d1b1e"/><path d="M43 19H26a9 9 0 0 0 0 18h12a5 5 0 0 1 0 10H20" fill="none" stroke="#3ccbc3" stroke-width="6" stroke-linecap="round"/></svg>';
fs.writeFileSync("icons/favicon.svg",icon);
await sharp(Buffer.from(icon)).resize(180,180).png().toFile("icons/apple-touch-icon.png");
const social='<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#0d1b1e"/><rect x="70" y="95" width="70" height="7" rx="3" fill="#3ccbc3"/><text x="70" y="225" fill="#eaf4f3" font-family="Arial,sans-serif" font-size="80" font-weight="700">Sina Amiri</text><text x="70" y="315" fill="#3ccbc3" font-family="Arial,sans-serif" font-size="42">Front-End Developer</text><text x="70" y="410" fill="#a3bdbb" font-family="Arial,sans-serif" font-size="30">Learning, building, and growing through projects.</text><text x="70" y="535" fill="#a3bdbb" font-family="Arial,sans-serif" font-size="28">Portfolio · Projects · Contact</text></svg>';
await sharp(Buffer.from(social)).png().toFile("images/social-preview.png");
await sharp(Buffer.from(social)).webp({quality:90}).toFile("images/social-preview.webp");
})();