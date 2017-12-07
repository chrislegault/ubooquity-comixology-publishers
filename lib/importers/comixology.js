var path = require('path');
var fs = require('fs');
var x = require('x-ray')();

var bannerExp = /url\(['"]?(.*)\)/g;
var styleExp = /([\w-]*)\s*:\s*([^;]*)/g;

function trim(stringToTrim) {
  return stringToTrim.trim();
}

function stylesToObject(styleString) {
  var match, properties={};

  while (match = styleExp.exec(styleString)) {
    var words = match[1].split('-');

    var propertyName = words.map(function(word, index) {
      if (index !== 0) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }

      return word;
    }).join('');

    properties[propertyName] = trim(match[2]);
  }

  return properties;
}

function extractMatch(expression, stringToTest) {
  var match, matchValue;

  while (match = bannerExp.exec(stringToTest)) {
    matchValue = match[1];
  }

  return matchValue;
}

function fixPublisher(publisher) {
  var pageProps = publisher.page;
  var textColor = (pageProps.textColor || '').replace(/;|}|\n|\t/g, '').split(':');
  var bannerStyles = stylesToObject(pageProps.banner);
  delete publisher.page;

  return Object.assign({}, publisher, pageProps, {
    name: trim(publisher.name),
    url: publisher.url.split('?')[0],
    banner: extractMatch(bannerExp, bannerStyles.backgroundImage),
    bannerSpacing: bannerStyles.paddingTop,
    backgroundColor: stylesToObject(pageProps.backgroundColor).backgroundColor,
    textColor: textColor.length === 2 ? textColor[1].trim() : '#000000',
    imprints: pageProps.imprints.map(trim)
  });
}

function comixology() {
  console.log('importing comixology publishers...');

  return new Promise(function(resolve, reject) {
    x('https://www.comixology.com/browse-publisher', '.publisherList .publisher-list .content-item', [{
      name: '.content-title',
      url: '.content-img-link@href',
      logo: '.content-img@src',
      page: x('.content-img-link@href', {
        banner: '.publisherPage@style',
        backgroundColor: '.publisherPageOutter@style',
        textColor: '.content_body style',
        imprints: ['.publisherPage .imprintNav li a']
      })
    }]).paginate('.pager-link.next-page@href')(function(err, publishers) {
      publishers = publishers.map(fixPublisher);
      fs.writeFileSync(path.resolve(__dirname, '..', '..', 'publishers.json'), JSON.stringify(publishers, null, 2), 'utf8');
      resolve(publishers);
    });
  });
}

module.exports = comixology;
