# Prérequis

## Installation des outils

Ce workshop peut être réalisé sur Windows 10 ou linux pour chaque commande si nécessaire il y aura les versions dans un paragraphe à dérouler.

Pour réaliser ce worshop vous devez avoir [docker](https://www.docker.com/products/docker-desktop) installé sur votre machine et être l'admin de votre poste de travail.

- Installer l'outil [lens](https://k8slens.dev) pour visualiser les ressources d'un cluster
- Installer les utilitaires ci-dessous en fonction de votre système d'exploitation

<details>
<summary>Windows</summary>

- Installer [Chocolatey](https://chocolatey.org/install) pour pouvoir installer les outils dont vous aurez besoin plus tard dans le workshop

Télécharger les deux binaires kubenswin et kubectxwin aux urls suivantes :

- [kubenswin](https://github.com/thomasliddledba/kubenswin/blob/master/bin/kubenswin.exe)
- [kubectxwin](https://github.com/thomasliddledba/kubectxwin/blob/master/bin/kubectxwin.exe)

Créer un répertoire pour ces deux binaires et ajouter ce répertoire à votre PATH
(Click droit "Ce PC" dans l'explorateur de fichiers -\> Propriétés -\> Paramètres système avancés -\> Variables d'environnement -\> Path)

</details>

<details>
<summary>Linux</summary>

- Installer kubectx et kubens [lien](https://github.com/ahmetb/kubectx)

</details>

## Yaml

Pour déclarer des ressources dans un cluster kubernetes on utilise généralement le format yaml, pour rappel:

- Les données sont présentées de manière hiérarchique par leur indentation, l'ordre au sein d'un même niveau de hiérarchie n'a pas d'incidence.
- La premiere indentation de X espaces ou X tabulations permet de définir la hiérarchie du document et les prochaines indentations devront être un multiple de ce nombre d'espaces.
- Il est possible de renseigner plusieurs documents yaml au sein d'un même fichier en utilisant un séparateur '---'
- Les tableaux peuvent être représentés par des [] ou un '-' avec un retour à la ligne

### Exemple

```yaml
---
receipt: Oz-Ware Purchase Invoice
date: 2012-08-06
customer:
    given: Dorothy
    family: Gale

items:
    - part_no: A4786
      descrip: Water Bucket (Filled)
      price: 1.47
      quantity: 4
```
