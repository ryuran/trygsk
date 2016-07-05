
JS: Simple Pipeline
===============================================================================

Il s'agit là de la façon la plus simple de gérer les scripts JS du projet. Avec
cette tache de base, les fichiers JS seront automatiquement concaténés et
minifié mais rien de plus.

Configuration:
```json
{
  "js": {
    "engine": "simple"
  }
}
```

> **NOTE:** _La concaténation des fichiers est faites dans l'ordre alphabétique
  des nom de fichiers puis de dossiers._


Configuration standard
-------------------------------------------------------------------------------

### Nom du fichier généré

Vous pouvez changer le nom du fichier généré via l'option `js.filename`, dans
le fichier configuration:

```json
{
  "js": {
    "filename": "script.js"
  }
}
```

### Bibliothèques tiers

Si vous utilisez des bibliothèques tiers (comme jQuery), il est vivement
recommandé les placer dans le dossier `src/js/lib`. Tous les fichiers placés
dans ce dossier seront concaténé **avant** tous les autres. _C'est la seul
exception à la concaténation en ordre alphabétique._
