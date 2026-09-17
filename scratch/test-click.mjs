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

// Wait for Chrome to be ready
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

if (!pageTarget) {
  console.error('No page target found');
  chromeProc.kill();
  process.exit(1);
}

const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

await new Promise(r => ws.onopen = r);

let id = 1;
const callbacks = new Map();
ws.onmessage = (msg) => {
  const data = JSON.parse(msg.data);
  if (data.id && callbacks.has(data.id)) {
    callbacks.get(data.id)(data.result);
    callbacks.delete(data.id);
  } else if (data.method) {
    if (data.method === 'Runtime.consoleAPICalled') {
      console.log('[CONSOLE]', data.params.type, data.params.args.map(a => a.value));
    } else if (data.method === 'Page.frameNavigated') {
      console.log('[NAVIGATED]', data.params.frame.url);
    }
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

await send('Emulation.setDeviceMetricsOverride', {
  width: 1280,
  height: 800,
  deviceScaleFactor: 1,
  mobile: false
});

console.log('Setting active student session...');
await send('Page.navigate', { url: 'http://localhost:8080/student-dashboard.html' });
await send('Runtime.evaluate', {
  expression: `localStorage.setItem('currentUser', JSON.stringify({ name: 'Vignesh R', role: 'CUSTOMER', email: 'vignesh@learnsphere.example' }))`
});

console.log('Navigating to student-dashboard.html with active session...');
await send('Page.navigate', { url: 'http://localhost:8080/student-dashboard.html' });

await new Promise(r => setTimeout(r, 2000));

const evalRes = await send('Runtime.evaluate', {
  expression: `(() => {
    const brand = document.querySelector('.dash-brand');
    const rect = brand ? brand.getBoundingClientRect() : null;
    const elementAtPoint = rect ? document.elementFromPoint(rect.left + 5, rect.top + 5) : null;
    return {
      brandFound: !!brand,
      brandHref: brand ? brand.getAttribute('href') : null,
      rect: rect ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height } : null,
      elementAtPoint: elementAtPoint ? elementAtPoint.outerHTML.substring(0, 100) : null,
      currentUser: localStorage.getItem('currentUser')
    };
  })()`,
  returnByValue: true
});

console.log('Eval result before click:', evalRes.result.value);

const rect = evalRes.result.value.rect;
if (rect) {
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  console.log(`Dispatching mouse click at (${x}, ${y})...`);
  await send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });
}

await new Promise(r => setTimeout(r, 2000));

const afterEval = await send('Runtime.evaluate', {
  expression: `({
    url: window.location.href,
    currentUser: localStorage.getItem('currentUser')
  })`,
  returnByValue: true
});

console.log('Eval result after click:', afterEval.result.value);

ws.close();
chromeProc.kill();
process.exit(0);
