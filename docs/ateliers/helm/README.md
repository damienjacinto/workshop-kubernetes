# Helm

Helm est un outil permettant d'installer des ressources dans un cluster kubernetes sous forme de chart (packaging) en gérant du versionning.
Il utilise comme kubectl une ressource kubeconfig pour se connecter à l'api d'un cluster kubernetes.
Helm a beaucoup évolué depuis ces premières versions et l'atelier se focalise sur la version 3 de Helm.

## Préparation

- chocolatey (pour windows) doit être installé, cf [prérequis](../prerequis.md)
- Un cluster kubernetes avec un kubeconfig pour se connecter, cf [atelier kubernetes](../kubernetes/)
- Vous pouvez réutiliser le cluster de l'atelier précédent (k3d cluster start workshop)

- Installer Helm et helm diff

<details>
<summary>Windows</summary>

```shell
# Depuis powershell avec une session admin
choco install kubernetes-helm
# vérifier l'installation (version supérieur à 3.0.0)
helm version
# installer le plugin helm diff
helm plugin install https://github.com/databus23/helm-diff
```

</details>

<details>
<summary>Linux</summary>

```shell
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3
chmod 700 get_helm.sh
./get_helm.sh
# vérifier l'installation (version supérieur à 3.0.0)
helm version
# installer le plugin helm diff
helm plugin install https://github.com/databus23/helm-diff
```

</details>
