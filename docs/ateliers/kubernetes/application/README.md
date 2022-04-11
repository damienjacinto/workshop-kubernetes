# Déployer une application

> Se placer dans le namespace _workshop_ pour réaliser la suite de l'atelier

## Exercice 1

L'unité la plus petite que peut gérer un cluster est le _pod_.

On va dans ce premier exercice déployer un pod avec la commande _k run_.

Le minimum d'informations qu'il faut fournir pour qu'un pod s'execute est un nom et une image docker.

> Par défaut la registry utilisée est le dockerhub, il est possible d'utiliser d'autre registry en préfixant l'image par son url

Executer les commandes suivantes:

```shell
# Pour suivre le cycle de vie du pod hello lancer cette commande dans une autre fenêtre
k get po -w
# Création du pod kubernetes < 1.20
k run --generator=run-pod/v1 --image=nginxdemos/hello hello --restart='Never'
# Création du pod kubernetes > 1.20
k run --image=nginxdemos/hello hello --restart='Never'
```

- Consulter la page nginx en utilisant kubectl et un port-forward entre le port 80 du pod et le port local 9000 (<http://localhost:9000>)

> la commande port-forward peut être initialisée sur un déploiement, un service ou un pod malgré que le bind se fera uniquement sur un pod.

<details>
<summary>Solution</summary>

```shell
k port-forward po/hell 9000:80
```

</details>

## Exercice 2

Il est possible de réaliser les mêmes opérations sur un cluster kubernetes qu'avec un container docker depuis son poste à l'aide de kubectl

- Consulter les logs avec la commande _k logs_
- Obtenir un shell dans le container avec la commande _k exec_

Il est possible de copier des fichiers depuis et vers le container aevc la commande _k cp_.
Pour notre image nginx la configuration du helloworld est dans /etc/nginx/conf.d/hello.conf.

- Récupérer la configuration du helloworld avec la commande _k cp_

> Ces opérations se réalisent au niveau d'un container, si votre pod contient plusieurs container il faudra préciser le container cible en plus du pod (option -c).
> Les contraintes d'utilisation de docker s'appliquent aussi dans le cadre de kubernetes, une modification dans un container sera perdu lors d'une relance d'un pod à moins d'être dans un volume persisté en dehors du container.

<details>
<summary>Solution</summary>

```shell
k logs hello
k exec -it hello -- /bin/sh
k cp hello:/etc/nginx/conf.d/hello.conf .
```

</details>

## Exercice 3

- Lancer la commande _k exec -it hello -- nginx -s stop_ et suivre l'état du pod dans une seconde fenêtre.

> Le conteneur s'arrête et le pod passe dans l'état _completed_

Pour gérer la résiliance des applications il faut utiliser les ressources pour gérer la charge de travail (deployments, statefulsets, ect).

- Supprimer le pod existant avec la commande _k delete_
- Déployer l'application avec la commande _k create deploy --image=nginxdemos/hello hello_
- Consulter les ressources pod, deploiement, replicasets
- Supprimer un pod et observer le cycle de vie des pods du namespace

<details>
<summary>Solution</summary>

```shell
k delete po hello
k create deploy --image=nginxdemos/hello hello
k get po
k get deploy
k get rs
k delete po -l run=hello --wait=false && k get po -w
```

</details>

## Exercice 4

- Utiliser la commande scale pour augmenter le nombre d'instances nginx à 3 _k scale_
- Consulter les pods avec l'option wide pour observer la répartition des pods

<details>
<summary>Solution</summary>

```shell
k scale deployments.apps/hello --replicas=3
k get po -o wide
```

</details>

## Exercice 5

Une bonne pratique dans kubernetes est de définir des labels sur toutes les ressources. _labels_ est un tableau de champs libres qui va nous permettre d'identifier et regrouper des ressources par sélection.
En définissant des labels à différents niveaux on va pouvoir créer des ensembles de ressources.

> Par exemple toutes les ressources de notre application peuvent avoir un label portant le nom de l'application avec la clé _app_, pour pouvoir les sélectionner facilement. On pourrait mettre en plus un label _module_ pour identifier des ressources d'un sous-module de l'application. La valeur et la clé du label sont libres cependant certains labels commencent à former un standard : [labels recommendés](https://kubernetes.io/docs/concepts/overview/working-with-objects/common-labels/)

Il est possible de sélectionner des pods par la valeur d'un champ (k get po -o yaml pour connaître les champs et l'option --field-selector= pour sélectionner avec une valeur). Pour afficher les labels des pods on peut utiliser _k get pods --show-labels_

