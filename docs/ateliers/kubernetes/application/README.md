# Déployer une application

> Se placer dans le namespace _workshop_ pour réaliser la suite de l'atelier

## Exercice 1

L'unité la plus petite que peut gérer un cluster est le _pod_.

On va dans ce premier exercice déployer un pod avec la commande _k run_.

Le minimum d'informations qu'il faut fournir pour qu'un pod s'execute est un nom et une image docker.

> Par défaut la registry utilisé est le dockerhub, il est possible d'utiliser d'autre registry en préfixant l'image par son url

Executer la commande:

```shell
# pour suivre le cycle de vie du pod hello lancer cette commande dans une autre fenêtre
k get po -w
# Création du pod
k run --generator=run-pod/v1 --image=nginxdemos/hello hello --restart='Never'
```

- Consulter la page nginx en réalisant un port-forward sur le port 80 du pod

## Exercice 2

Il est possible de réaliser les mêmes opérations qu'avec un container docker sur son poste

- Consulter les logs avec la commande _k logs_
- Obtenir un shell dans le container avec la commande _k exec_

Il est possible de copier des fichiers depuis et vers le container aevc la commande _k cp_.
Pour notre image nginx la configuration du helloworld est dans /etc/nginx/conf.d/hello.conf.

- Récupérer la configuration du helloworld avec la commande _k cp_

> Ces opérations se réalisent au niveau d'un container, si votre pod contient plusieurs pod il faudra préciser le container cible en plus du pod (option -c).
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

- Lancer la commande _k exec -it hello -- nginx -s stop_ et consulter le pod

> Le conteneur s'arrête et le pod passe dans l'état _completed_

Pour gérer la résiliance des applications il faut utiliser les ressources pour gérer la charge de travail (deployments, statefulsets, ect).

- Supprimer le pod exsitant avec la commande _k delete_
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

Par exemple toutes les ressources de notre application auront un label avec le nom de l'application avec la clé _app_, pour pouvoir toutes les sélectionner. On peut mettre en plus un label _module_ pour identifier des ressources d'un sous-module de l'application. La valeur et le clé du label ne sont pas imposés.

> Il est possible de sélectionner des pods par la valeur d'un champ (k get po -o yaml pour connaître les champs et l'option --field-selector= pour sélectionner avec une valeur). Pour afficher les labels des pods on peut utiliser _k get pods --show-labels_

- Ajouter un label _monapp=hello_ sur les pods qui sont en cours d'execution de notre application avec la commande _k label_

> Notre modification a été réalisée sur les pods et pas la ressource déploiement, notre modification n'est donc pas pérenne. Si un pod est relancé il n'aura pas la modification.

- Modifier la ressource deploiement _hello_ pour ajouter le label _application=hello_ sur les pods avec la commande _k edit_, attention a ne pas confondre le label du deploiement et le label des pods. Observer le cycle de vie des pods.

<details>
<summary>Solution</summary>

```shell
k label pods --field-selector=status.phase=Running monapp=hello
k edit deployement hello
```

</details>

## Exercice 6

Pour gérer le load-balacing entre nos différents pods il faut créer une ressource _service_. Il est possible de créer un service à partir d'un deploiement avec la commande _k expose_

- Exposer les pods de notre applciation avec la commande _k expose deployment_ en utilisant le label application=hello, le type du service sera ClusterIp et le port d'exposition 80

> Le service lie un port d'exposition au port du pod, souvent le port est le même par commodité mais ce n'est pas obligatoire.
> Il existe plusieurs type de service, ClusterIP expose le service à l'interieur du cluster.

<details>
<summary>Solution</summary>

```shell
k expose deployment hello --port=80 --selector=application=hello
```

</details>

## Exercice 7

La derniere pièce manquante de notre déploiement simplifié est l'ingress, cette ressource permet de faire du routage http du flux entrant dans le cluster vers nos services.
L'ingress s'appuie sur un _Ingress controler_ qui est un element compélmentaire, pour configurer un élément qui étend les fonctionnalités de kubernetes on utilise le champ _annotation_.

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

- Consulter les ingress pour connaître l'ip d'entrée du flux, depuis votre navigateur consulter plusieurs fois l'url pour illustrer le round-robin du service (Sur windows ajouter le port utilisé pour le loadbalancer 8081)

> Il est possible suivant l'ingress controler de faire des règles de routing sur le host, l'ip, un header http, ect.
> Il exsite aussi une ressource Egress permettant de gérer le flux sortant
