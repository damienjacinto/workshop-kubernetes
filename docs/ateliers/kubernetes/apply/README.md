# Appliquer des changements

Par défaut kubernetes est installé sans interface graphique, il existe cependant une interface officielle.
Nous allons profiter de cet atelier pour l'installler et voir une manière d'installer des ressources dans un cluster.

Consulter la page [dashboard](https://raw.githubusercontent.com/kubernetes/dashboard/master/aio/deploy/recommended.yaml)
Ce fichier yaml contient toutes les ressources nécessaires pour réaliser le déploiement du dashboard.

Il contient de manière non exaustive:

- création d'un namespace kubernetes-dashboard
- création d'un service pour exposer le dashboard
- création d'un compte kubernetes-dashboard
- création d'un role et cluster role ainsi que les binding associés
- création du déploiement qui va deployer les container du dashboard

Pour appliquer ces changements:

```shell
k apply -f https://raw.githubusercontent.com/kubernetes/dashboard/master/aio/deploy/recommended.yaml
```

## Exercice 1

> Si vous utilisez chrome pour l'atelier activer les certificats auto-signé sur localhost
> taper _chrome://flags/#allow-insecure-localhost_ dans l'url et activer l'option.

- Se placer dans le namespace du dashboard et consulter les pods déployés, noter les ports utilisés avec _k describe po_
- Consulter le service du dashboard (kubernetes-dashboard) les cibles et les ports utilisés (noter comment le service sélectionne les pod qui vont recevoir le flux)
- Utiliser la commande _k port-forward_ pour bind un port local de votre machine au port du service dashboard
- Comparer le retour de la commande et la ligne commande saisie en s'appuyant sur le describe fait précédement
- Consulter l'url https://localhost en précisant le port local utilisé dans le port-forward

<details>
<summary>Solution</summary>

```shell
k config set-context --current --namespace=kubernetes-dashboard
k get po
k describe po kubernetes-dashboard-xxxxx
k get svc
k describe svc kubernetes-dashboard
k port-forward svc/kubernetes-dashboard 9000:443
```

> Le pod kubernetes-dashboard a un label _k8s-app=kubernetes-dashboard_.
>
> Le service dashboard cible les pods avec le label kubernetes-dashboard _Selector: k8s-app=kubernetes-dashboard_.
>
> Le service est une interface virtuelle, quand on port-forward dans un service on réalise en fait un port-forward dans les pods qui sont en cible du service donc le port présenté dans les logs est le port du pod.

</details>

## Exercice 2

Pour se connecter au dashboard kubernetes il faut renseigner un token d'un utilisateur autorisé à utiliser le dashboard.
Nous allons dans cet exercice créer un user avec une autre methode de modification de ressource kubernetes.

- Créer un user technique (serviceaccount) 'dashboard-admin' dans le namespace kubernetes-dashboard en utilisant _k create sa_
- Lister les roles existants au niveau cluster (clusterrole). Kubernetes propose déjà des rôles, consulter notamment le cluster rôle 'admin' au format yaml
- Créer un clusterrolebinding en précisant uniquement le rôle 'admin' _k create clusterrolebinding_
- Consulter au format yaml le clusterrolebinding créé précédement
- Utiliser la commande _k explain_ pour comprendre les champs disponibles sur une ressource clusterrolebinding et notammment comprendre comment modifier notre ressource pour ajouter le rôle 'kubernetes-dashboard' uniquement à notre user 'dashboard-admin'
- Editer le clusterrolebinding avec la commande _k edit clusterrolebinding_, cela va permettre de définir ce que peut voir notre user dans le dashboard, c'est à dire tout car il sera admin.

<details>
<summary>Solution</summary>

```shell
k create sa dashboard-admin
k get clusterrole
k get clusterrole kubernetes-dashboard -o yaml
k create clusterrolebinding dashboard-admin --clusterrole=admin
k get clusterrolebinding dashboard-admin -o yaml
k edit clusterrolebinding dashboard-admin
---
# Please edit the object below. Lines beginning with a '#' will be ignored,
# and an empty file will abort the edit. If an error occurs while saving this file will be
# reopened with the relevant failures.
#
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  creationTimestamp: "2021-01-20T14:37:52Z"
  name: dashboard-admin
  resourceVersion: "14355"
  selfLink: /apis/rbac.authorization.k8s.io/v1/clusterrolebindings/dashboard-admin
  uid: 0a59e908-6131-42cf-9739-d2768191019f
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: admin
subjects:
- kind: ServiceAccount
  name: dashboard-admin
  namespace: kubernetes-dashboard
---
```

</details>

## Exercice 3

Lors de la création d'un ServiceAccount kubernetes lui associe un secret et notamment un token qui va nous servir pour à nous connecter au dashboard

- Consulter le ServiceAccount créé dans les exercices précédents pour trouver le nom du secret
- Consulter le secret au format yaml pour récupérer le token
- Dechiffrer le token qui est en base64
- Se connecter sur le dashboard kubernetes avec le token grâce au port-forward

## Aller plus loin

Dans l'exercice précédent on a associé à notre user un rôle au niveau cluster (clusterolebinding) qui lui donne tous les droits. Quel sera le résultat dans le dashboard si on associe simplement un role (rolebinding) qui est limité par définition à un namespace ?

- Supprimer le role créé dans l'exercice 3 (k delete clusterrolebinding dashboard-admin)
- Créer un rolebinding en utilisant le clusterrole admin et le même user dashboard-admin
- Consulter le namespace kubernetes-dashboard dans le dahsboard, consulter le namespace kube-system.

<details>
<summary>Solution</summary>

Dans une application dite 'cloud native', on va s'appuyer sur la gestion des droits dans kubernetes pour gérer les droits au niveau de l'application.
En donnant des droits limités au namespace à l'utilisateur par l'intermédiaire d'un rolebinding qui est une ressource par namespace, l'utilisateur ne verra que les ressources du namespace pour lequel le role lui a été affecté.
On pourra aller encore plus finement dans les droits en créant un role spécifiquement pour l'utilisateur et autorisant uniquement certaines ressources.

</details>
