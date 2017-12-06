var path = require('path');
var fs = require('fs');
var ejs = require('ejs');
var download = require('image-downloader');

var cssTemplate = path.resolve(__dirname, '_templates', 'publisher', 'folder.css.ejs');
var folderInfoTemplate = path.resolve(__dirname, '_templates', 'publisher', 'folder-info.html.ejs');
var publishersFolder = path.resolve(__dirname, '..', 'publishers');
var filePath = path.resolve(__dirname, '..', 'publishers.json');

function getFilePath(publisher, filename) {
  return path.resolve(publishersFolder, publisher.folderName, filename);
}

function generateCssFile(publisher) {
  ejs.renderFile(cssTemplate, publisher, function(err, result) {
    if (err) {
      console.log('error rendering template');
    } else {
      fs.writeFileSync(getFilePath(publisher, 'folder.css'), result, 'utf8');
    }
  });
}

function generatePublisherPage(publisher) {
  ejs.renderFile(folderInfoTemplate, publisher, function(err, result) {
    if (err) {
      console.log('error rendering template', err);
    } else {
      fs.writeFileSync(getFilePath(publisher, 'folder-info.html'), result, 'utf8');
    }
  });
}

function downloadImages(publisher) {
  if (publisher.logo) {
    download({ url: publisher.logo, dest: getFilePath(publisher, 'folder.jpg')});
  }

  if (publisher.banner) {
    download({ url: publisher.banner, dest: getFilePath(publisher, 'header.jpg')});
  }
}

function processPublisher(publisher) {
  console.log('Processing ' + publisher.name + '...');
  fs.mkdirSync(getFilePath(publisher, '.'));
  generateCssFile(publisher);
  generatePublisherPage(publisher);
  downloadImages(publisher);
}

function processPublishers(publishers, index) {
  if (!index) {
    index = 0;
  }

  if (index < publishers.length) {
    if (!fs.existsSync(getFilePath(publishers[index], '.'))) {
      setTimeout(function() {
        processPublisher(publishers[index++]);
        processPublishers(publishers, index);
      }, 5000);
    } else {
      console.log('Publisher: ' + publishers[index].name + ' already exists, skipping...');
      processPublishers(publishers, ++index);
    }
  }
}

function generatePages() {
  if (fs.existsSync(filePath)) {
    var publishers = JSON.parse(fs.readFileSync(filePath));

    publishers.forEach(function(publisher) {
      publisher.folderName = publisher.name.replace('/', '');
    });

    console.log('publishers.json does exist. Generating pages...');
    processPublishers(publishers);
  } else {
    console.error('publishers/publishers.json does not exist. Please run the generate-data task');
  }
};

module.exports = generatePages;