- Ajouter un label _monapp=hello_ sur les pods qui sont en cours d'execution de notre application avec la commande _k label_ (cf --field-selector)

> Notre modification a été réalisée sur les pods et non sur la ressource _deployment_, notre modification n'est donc pas pérenne. Si un pod est relancé il n'aura pas la modification.

- Vérifier cette affirmation en lancant un renouvellement des pods avec la commande _k rollout restart deployments.apps/hello_

- Modifier la ressource deploiement _hello_ pour ajouter le label _application=hello_ sur les pods avec la commande _k edit_, attention a ne pas confondre le label du deploiement et le label des pods. Observer le cycle de vie des pods.

<details>
<summary>Solution</summary>

```shell
k label pods --field-selector=status.phase=Running monapp=hello
k edit deployement hello
```

</details>

## Exercice 6

Pour activer la répartition de charge au sein de kubernetes, ou loadbalacing entre nos différents pods. Il faut créer une ressource de type _service_. Il est possible de créer un service à partir d'un deploiement avec la commande _k expose_

- Exposer les pods de notre applciation avec la commande _k expose deployment_ en utilisant le label application=hello, le type du service sera ClusterIp et le port d'exposition 80

> Le service lie un port d'exposition au port du pod, souvent le port est le même par commodité mais ce n'est pas obligatoire.
> Il existe plusieurs type de service (ClusterIP, Loadbalancer, NodePort), ClusterIP expose le service à l'interieur du cluster.

<details>
<summary>Solution</summary>

```shell
k expose deployment hello --port=80 --selector=application=hello
```

</details>

## Exercice 7

La derniere pièce manquante de notre déploiement simplifié est l'ingress, cette ressource permet de faire du routage http/tcp du flux entrant dans le cluster vers nos services.
L'ingress s'appuie sur un _Ingress controler_ qui est un element complémentaire, pour configurer un élément qui étend les fonctionnalités de kubernetes on utilise le champ _annotation_. Par opposition aux labels ces champs sont fixes et sont traqués par le controleur en charge de la ressource.

- Créer la ressource Ingress en appliquant un fichier yaml ou directement depuis l'invité de commande

<details>
<summary>Windows</summary>

```yaml
# créer un fichier ingress.yaml contenant:
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: hello
  annotations:
    ingress.kubernetes.io/ssl-redirect: "false"
spec:
  rules:
  - http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: hello
            port:
              number: 80
# appliquer le fichier
k apply -f ingress.yaml
```

</details>

<details>
<summary>Linux</summary>

```yaml
cat <<EOF | kubectl apply -f -
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: hello
  annotations:
    ingress.kubernetes.io/ssl-redirect: "false"
spec:
  rules:
  - http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: hello
            port:
              number: 80
EOF
```

</details>

- Consulter plusieurs fois l'application depuis votre navigateur pour illustrer le round-robin du service, le loadbalancer initialisé lors de la création du cluster k3d expose le port 8081 sur votre machine locale (k3d cluster create workshop -a 1 -p "8081:80@loadbalancer")

> Il est possible suivant l'ingress controler de faire des règles de routing sur le host, le path, un header http, des cookies, ect.
> Il existe aussi une ressource Egress permettant de gérer le flux sortant
>
> Un résumé du flux : localhost port 8081 sur votre poste -> loadbalancer (entrant 80 : sortant 80) -> ingress -> service (entrant 80 : sortant 80) -> pod (entrant 80 : local 80) -> container (port 80)
