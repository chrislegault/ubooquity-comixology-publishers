# Ubooquity Comixology Theme Publishers

## About

Import publisher data from various sources and generate publisher pages for the [Ubooquity Comixology Theme](https://ubooquity.userecho.com/forums/1-general/topics/27-comixology-theme/).

## Currently Support Sources
- Comixology

## Requirements
- Node >= 8
- Yarn >= 1.3

## Setup

Install the dependencies:
```
yarn
```

Import all sources:
```
yarn generate
```

Import a single source:
```
yarn generate --importers=comixology
```

Import multiple sources:
```
yarn generate --importers=importer1,importer2
```

## Manually adding a publisher
- add an entry to the publishers/publishers.json
- ensure it conforms to the publisher format
- yarn generate-pages

## publisher format

- name - Name of the publisher
- url (optional) - Url to publisher page, there for quick validation of generated pages
- logo - Url of the publisher logo to be downloaded
- banner - Url of the publisher banner to be downloaded
- backgroundColor - color that shows behind issues
- textColor - color for issue names
- imprints - list of publishers to be used as imprints
- bannerSpacing - On comixology sometimes they pull content closer to the banner depending on what the banner looks like. This is here to help replicate that on a manual basis if need be. 0 is normal positioning. A negative number will pull the content closer to the banner. A positive number would push the content further from the banner.
