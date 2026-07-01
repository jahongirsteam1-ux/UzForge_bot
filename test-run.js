const cp = require('child_process');
const fs = require('fs');

let code = fs.readFileSync('apps/bot-core/dist/index.js', 'utf8');
code = code.replace('await mongoose_1.default.connect(uri);', 'console.log("Mocked mongoose");');
fs.writeFileSync('apps/bot-core/dist/index.js', code);

const child = cp.spawn('node', ['apps/bot-core/dist/index.js'], { stdio: 'inherit' });
setTimeout(() => child.kill(), 10000);
