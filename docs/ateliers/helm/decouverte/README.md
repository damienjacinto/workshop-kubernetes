# Créer une chart helm

## Exercice 1

Helm permet de créer un `chart` modèle pour initialiser la création d'une charte applicative.

Executer la commande suivante dans un répertoire de travail :

```shell
helm create monappli
```

Dans le répertoire `monappli` helm a généré les ressources pour installer l'application nginx.

Lancer la commande suivante pour voir le resultat de la charte templétisée avec le fichier de valeur par défaut :

```shell
helm template marelease .
# équivalent à
helm template marelease . -f values.yaml
```

## Exercice 2

Une charte Helm est bien concue si elle peut s'installer avec les valeurs par défaut.
La charte doit prévoir de s'adapter à toutes les configurations par surcharge des valeurs disponibles dans le fichier `values.yaml`

En regardant dans le fichier values.yaml beaucoup de valeurs sont initialisées à vide et des fonctionnalités sont désactivées par défaut (autoscaling.enabled: false).
Il est possible de surcharger ces valeurs de deux manières, soit en passant par des paramètres lors de l'appel à helm, soit en surchargeant des fichiers de valeurs.

- Relancer la commande de templating de la charte en remplaçant l'image docker `nginx` par `nginxdemos/hello` avec le tag `0.2`. Utiliser l'option --set du client helm.

<details>
<summary>Solution</summary>

```shell
helm template marelease . --set image.repository=nginxdemos/hello,image.tag=0.2
```

</details>

- Réaliser la même modification dans un fichier `values-workshop.yaml`. Appeler la fonction de templating en chaînant les fichiers yaml (-f values.yaml -f values-workshop.yaml).
  Helm va additionner les deux fichiers en appliquant les propriétés du format yaml.

<details>
<summary>Solution</summary>

```shell
# cat values-workshop.yaml
# image:
#   repository: nginxdemos/hello
#   tag: 0.2
helm template marelease . -f values.yaml -f values-workshop.yaml
```

</details>

> Si l'information est sensible on va utiliser le setter, sinon on va plutot privilégier un fichier de valeur par environnement.
> Les deux méthodes peuvent être utiliser conjointement, le setter étant prioritaire sur les valeurs dans les fichiers.

## Exercice 3

Helm v3 utilise le kubeconfig par défaut pour réaliser les opérations de mise à jour. Il faudra donc créer un namespace pour notre release et se placer dans ce namespace avant le déploiement.

- Créer un namespace `nginx` et se positionner dans ce namespace [rappel](../../kubernetes/namespace).

- Déployer la release avec la commande suivante:

```shell
helm upgrade marelease . -f values.yaml -f values-workshop.yaml --install
# equivalent à
helm install marelease . -f values.yaml -f values-workshop.yaml
```

> Lors de la première installation on doit préciser l'option --install, helm ne pouvant pas comparer avec la précédente release.
> Il est possible de surcharger le namespace de destination avec l'option -n < namespace >.
> A la fin de l'installation helm présente le fichier NOTES.txt (ce fichier est lui aussi templetisé)
