const fs = require('fs');
const sass = require('sass');
const glob = require('glob');

console.log('\n'+'='.repeat(80), '\nbuilding...');

// START
const startTime = Date.now();

// CSS

const cssFiles = glob.sync('./*.scss');
for (let sheet of cssFiles) {
	const name = sheet.replace('./','').replace('.scss','');
	const css = sass.renderSync({file: sheet, outputStyle: 'compressed'});
	fs.writeFileSync('./'+name+'.css', css.css);
	console.log('rendered',name+'.css');
}

// END
const endTime = Date.now();
console.log('build complete in',endTime-startTime,'ms', '\n'+'='.repeat(80), '\n');