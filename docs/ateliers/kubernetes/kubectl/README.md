# Kubectl

kubectl est un client qui permet d'interragir avec l'pai d'un cluster kubernetes.

C'est la commande que l'on va le plus utiliser dans la suite des ateliers et au quotidien, par comodité créer un alias pour kubectl (k)

```shell
Set-Alias k kubectl
```

kubectl s'utilise de la facon suivante: kubectl _verbe_ _ressource_ _options_

```shell
kubectl api-resources #liste toutes les resources gérées par l'api
kubectl get pods # Liste les pods dans le namespace courant
kubectl get pods -A # Liste tous les pods du cluster
```

## Exercice 1

Lister les nodes du clusters:

<details>
<summary>Solution</summary>

```shell
k get nodes
```

</details>

Pour la commande get il est possible d'avoir plus d'informations en utilisant _-o wide_.
Par défaut kubectl présente les informations dans un tableau qui est défini par la ressource, pour avoir vraiment toutes les informations sur une ressource il faut passer au format yaml ou json.

- Lister toutes les informations sur les nodes du clusters au format yaml
- Lister toutes les informations d'une des nodes

> noter que le résultat est une ressource ayant un champ items qui contient les ressources nodes

<details>
<summary>Solution</summary>

```shell
k get nodes -o yaml
k get nodes k3d-workshop-server-0 -o yaml
```

</details>

- Lister uniquement les informations des nodes étant _master_

> utiliser --help et le résultat de la commande précédente

<details>
<summary>Solution</summary>

```shell
k get nodes -l node-role.kubernetes.io/master=true
```

</details>

## Exercice 2

- Observer d'autres ressources comme _events_ qui sont les évenements déclenchés au sein du cluster
- Trouver un moyen de trier les evennements par ordre de déclenchement du plus ancien au plus récent

> utiliser --help et le resultat des informations d'un évenement au format yaml

<details>
<summary>Solution</summary>

```shell
k get events
k get events -o yaml
k get events --sort-by='{.lastTimestamp}'
```

</details>

## Exercice 3

- Réaliser les mêmes consultations avec _Lens_
