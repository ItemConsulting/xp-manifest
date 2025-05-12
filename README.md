# Web App Manifest for XP

This application lets an admin configure a [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest)
-file, and use `pageContributions` add it to the pages on the site.

[![](https://repo.itemtest.no/api/badge/latest/releases/no/item/xp-manifest)](https://repo.itemtest.no/#/releases/no/item/xp-manifest)

## Usage

Install the application and add it to your site. Then configure it in the site config.

### Screenshots

Screenshots will be resized to the following sizes:

 - **wide:** 1920x1080
 - **narrow:** 750x1334

## Deploying

### Building

To build the project run the following code

```bash
enonic project build
```

### Deploy locally

Deploy locally for testing purposes:

```bash
enonic project deploy
```

### Deploy to Maven

```bash
./gradlew publish -P com.enonic.xp.app.production=true
```
