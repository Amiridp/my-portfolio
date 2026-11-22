const {spawn}=require('node:child_process');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
(async()=>{
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'sina-browser-'));
const edge=spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',['--headless','--disable-gpu','--no-first-run','--remote-debugging-port=9337','--user-data-dir='+dir,'about:blank'],{windowsHide:true,stdio:'ignore'});
let ws,seq=0;const pending=new Map(),errors=[];
try{
let tabs;
for(let i=0;i<60;i++){try{tabs=await(await fetch('http://127.0.0.1:9337/json')).json();break;}catch{await new Promise(r=>setTimeout(r,200));}}
if(!tabs)throw Error('Browser did not start');
ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);
await new Promise(r=>ws.addEventListener('open',r,{once:true}));
ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);m.error?p.reject(m.error):p.resolve(m.result);}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text);});
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
const run=async expression=>{if(typeof expression==='function')expression='('+expression.toString()+')()';const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
await send('Runtime.enable');await send('Page.enable');
const results=[];
for(const width of [320,375,390,640,768,900,1024,1280,1440]){
await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});
await send('Page.navigate',{url:require('node:url').pathToFileURL(path.join(__dirname,'dist','index.html')).href});
await new Promise(r=>setTimeout(r,350));
await run('document.fonts.ready.then(()=>true)');
for(const theme of ['light','dark']){
await run('document.documentElement.dataset.theme='+JSON.stringify(theme));
await run('window.scrollTo(0,0)'); await new Promise(r=>setTimeout(r,650));
const result=await run(()=>{
const width=innerWidth;
const overflow=[...document.querySelectorAll('body *')].filter(el=>{
const s=getComputedStyle(el);if(s.display==='none'||s.visibility==='hidden'||el.closest('dialog:not([open])'))return false;
const r=el.getBoundingClientRect();return r.width>0&&(r.right>width+1||r.left< -1);
}).map(el=>el.tagName+'.'+el.className);
return {width,theme:document.documentElement.dataset.theme,scrollWidth:document.documentElement.scrollWidth,overflow:overflow.slice(0,20),
menuVisible:getComputedStyle(document.querySelector('.menu-toggle')).display!=='none',
skills:getComputedStyle(document.querySelector('.skills-orbit')).display};
});
results.push(result);
if(width===375||width===1280){
const size=await send('Page.getLayoutMetrics');
const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width,height:Math.ceil(size.cssContentSize.height),scale:1}});
fs.writeFileSync(path.join(dir,width+'-'+theme+'.png'),Buffer.from(shot.data,'base64'));
}
}
}
await send('Emulation.setDeviceMetricsOverride',{width:375,height:812,deviceScaleFactor:1,mobile:false});
await run('window.scrollTo(0,0)'); await new Promise(r=>setTimeout(r,650));
await new Promise(r=>setTimeout(r,100));
const interactions=await run(()=>{
const nav=document.querySelector('.main-nav'),menu=document.querySelector('.menu-toggle'),theme=document.querySelector('.theme-toggle');
menu.click();const opens=!nav.hidden&&menu.getAttribute('aria-expanded')==='true';
document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));const escape=nav.hidden;
menu.click();document.querySelector('main').click();const outside=nav.hidden;
menu.click();nav.querySelector('[href="#about"]').click();const link=nav.hidden&&document.activeElement.id==='about';
const prev=document.documentElement.dataset.theme;theme.click();const toggles=document.documentElement.dataset.theme!==prev;const saved=localStorage.getItem('portfolio-theme')===document.documentElement.dataset.theme;
const dialogs=[...document.querySelectorAll('.project-view')].map(btn=>{btn.click();const d=document.querySelector('.project-dialog');const ok=d.open&&document.querySelector('#project-dialog-title').textContent.length>0;document.querySelector('.project-close').click();return ok&&!d.open;});
const form=document.querySelector('.contact-form');const invalid=!form.checkValidity();
return {opens,escape,outside,link,toggles,saved,dialogs,emptyFormInvalid:invalid};
});
console.log(JSON.stringify({results,interactions,errors,screenshots:dir},null,2));
if(errors.length || results.some(r=>r.overflow.length || r.scrollWidth>r.width) || Object.values(interactions).flat().some(v=>v!==true)) process.exitCode=1;
await send('Browser.close');
}finally{if(ws)ws.close();edge.kill();}
})().catch(e=>{console.error(e);process.exitCode=1});