---
next: false
---

# Autoscaling

La ressource en charge de gérer le nombre de pods d'une application est le ReplicaSet. Comme vu précédement dans les exercices la commande _scale_ permet de manipuler ce nombre de manière manuelle. Il existe une ressource capable de modifier dynamiquement ce nombre en fonction de métriques comme la mémoire. Cette ressource est le HPA ou HorizontalPodAutoscaler.

## Exercice 1

- Créer un namespace _autoscaling_ et changer de namespace courant
- Créer un deploiement _app_ avec l'image docker _k8s.gcr.io/hpa-example_ sur le port 80
- Exposer un service sur le deploiement _app_

<details>
<summary>Solution</summary>

```shell
k create ns autoscaling
k config set-context --current --namespace=autoscaling
k create deploy app --image=k8s.gcr.io/hpa-example --port=80
k expose deploy app
```

</details>

- Editer le déploiement _app_ pour ajouter les requests et limits en CPU sur le template des pods (Request:200m, Limit:300m). Penser à utiliser la documentation kubernetes ou la commande _k explain deploy.spec.template.spec.containers.resources_

- Au sein du cluster vérifier que le serveur de métrique est déjà présent (pré-installé par k3s)

```shell
k get pods -A | grep metrics-server
```

> Ce service permet d'exposer pour la commande _top_ les métriques de bases (CPU et mémoire) des pods et des nodes

- Consulter les métriques des nodes puis les métriques des pods du namespace courant

<details>
<summary>Solution</summary>

```shell
k top node
k top pod
```

</details>

> [Prometheus](https://github.com/prometheus/prometheus) permet d'étendre le monitoring à d'autres métriques comme par exemple le nombre de requêtes http, le nombre d'éléments dans un système de bus ou queue.

## Exercice 2

- Créer la ressource HPA avec la commande suivante :

```shell
k autoscale deployment app --cpu-percent=50 --min=2 --max=10
```

> Scale de 2 à 10 pods le déploiement en fonction de la consommation cpu, avec comme déclencheur une utilisation du CPU à plus de 50%
>
> Cela nous permet de déléguer la gestion du nombre de réplicas (nombre de pods) de notre application au HPA à la place du deploiement qui est statique

- Consulter le HPA en _watch_ dans un terminal à part pour suivre son évolution

- Consulter les pods et vérifier la présence de 2 pods minimum

> Les métriques sont collectées et exposées en pseudo temps réél, il y a un décallage entre les informations présentées et la réelle consommation.

## Exercice 3

Pour interragir ou tester notre application au sein de notre cluster, la solution la plus courante est de déployer un pod utilitaire comme _busybox_. Les bonnes pratiques de docker nous contraignant à avoir une image applicative la plus légère possible les outils annexes ne pourront pas être dans notre image applicative.

- Lancer un pod avec _k run_ en mode interractif avec l'image docker busybox

<details>
<summary>Solution</summary>

```shell
k run -it busybox --image=busybox /bin/sh
```

</details>

- Solliciter l'application _app_ depuis le pod busybox avec la commande suivante:

```shell
while true; do wget -q -O- http://app.autoscaling.svc.cluster.local; done
```

- Consulter dans une autre fenêtre le hpa et les pods du namespace

> Grace au DNS présent dans le cluster il est possible de contacter un service (in-cluster) par son nom dans le même namespace ou avec l'url sous la forme "http://\<service\>.\<namespace\>.svc.cluster.local". On aurait pu donc utiliser "http://app.autoscaling.svc.cluster.local" ou "http://app".

- Stopper les requêtes depuis le pod de busybox, le HPA va reduire le nombre de pods après plusieurs minutes.
