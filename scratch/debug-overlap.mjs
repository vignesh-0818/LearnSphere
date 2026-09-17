import { spawn } from 'child_process';
import http from 'http';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const chromeProc = spawn(chromePath, [
  '--remote-debugging-port=9222',
  '--headless=new',
  '--user-data-dir=C:\\Users\\vv356\\Downloads\\LearnSphere-Tutoring-HTML-Template-fixed (2)\\LearnSphere-Tutoring-HTML-Template\\chrome-test-dir',
  '--no-first-run',
  '--no-default-browser-check'
]);

await new Promise(r => setTimeout(r, 1500));

async function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

const targets = await getJson('http://127.0.0.1:9222/json/list');
const pageTarget = targets.find(t => t.type === 'page');

const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
await new Promise(r => ws.onopen = r);

let id = 1;
const callbacks = new Map();
ws.onmessage = (msg) => {
  const data = JSON.parse(msg.data);
  if (data.id && callbacks.has(data.id)) {
    callbacks.get(data.id)(data.result);
    callbacks.delete(data.id);
  }
};

function send(method, params = {}) {
  return new Promise(resolve => {
    const msgId = id++;
    callbacks.set(msgId, resolve);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });
}

await send('Page.enable');
await send('Runtime.enable');
await send('Network.enable');
await send('Network.setCacheDisabled', { cacheDisabled: true });
await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: 'http://localhost:8080/student-dashboard.html' });
await new Promise(r => setTimeout(r, 1500));

const debugInfo = await send('Runtime.evaluate', {
  expression: `(() => {
    const subjectLink = document.querySelector('a[href="student-subjects.html"][style*="position:absolute"]');
    const brand = document.querySelector('.dash-brand');
    const aside = document.querySelector('.dash-side');
    const card = subjectLink ? subjectLink.parentElement : null;
    
    return {
      brandRect: brand ? brand.getBoundingClientRect() : null,
      subjectLinkRect: subjectLink ? subjectLink.getBoundingClientRect() : null,
      subjectLinkOffsetParent: subjectLink && subjectLink.offsetParent ? subjectLink.offsetParent.tagName + '.' + subjectLink.offsetParent.className : null,
      cardPosition: card ? window.getComputedStyle(card).position : null,
      cardRect: card ? card.getBoundingClientRect() : null,
      asideZIndex: aside ? window.getComputedStyle(aside).zIndex : null,
      asidePosition: aside ? window.getComputedStyle(aside).position : null,
      allAbsoluteLinks: Array.from(document.querySelectorAll('a[style*="position:absolute"]')).map(a => ({
        href: a.getAttribute('href'),
        rect: a.getBoundingClientRect(),
        parent: a.parentElement.tagName + '.' + a.parentElement.className,
        parentPos: window.getComputedStyle(a.parentElement).position
      }))
    };
  })()`,
  returnByValue: true
});

console.log(JSON.stringify(debugInfo.result.value, null, 2));

ws.close();
chromeProc.kill();
process.exit(0);
