var program = require('commander');
var package = require('./package.json');
var importers = require('./lib/importers');
var generatePages = require('./lib/generate-pages');

program
  .version(package.version)
  .option('-a, --all', 'Run all importers')
  .option('-i, --importers', 'Specific Importers to run')
  .option('-p, --pages', 'Generate publisher pages')
  .parse(process.argv);

var importersToRun = [];

if (program.importers) {
  importersToRun = program.importers.split(',').map(function(importer) {
    return importers[importer];
  });
} else if (program.all) {
  importersToRun = Object.values(importers);
}

var importerProcesses = importersToRun.map(function(importerToRun) {
  return importerToRun();
});

Promise.all(importerProcesses).then(function() {
  if (program.pages) {
    generatePages();
  }
});
