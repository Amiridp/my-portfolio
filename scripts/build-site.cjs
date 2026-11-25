const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,".."),out=path.join(root,"dist");
fs.mkdirSync(out,{recursive:true});
const assets=[
"css/site.css","js/theme.js","js/navigation.js","js/contact.js","js/projects.js","js/back-to-top.js","js/reveal.js",
"images/site-photo.webp","images/portfolio-preview.webp","images/social-preview.webp","images/social-preview.png",
"font/bricolage-grotesque-latin-wght-normal.woff2","MyResume(SinaAmiri).pdf"
];
for(const file of assets){
const dest=path.join(out,file);
fs.mkdirSync(path.dirname(dest),{recursive:true});
fs.copyFileSync(path.join(root,file),dest);
}
let html=fs.readFileSync(path.join(root,"index.html"),"utf8");
const host = process.env.SITE_URL || "https://sina-amiri.ir";
if(host){
const origin=new URL(host).origin;
html=html.replaceAll('content="/images/social-preview.png"','content="'+origin+'/images/social-preview.png"');
html=html.replace("</head>",'<link rel="canonical" href="'+origin+'/" />\n<meta property="og:url" content="'+origin+'/" />\n</head>');
fs.writeFileSync(path.join(out,"sitemap.xml"),'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>'+origin+'/</loc></url></urlset>');
fs.writeFileSync(path.join(out,"robots.txt"),"User-agent: *\nAllow: /\nSitemap: "+origin+"/sitemap.xml\n");
}else{
fs.writeFileSync(path.join(out,"robots.txt"),"User-agent: *\nAllow: /\n");
}
fs.writeFileSync(path.join(out,"index.html"),html);
for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){
const ref=m[1];if(/^(https?:|mailto:|#|\/)/.test(ref))continue;
if(!fs.existsSync(path.join(out,ref)))throw Error("Missing published asset: "+ref);
}
console.log("Built dist with "+assets.length+" assets; all local HTML references verified.");