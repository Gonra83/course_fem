+++
title = "1. Grandes Étapes"

date = 2018-09-09T00:00:00
# lastmod = 2018-09-09T00:00:00

draft = false  # Is this a draft? true/false
toc = true  # Show table of contents? true/false
type = "docs"  # Do not modify.

math = true
weight = 100
diagram = false
#markup = "mmark"

edit_page = {repo_url = "https://github.com/Bertbk/course_fem", repo_branch = "master", submodule_dir="content/course/fem/"}

[git]
  icon = "github"
  repo = "https://github.com/Bertbk/course_fem"
  submodule_dir = "content/course/fem/"


# Add menu entry to sidebar.
[menu.fem]
  parent = "IV. Mise en Œuvre de la Méthode des Éléments Finis"
  name = "1. Grandes Étapes"
  weight = 5

+++

L'implémentation de la méthode des éléments finis peut se décomposer en 6 grandes étapes. Notez que chacune de ces étapes est un *métier* en soit ou en tout cas, requiert des compétences qui lui sont propres.

1. Création de la **géométrie** (CAO)
2. **Maillage** du domaine
3. **Assemblage** des matrices du système linéaire
4. *Éventuellement :* prise en compte des **conditions de Dirichlet**
5. **Résolution** du système linéaire
6. Affichage et **traitement** de la solution

En TP, nous réaliserons des géométries complexes avec [GMSH](https://gmsh.info) et implémenterons l'assemblage des matrices du problème modèle (en Python). L'utilisation de [FreeFem++](https://freefem.org) nous permettra d'assembler et de résoudre des problèmes plus compliqués. La visualisation sera effectuée avec [GMSH](https://gmsh.info).

{{% alert note %}}
Souvent mésestimées, les parties 1 (CAO) et 2 (Maillage) peuvent parfois prendre jusqu'à **70% du temps total de la procédure !** Construire un maillage correct et pertinent pour l'analyse demande un important temps de travail *humain*.
{{% /alert %}}
