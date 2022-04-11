---
prev: "/ateliers/kubernetes/"
---

# Kubeconfig

Pour communiquer avec le cluster nous allons utiliser le client kubectl. Pour se connecter au cluster kubectl a besoin d'une ressource _kubeconfig_ qui est un fichier yaml qui contient les informations de connexion.

```yaml
apiVersion: v1
kind: Config
current-context: k3d
clusters:
- cluster:
    certificate-authority-data: LS0tLS1CRUdJTiBD....
    server: https://0.0.0.0:36249
  name: k3d
- cluster:
    ....
users:
- name: admin@k3d
  user:
    client-certificate-data: LS0tLS1CR....
    client-key-data: LS0tLS1....
- name: test
    ....
contexts:
- context:
    cluster: k3d
    user: admin@k3d
  name: k3d
- context:
  ....
```

Dans un kubeconfig on retrouve 3 parties:

- cluster: section qui contient les informations pour se connecter à l'api du cluster ainsi que le certificat.
- users: section qui contient les éléments pour identifier l'utilisateur qui se connecte (token, certificat, authentification externe).
- context: section qui assemble un cluster et un user par son identifiant (name), le contexte est lui meme identifié par un nom.

Le nommage des ressources est arbitraire il sert uniquement d'indentifiant pour manipuler les informations et les assembler.
Un fichier _kubeconfig_ peut contenir plusieurs users, plusieurs clusters et donc plusieurs contextes.

## Générer le kubeconfig

k3d permet de générer le kubeconfig pour se connecter au cluster précédement créé

```shell
k3d kubeconfig get workshop
```

_kubectl_ utilise par defaut le kubeconfig dans _%userprofile%/.kube/config_ pour windows, pour linux il se base sur la variable d'environnement _KUBECONFIG_.
Il est possible de merger directement les informations dans notre kubeconfig par défaut

```shell
k3d kubeconfig merge workshop -d
```

## Tester la connexion

```shell
kubectl cluster-info
```

## Lens

Lens est une GUI qui permet de consulter les ressources d'un cluster.
Configurer Lens pour se connecter au cluster avec le kubeconfig qui a été précédement généré.
