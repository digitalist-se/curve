# Curve Drupal site

This is the Drupal 11–based website for Curve.  
It’s built using the [Platform.sh Drupal 11 template](https://github.com/platformsh-templates/drupal11) and configured for local development with [Lando](https://docs.lando.dev/).

## Local environment

### Requirements
- [Lando](https://docs.lando.dev/) v3+

### Setup

```bash
git clone git@github.com:digitalist-se/curve.git
cd curve
lando start
lando composer install
```

After setup, the site is available at: https://curve.lndo.site

## Database and files

To get db dump use:
```bash
platform db:dump
```

To import a database in lando:
```bash
lando db-import curve-dump.sql
```
