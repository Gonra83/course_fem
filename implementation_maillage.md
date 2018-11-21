+++
title = "Gestion du Maillage"

date = 2018-09-09T00:00:00
# lastmod = 2018-09-09T00:00:00

draft = false  # Is this a draft? true/false
toc = true  # Show table of contents? true/false
type = "docs"  # Do not modify.

math = true

[git]
  icon = "github"
  repo = "https://github.com/Bertbk/course_fem"
  issue = "https://github.com/Bertbk/course_fem/issues"
  prose = "https://prose.io/#Bertbk/course_fem/edit/master/"


# Add menu entry to sidebar.
[menu.fem]
  parent = "menu_mise_en_oeuvre"
  name = "Gestion du Maillage"
  weight = 10

+++
$\newcommand{\Cb}{\mathbb{C}}$
$\newcommand{\Nb}{\mathbb{N}}$
$\newcommand{\Rb}{\mathbb{R}}$
$\newcommand{\PS}[2]{\left(#1,#2\right)}$
$\newcommand{\PSV}[2]{\PS{#1}{#2}\_V}$
$\newcommand{\PSL}[2]{\PS{#1}{#2}\_{L^2(\Omega)}}$
$\newcommand{\PSH}[2]{\PS{#1}{#2}\_{H^1(\Omega)}}$
$\newcommand{\norm}[1]{\left\\|#1\right\\|}$
$\newcommand{\normV}[1]{\left\\|#1\right\\|\_{V}}$
$\newcommand{\normH}[1]{\left\\|#1\right\\|\_{H^1(\Omega)}}$
$\newcommand{\normL}[1]{\left\\|#1\right\\|\_{L^2(\Omega)}}$
$\newcommand{\abs}[1]{\left|#1\right|}$
$\newcommand{\xx}{\mathbf{x}}$
$\newcommand{\yy}{\mathbf{y}}$
$\newcommand{\zz}{\mathbf{z}}$
$\newcommand{\nn}{\mathbf{n}}$
$\newcommand{\Ccal}{\mathcal{C}}$
$\newcommand{\Cscr}{\mathscr{C}}$
$\newcommand{\omegai}{\omega\_i}$
$\newcommand{\dsp}{\displaystyle}$
$\newcommand{\diff}{{\rm d}}$
$\newcommand{\conj}[1]{\overline{#1}}$
$\newcommand{\dn}{\partial_\nn}$
$\newcommand{\supp}{\mathrm{supp}}$
$\newcommand{\enstq}[2]{\left\\{#1 \mathrel{}\middle|\mathrel{}#2\right\\}}$
$\newcommand{\Image}{\mathrm{Im}}$
$\newcommand{\Ker}{\mathrm{Ker}}$
$\newcommand{\dxi}{\partial\_{x\_i}}$
$\newcommand{\di}{\partial\_{i}}$
$\newcommand{\dj}{\partial\_{j}}$
$\newcommand{\Ho}{H^1(\Omega)}$
$\newcommand{\Lo}{L^2(\Omega)}$
$\newcommand{\ssb}{\mathbf{s}}$
$\newcommand{\Ns}{N\_s}$
$\newcommand{\Nt}{N\_t}$
$\newcommand{\Ne}{N\_e}$
$\newcommand{\sumit}[1]{\ssb\_{#1}}$
$\newcommand{\sumitK}[2]{\ssb\_{#2}^{#1}}$
$\newcommand{\tri}[1]{K\_{#1}}$
$\newcommand{\loctoglob}{\mathrm{Loc2Glob}}$
$\newcommand{\mphi}[1]{\varphi\_{#1}}$
$\newcommand{\mphiK}[2]{\mphi{#2}^{#1}}$


Le maillage du domaine est une étape que nous ne détaillerons pas (ou alors plus tard). Sachons cependant que cette étape est à la fois compliquée, du point de vue mathématiques et algorithmique, et très coûteuse, surtout en 3D ! Pour des géométries complexes, le temps de création du maillage peut dépasser celui de la résolution du système linéaire. Nous utiliserons le logiciel libre [GMSH](https://GMSH.info) et un [tutoriel]({{< ref "course/gmsh">}}) pour mailler et dessiner les domaines.


{{% alert note %}}
Nous nous restreignons ici au cas d'éléments triangulaires à 3 sommets. Cependant, tout est adapatable (et à adapter !) en fonction de la géométrie de l'élément : segment, triangle (à plus que 3 points), quadrangle, prisme, ... Mais aussi en fonction du nombre de l'ordre de l'élément.
{{% /alert %}}

## Triangles

### Numérotation

Les $\Nt$ triangles du maillage seront numérotés de 1 à $\Nt$ : $\tri{1}, \tri{2}, \ldots, \tri{\Nt}$. Pour un triangle de numéro arbitraire, nous tâcherons de toujours utiliser les indices $p$ et $q$, pour $p,q=1,\ldots,\Nt$ : $\tri{p}$ et $\tri{q}$.

### Orientation

Pour un triangle d'un maillage de sommets $\ssb\_I, \ssb\_J, \ssb\_K$, deux orientations sont possibles (le choix du premier sommet n'ayant aucune incidence sur l'orientation) :  $K = [\ssb\_I, \ssb\_J, \ssb\_K]$ ou $K' = [\ssb\_I, \ssb\_K, \ssb\_J]$. Le vecteur normale unitaire sortante au triangle $K$ est alors opposé à $K'$. Il est donc important que chaque triangle d'une même surface soit orienté dans le même sens ! 

{{< figure library="1" src="course/fem/orientation.svg" title="Orientation d'un triangle" numbered="true" >}}

## Numérotation des sommets

### Globale

Les $\Ns$ sommets $\sumit{I}$ d'un maillage seront numérotés de 1 à $\Ns$ : $\sumit{1}, \sumit{2}, \ldots, \sumit{\Ns}$. Lorsque le numéro est arbitraire, nous utiliserons une lettre majuscule, par exemple $I$ ou $J$, avec $I,J = 1,2,3,\ldots, \Ns$.

### Locale

Chaque sommet appartient à au moins un triangle et possède alors une numérotation **locale** dans ce triangle, c'est-à-dire 1, 2 ou 3. Pour ne pas confondre avec la numérotation globale, nous indiquerons le numéro du triangle, par exempel $\sumitK{p}{i}$ et le $i^{ème}$ sommets du triangle $\tri{p}$. Dit autrement, le triangle $\tri{p}$ a pour sommets $\sumitK{p}{1}, \sumitK{p}{2}, \sumitK{p}{3}$.

### Locale vers Globale

Pour un triangle $\tri{p} = [\sumitK{p}{1}, \sumitK{p}{2}, \sumitK{p}{3}]$ donné, nous aurons besoin de passer de la numérotation locale d'un de ses sommets à sa numérotation globale. Pour cela, nous introduisons une fonction `Loc2Glob` définie formellement ainsi :
$$
\begin{array}{l}
  \forall p=1\,\ldots,\Nt, \forall i = 1, 2, 3, \\\\\\
  \loctoglob(i,p) = I \iff \sumitK{p}{i} = \sumit{I}.
\end{array}
$$

Pour simplifier, nous noterons parfois de manière plus compacte :
$$
I(p,i) = I\_{p,i} = \loctoglob(p,i),\quad\text{ ou encore}\quad
J(q,j) = J\_{q,j} = \loctoglob(q,j)
$$


{{< figure library="1" src="course/fem/loc2glob.svg" title="Numérotation globale (gauche) et numérotation locale (droite) des sommets d'un triangle particulier." numbered="true" >}}


## Numérotation des fonctions de forme

Pour un sommet $\sumit{I}$, nous continuons de noter $\mphi{I}$ la fonction de forme associée à ce sommet. Cependant et sachant que ce même sommet $\sumit{I}$ dispose d'une numérotation locale $i$ dans un triangle $\tri{p}$, c'est-à-dire $\sumitK{p}{i} = \sumit{I}$, nous noterons également :
$$
\mphiK{p}{i} = \mphi{I} = \mphi{I\_{p,i}} = \mphi{I(p,i)}= \mphi{\loctoglob(p,i)}.
$$

## Structure d'un fichier

### Cas général

En général, un fichier de maillage contient plusieurs informations :

1. Le **numéro globale** et les **coordonnées** des sommets
2. La **connectivité** des éléménts

Il ne faut pas oublier que le bord du domaine, $\partial\Omega$, est lui aussi maillé par des éléments de type segment. Notons qu'un fichier de maillage est souvent écrit en ASCII et non en binaire. 


### Cas de `GMSH`

{{% alert warning %}}
Nous nous restreignons ici au format de fichier v2 et non v4 (plus récent).
{{% /alert %}}

Pour `GMSH`, les fichiers de maillage ont la structure du tableau ci-dessous ($\Ns=$nombre de sommets, $\Ne=$nombre d'éléments). Le type d'éléments est un entier, 1 pour un élément segment et 2 pour un élément triangulaire. Par exemple, pour un triangle numéro 10 reliant les points 100, 101 et 102 et disposant deux tags 3 et 4, cela donne

| Indice | Type | N. tags |tag 1 | tag 2 | Noeud 1 | Noeud 2 | Noeud 3 |
| --- | --- | --- |---|--- | ---| ---| --- |
|  10 |2 |2| 3 | 4 | 100 | 101 | 102|

Dans `GMSH`, les `Tags` sont par défaut au nombre de 2, le premier étant le `Physical`, défini par l'utilisateur, et le deuxième le numéro de partition, utile notamment pour la méthode de décomposition de domaines, mais cela dépasse le cadre de notre cours. Le numéro `Physical` permet de faire le lien avec le solveur éléments finis, qui ne dispose plus de la géométrie mais uniquement du maillage : ce numéro permet alors de savoir à quel portion géométrique l'élement considéré appartient (*e.g* : l'élément triangulaire 200 est un élément de $\Omega\_1$ tandis que l'élément 432 appartient à $\Omega\_2$).

TODO: image avec deux domaines et des numéros physical

Le format de fichier de `GMSH` (`.msh`) suit la forme suivante (dans sa version 2). La partie entre `$MeshFormat` et `$EndMeshFormat` permet à `GMSH` de connaître la version en cours d'utilisation. Le nombre de noeuds est `N_s` et le nombre d'éléments `N_e`. Un élément peut être un triangle, bien entendu, mais aussi un segment, un quadrangle, un tétraèdre, ...

```
$MeshFormat
2.2 0 8
$EndMeshFormat
$Nodes
N_s
1 x_1 y_1 z_1
2 x_2 y_2 z_2
3 x_3 y_3 z_3
... ... ... ...
i x_i y_i z_i
... ... ... ...
Ns x_{N_s} y_{N_s} z_{N_s}
$EndNodes
$Elements
N_e
... ... ... ...
i Type n_tags tag_1 tag_2 ... tag_{n_tags} I_{i,1} I_{i,2} ... I_{i,N}
... ... ... ...
$EndElements
```

### Exemple de maillages

TODO: image sous marin + fichier
