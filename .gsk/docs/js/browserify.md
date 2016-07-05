
JS: Browserify
===============================================================================

Gérer les scripts de votre projet avec Browserify va vos permettre de travaillé
de manièer plus fine et plus avancé sur vos projets. Cette tache JS va vous
permettre les choses suivantes:

* Modulariser votre code
* Gérer vos dépendances tiers via NPM
* Utiliser la syntaxe ES2015 pour tous vos scripts

Configuration:
```json
{
  "js": {
    "engine": "browserify"
  }
}
```


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

Si vous utilisez des bibliothèques tiers (comme jQuery), il vous suffit de les
installer via NPM (notez l'utilisation de `--save` pour que les dépendances
soient proprement versionnées avec l'ensemble du projet) :

```bash
$ npm i jquery,underscore,moment --save
```

Pour les utiliser, vous pouvez soit utiliser la fonction `require` des modules
CommonJS, soit la syntax `import` des modules ES2015.

### Babel et ES2015

Par defaut, browserify utilise [Babel](http://babeljs.io/) pour transpiler en
ES5 les scripts qui suivent la syntaxe standard ES2015. Si vous souhaitez que
Babel fasse plus de choses (par exemple traiter les fichier React JSX), il vous
suffit juste d'installer [les plugin correspondant](http://babeljs.io/docs/plugins/).

```bash
$ npm i babel-react --save-dev
```
