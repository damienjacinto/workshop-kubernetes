module.exports = {
  head: [["link", { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }]],
  plugins: {
    sitemap: {
      hostname: "https://atelier-kubernetes.netlify.app",
      exclude: ["/404"],
      dateFormatter: (val) => {
        return new Date().toISOString();
      },
    },
    "vuepress-plugin-zooming": {
      selector: ".md-image",
      delay: 1000,
      options: {
        bgColor: "white",
        zIndex: 10000,
      },
    },
    "@silvanite/markdown-classes": {
      prefix: "md",
      rules: ["image"],
    },
    "vuepress-plugin-code-copy": {
      align: "top",
      staticIcon: false,
      backgroundTransition: true,
    },
  },
  locales: {
    "/": {
      lang: "fr-FR",
      title: "Ateliers Kubernetes",
      description: "Atelier pour découvrir kubernetes",
    },
  },
  themeConfig: {
    editLinkText: "Editer cette page sur Github",
    lastUpdated: "Mis à jour le",
    repo: "damienjacinto/workshop-kubernetes",
    repoLabel: "Contribue !",
    docsRepo: "damienjacinto/workshop-kubernetes",
    docsDir: "docs",
    docsBranch: "main",
    editLinks: true,
    locales: {
      "/": {
        selectText: "Languages",
        label: "Français",
        algolia: {
          apiKey: "852f323ddf7de2b586ba06a76963d00c",
          indexName: "formation",
        },
        nav: [
          { text: "Accueil", link: "/" },
          { text: "Prérequis", link: "/prerequis.md" },
          { text: "Concepts", link: "/concepts.md" },
          { text: "Ateliers", link: "/ateliers/" },
          { text: "Liens", link: "/liens.md" },
        ],
        sidebar: [
          {
            title: "Prérequis",
            path: "/prerequis",
            collapsable: true,
          },
          {
            title: "Concepts",
            path: "/concepts",
            collapsable: true,
          },
          {
            title: "Ateliers",
            collapsable: true,
            sidebarDepth: 0,
            children: [
              {
                title: "Kubernetes",
                path: "/ateliers/kubernetes/",
                collapsable: true,
                sidebarDepth: 0,
                children: [
                  "/ateliers/kubernetes/kubeconfig/",
                  "/ateliers/kubernetes/kubectl/",
                  "/ateliers/kubernetes/namespace/",
                  "/ateliers/kubernetes/apply/",
                  "/ateliers/kubernetes/application/",
                ],
              },
              {
                title: "Helm",
                path: "/ateliers/helm/",
                collapsable: true,
                sidebarDepth: 0,
                children: [
                  "/ateliers/helm/decouverte/",
                  "/ateliers/helm/version/",
                  "/ateliers/helm/umbrella/",
                ],
              },
            ],
          },
        ],
      },
    },
  },
};
