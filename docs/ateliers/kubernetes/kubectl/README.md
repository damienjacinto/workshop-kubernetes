# Kubectl

kubectl est un client qui permet d'interragir avec l'api d'un cluster kubernetes.

C'est la commande qui va être le plus utilisée dans la suite de cet atelier mais aussi au quotidien dans votre usage de kubernetes, par commodité ajouter un alias pour kubectl (k)

```shell
# Windows
Set-Alias k kubectl
# Linux
alias k="kubectl"
```

kubectl s'utilise de la facon suivante: kubectl _\<verbe\>_ _\<ressource\>_ _\<options\>_

Exemple de verbes disponibles: get (GET), create (POST), patch (PUT), delete (DELETE)

```shell
kubectl api-resources #liste toutes les ressources gérées par l'api kubernetes
kubectl get all # Présente les ressources principales du namespace courant
kubectl get pods # Liste les pods dans le namespace courant
kubectl get pods -A # Liste tous les pods du cluster
```

Malgré l'aspect ligne de commande, kubectl est très complet, l'helper contient beaucoup d'exemples. Il y a des corrections quand une commande est mal saisie et l'autocomplétion est disponible directement depuis une option.

<details>
<summary>Windows</summary>

```shell
#powershell
kubectl completion powershell >> $PROFILE
```

</details>

<details>
<summary>Linux</summary>

```shell
#bash
echo 'source <(kubectl completion bash)' >>~/.bashrc
#si vous utilisez l'alias k
echo 'complete -F __start_kubectl k' >>~/.bashrc

#zsh
k3d completion zsh > ~/.zsh/completions/_k3d
source .zshrc
```

</details>

## Exercice 1

Lister les nodes du clusters:

<details>
<summary>Solution</summary>

```shell
k get nodes
```

</details>

Pour la commande _get_ il est possible d'avoir plus d'informations en utilisant _-o wide_.
Par défaut kubectl présente les informations dans un tableau qui est défini par la ressource, pour avoir vraiment toutes les informations sur une ressource il faut passer au format yaml ou json.

- Lister toutes les informations sur les nodes du clusters au format yaml

> noter que le résultat est une ressource _items_ ayant un champ qui contient les ressources nodes

- Lister toutes les informations de la node ayant le role master par son nom au format yaml

<details>
<summary>Solution</summary>

```shell
k get nodes -o yaml
k get nodes k3d-workshop-server-0 -o yaml
```

</details>

- Lister uniquement les informations des nodes ayant le rôle _master_ (cf labels)

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

> utiliser --help et le resultat des informations d'un évenement au format yaml pour obtenir le nom d'une propriété pour le tri

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

## Aller plus loin

- Réaliser une intérrogation avec kubectl et l'option verbose (-v=7)
- Utiliser [jq](https://stedolan.github.io/jq/) pour manipuler la sortie de kubectl avec l'option (-o json) pour extraire uniquement le nom des nodes

<details>
<summary>Solution</summary>

```shell
k get no -o json | jq '[.items[] | .metadata.name]'
```

</details>
