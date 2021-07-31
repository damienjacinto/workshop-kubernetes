# Cycle de vie

## Exercice 1

Il est possible d'obtenir des informations et lister les releases installées par helm. Par défaut la recherche est limitée au namespace courant.

Executer la commande suivante dans le namespace utilisé dans le chapitre précédent:

```shell
helm list
```

> On retrouve l'état du déploiement, la version de la chart, la version applicative et une nouvelle information : la révision.
> La révision est comparable à un commit dans un dépôt git.

Il est possible d'afficher les valeurs transmises lors du déploiement de la révision en cours.

Executer la commande suivante:

```shell
helm get values marelease
```

Il est possible de retrouver aussi tout le contenu templétisé

```shell
helm get manifest marelease
```

## Exercice 2

Les outils dans l'écosysteme de kubernetes utilisent les ressources de base pour réaliser des taches plus complèxes.
Helm utilise les secrets de kubernetes pour stocker les informations de la release.

- Lister les secrets dans le namespace courant.

> Le secret `sh.helm.release.v1.marelease.v1` correspond à la révision 1, le secret `sh.helm.release.v1.marelease.v2` correspondra à la révision 2 \
> Il contient toutes les informations pour réaliser le différentiel avec la prochaine installation de la release ou un retour en arrière.

```shell
# unix
kubectl get secret sh.helm.release.v1.marelease.v1 -o go-template='{{.data.release | base64decode | base64decode}}' | gzip -d | jq
# windows
kubectl get secret sh.helm.release.v1.marelease.v1 -o go-template='{{.data.release | base64decode }}' > file.base64
certutil -decode -f file.base64 file.gz
gzip -d file.gz
```

## Exercice 3

- Réaliser les changements suivant dans le fichier `values-workshop.yaml`

* activer de l'ingress
* définir un host égal à ""
* définir un path à "/" (attention le path est un tableau)

<details>
<summary>Solution</summary>

```yaml
ingress:
  enabled: true
  hosts:
    - host: ""
      paths:
        - "/"
```

</details>

> Pour rappel vous pouvez utiliser la commande template pour valider que le rendu est syntaxiquement correct. Essayer avec une chaîne au lieu d'un tableu dans path \
> Il n'est pas nécessaire de préciser toutes les clés dans une arborescence, il y aura une conciliation. Yaml n'assemble pas les valeurs mais uniquement les clés (attention aux tableaux).

- Utiliser l'extension `diff` pour visualiser l'écart entre les deux déploiements:

<details>
<summary>Solution</summary>

```shell
helm diff upgrade marelease . -f values.yaml -f values-workshop.yaml
```

</details>

- Appliquer les changements en enlevant simplement le mot clé diff à la précédente instruction
- Consulter la liste des releases helm installées

> Le déploiement est passé en révision 2, l'application est accéssible sur http://localhost:8081

## Exercice 4

- Changer le path de l'ingress pour `/nginx` et redéployer
- Vérifier que l'application est disponible sur http://localhost:8081/nginx

> Notre application est maintenant dans la révision 3 ou plus.

Il est possible de revenir en arriere sur un déploiement pour revenir à une révision précédente.
Par défaut l'instruction rollback permet de revenir en arrière d'une revision.
Il est aussi possible de revenir à une revision précise.

- Executer la commande suivante

```shell
helm rollback marelease 2
```

> Notre application est à nouveau accessible sur http://localhost:8081/

- Executer la commande suivante pour consulter l'historique de notre release

```shell
helm history marelease
```
