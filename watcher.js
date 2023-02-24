const chokidar = require('chokidar');
const childProcess = require('child_process');

const watcher = chokidar.watch('./*.scss', {
	ignored: ['node_modules/**', 'build/**', '.git/**', 'dist'], // ignore dotfiles
	persistent: true,
	ignoreInitial: true
});

watcher.on('all', (event, path) => {
	childProcess.fork('./build.js'); 
});   

console.log('watcher started...\n\n');