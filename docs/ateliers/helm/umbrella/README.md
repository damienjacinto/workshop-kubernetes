# Repo Helm et Umbrella chart

Helm est un des outils priviligiés pour déployer dans kubernetes, il existe des charts pour la majorité des outils du marché.
Historiquement helm hébergeait toutes les charts dans un dépot nommé [stable](https://github.com/helm/charts/tree/master/stable) depuis la responsabilité d'herbeger les charts a été rendu aux contributeurs. Le repo stable est maintenant deprecié.
Un dépot helm est un index qui liste les charts avec leur version et le chemin de téléchargement. Il existe des outils pour héberger un dépot comme artifactory, chartmuseum cependant une github-page pour l'index est suffisant.

## Exercice 1

Pour pouvoir utiliser une charte présente dans un dépot, il faut ajouter ce dépot au client helm

- Executer la commande suivante :

```shell
helm repo add bitnami https://charts.bitnami.com/bitnami
```

> Cela va référencer le dépot nommé localement `bitnami` ([bitnami](https://bitnami.com/stacks/helm) qui est devenu mainteneur de nombreuses charts )

Une fois le dépot ajouté il est possible de faire des recherches de charts

- Executer la commande suivante pour rechercher les charts disponibles pour wordpress :

```shell
helm search repo wordpress -l
```

> Les charts sont présentées sous la forme < dépot >/< chart >

Helm permet de voir le contenu d'une chart, télécharger les fichiers sources.

- Executer la commande suivante en précisant une version disponible :

```shell
helm show readme bitnami/wordpress
helm pull bitnami/wordpress --version XXXX
```

> Une charte est packagée dans une archive, il suffit de l'extraire pour retrouver le contenu de la chart helm

## Exercice 2

Il est possible d'installer une chart directement depuis un dépot. Dans l'atelier précédent la chart à installer était déjà précisée avec `.` . Le `.` signifiant une charte locale.

- Créer un nouveau namespace `loki` et se placer dans ce namespace
- Ajouter le dépot helm repo de grafana (https://grafana.github.io/helm-charts)
- Etudier la charte pour installer loki avec grafana et prometheus
- Installer la chart avec les bon setter
- Consulter les pods et les secrets

> La chart loki a en dépendance de nombreuses charts qui sont dans différents dépôts.

- Consulter le fichier de [dépendance](https://github.com/grafana/helm-charts/blob/main/charts/loki-stack/requirements.yaml)

> Chaque charte en dépendance est identifié par un alias. Depuis la charte principale cet alias permet de surcharger les valeurs par défaut des chartes en dépendance.

- Accéder au service grafana par port-forward
- Importer le dashboard `1860` par le menu Dashboard > Manage [Import]
- Sélectionner le folder général et la data source Prometheus avant d'importer

> Ce principe de chart imbriqué est appelé `chart umbrella`
