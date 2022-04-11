# Namespace & Scope

Dans un cluster kubernetes il est possible de faire de l'isolation par namespace qui se traduit par des restrictions d'accès et un nommage unique au sein d'un namespace.
On utilise les namespaces pour isoler certaines applications et certains accès utilisateurs. Ce n'est pas une isolation forte en dehors des droits utilisateurs (isolation réseau s'appuyer sur la ressource NetworkPolicy).

Par défaut une interrogation d'un client ou d'un service au sein d'un cluster se réalise sur le namespace courant (namespace par défaut : default).

## Exercice 1

- Lister les namespaces du cluster (utiliser l'alias de namespaces cf _k api-resources_)
- Créer un namespace workshop
- Se placer dans le namespace créé avec la commande 'k config set-context --current --namespace=workshop'
- lister les pods du namespace courant (option par defaut)
- lister tous les pods du cluster
- lister les pods du namespace _kube-system_ depuis le namespace workshop (utiliser l'option -n)

<details>
<summary>Solution</summary>

```shell
k get ns
k create ns workshop
k config set-context --current --namespace=workshop
k get po
k get po -A
k get po -n kube-system
```

Certaines ressources ont un scope cluster d'autres ressources ont un scope namespace, utiliser _k api-resources_ pour connaître leur scope.

</details>

## Exercice 2

Il existe une commande pour observer une ressource dans une vue qui consolide les informations obtenues avec un get mais aussi des informations d'autres ressources associées à la ressource observée. Utiliser le verbe _describe_ sur la node master.

<details>
<summary>Solution</summary>

```shell
k describe node k3d-workshop-server-0
```

</details>

> On peut observer les informations de la node, les _pods_ qui sont en cours d'execution sur la node, les _events_ en lien avec la node.

## Exercice 3

Pour faciliter les changements de contexte et de namespace il existe des outils kubectx et kubens.

- utiliser kubenswin (Windows) ou kubens (Linux) pour naviguer entre les namespaces _default_, _kube-system_ et _workshop_
- consulter le fichier kubeconfig entre chaque changement et comprendre les changements réalisés par kubenswin (sur windows C:\Users\\<user\>\\.kube\config)

Il existe aussi la commande kubectxwin (Windows) ou kubectx (Linux) pour changer entièrement de contexte (changer de cluster par exemple)

> Toujours vérifier son contexte avant d'appliquer un changement sur un cluster !
> Chaque commande lancée depuis kubectl consulte le fichier kubeconfig pour connaître le contexte à utiliser, il n'y a pas de connexion maintenu avec le cluster.

## Aller plus loin

- Réaliser les mêmes consultations avec _Lens_
