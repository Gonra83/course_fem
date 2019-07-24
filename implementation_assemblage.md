+++
title = "Assemblage des Matrices"

date = 2018-09-09T00:00:00
# lastmod = 2018-09-09T00:00:00

draft = false  # Is this a draft? true/false
toc = true  # Show table of contents? true/false
type = "docs"  # Do not modify.

math = true

[git]
  icon = "github"
  repo = "https://github.com/Bertbk/course_fem"
  submodule_dir = "content/course/fem/"


# Add menu entry to sidebar.
[menu.fem]
  parent = "menu_mise_en_oeuvre"
  name = "Assemblage des Matrices"
  weight = 20

+++
$\newcommand{\Cb}{\mathbb{C}}$
$\newcommand{\Nb}{\mathbb{N}}$
$\newcommand{\Pb}{\mathbb{P}}$
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
$\newcommand{\ee}{\mathbf{e}}$
$\newcommand{\nn}{\mathbf{n}}$
$\newcommand{\ssb}{\mathbf{s}}$
$\newcommand{\xx}{\mathbf{x}}$
$\newcommand{\yy}{\mathbf{y}}$
$\newcommand{\zz}{\mathbf{z}}$
$\newcommand{\Ccal}{\mathcal{C}}$
$\newcommand{\Cscr}{\mathscr{C}}$
$\newcommand{\Sscr}{\mathscr{S}}$
$\newcommand{\Tscr}{\mathscr{T}}$
$\newcommand{\omegai}{\omega\_i}$
$\newcommand{\dsp}{\displaystyle}$
$\newcommand{\diff}{{\rm d}}$
$\newcommand{\conj}[1]{\overline{#1}}$
$\newcommand{\dn}{\partial_\nn}$
$\newcommand{\supp}{\mathrm{supp}}$
$\newcommand{\restrict}{\mathclose{}|\mathopen{}}$
$\newcommand{\enstq}[2]{\left\\{#1 \mathrel{}\middle|\mathrel{}#2\right\\}}$
$\newcommand{\Image}{\mathrm{Im}}$
$\newcommand{\Ker}{\mathrm{Ker}}$
$\newcommand{\dxi}{\partial\_{x\_i}}$
$\newcommand{\di}{\partial\_{i}}$
$\newcommand{\dj}{\partial\_{j}}$
$\newcommand{\dxj}{\partial x\_{j}}$
$\newcommand{\Ho}{H^1(\Omega)}$
$\newcommand{\Lo}{L^2(\Omega)}$
$\newcommand{\Cinfc}{\Cscr^{\infty}\_c}$
$\newcommand{\CinfcO}{\Cinfc(\Omega)}$
$\newcommand{\hme}[1]{#1_h}$
$\newcommand{\vh}{v\_h}$
$\newcommand{\Vh}{V\_h}$
$\newcommand{\uh}{u\_h}$
$\newcommand{\Nh}{N\_h}$
$\newcommand{\ui}{u\_i}$
$\newcommand{\uj}{u\_j}$
$\newcommand{\UI}{U\_I}$
$\newcommand{\UJ}{U\_J}$
$\newcommand{\AIJ}{A\_{I,J}}$
$\newcommand{\BI}{B\_I}$
$\newcommand{\Sscrh}{\hme{\Sscr}}$
$\newcommand{\deltaij}{\delta\_{i,j}}$
$\newcommand{\Pun}{\Pb\_1}$
$\newcommand{\Punw}{\Pun(\omega)}$
$\newcommand{\grandO}[1]{O\left(#1\right)}$
$\newcommand{\sumit}[1]{\ssb\_{#1}}$
$\newcommand{\sumitK}[2]{\ssb\_{#2}^{#1}}$
$\newcommand{\tri}[1]{K\_{#1}}$
$\newcommand{\loctoglob}{\mathrm{Loc2Glob}}$
$\newcommand{\aK}[1]{a\_{#1}}$
$\newcommand{\Ns}{N\_s}$
$\newcommand{\Nt}{N\_t}$
$\newcommand{\mphi}[1]{\varphi\_{#1}}$
$\newcommand{\mphiK}[2]{\mphi{#2}^{#1}}$

## Système Linéaire

En appliquant la méthode de Galerkin sur la base $(\mphi{J})\_{1\leq J \leq N_h}$, nous obtenons le système linéaire des éléments finis $\Pun$-Lagrange :
$$
AU = B,
$$
avec $A = (\AIJ)$, $B= (\BI)$ et $U = (\UI)$ définis par (dans notre cas)
$$
\left\\{
  \begin{array}{l}
    \dsp  \AIJ = a(\mphi{J}, \mphi{I}) = \int\_{\Omega}\nabla \mphi{J}(x) \cdot\overline{\nabla \mphi{I}(x)}\diff x +\int\_{\Omega}\mphi{J}(x) \overline{\mphi{I}(x)}\diff x,\\\\\\
   \dsp  \BI = \ell(\mphi{I}) = \int\_{\Omega} f(x)\overline{\mphi{I}(x)}\diff x,\\\\\\
  \dsp \UI = u_h(\sumit{I}).
  \end{array}
\right.
$$
Chaque intégrale sur $\Omega$ peut être décomposée comme une somme sur les triangles $\tri{p}$ de $\hme{\Tscr}$: 
$$
\left\\{ 
  \begin{array}{l}
    \dsp \AIJ = \sum\_{p=1}^{\Nt}\left(\int\_{\tri{p}}\nabla \mphi{J}(x) \cdot\overline{\nabla \mphi{I}(x)}\diff x +\int\_{\tri{p}}\mphi{J}(x) \overline{\mphi{I}(x)}\diff x\right)\\\\\\
    \dsp \BI = \sum\_{p=1}^{\Nt}\int\_{\tri{p}}f(x)\overline{\mphi{I}(x)}\diff x.
  \end{array}
\right.
$$

Nous pouvons remarquer que la matrice $A$ est **creuse**, c'est-à-dire qu'un nombre important de ses coefficients sont nuls. En effet, si les sommets $\sumit{I}$ et $\sumit{J}$ ne sont pas les sommets d'un même triangle, alors $\AIJ = 0$ puisque $\supp(\mphi{I})\cap\supp(\mphi{J}) =\emptyset$. Un sommet $\sumit{I}$ est, en pratique, connecté à un faible nombre de sommets, par rapport au nombre total de sommets du maillage. En moyenne de manière empirique, un nœud est connecté au maximum à 6 à 8 autres nœuds.

## Calcul des coefficients : approche naïve


Nous devons bien entendu construire cette matrice : calculer chacun de ses coefficients et les stocker. Un algorithme *naïf* mais naturel pour calculer chaque coefficient est de boucler sur les sommets $\sumit{I}$ et $\sumit{J}$ et de remplir la matrice au fur et à mesure, c'est-à-dire de remplir les coefficients $\AIJ$ les uns après les autres. 

```
For every vertices I = 1:N_s
  For every vertices J = 1:N_s
    // Calcul du coefficient A_{I,J}
    A_{I,J} = 0;
    For every triangles K_p
      A_{I,J} += ...
    EndFor
  EndFor
  //Calcul de B_I
  B_I = 0;
  For every triangles K_p
    B_I += ...
  EndFor
EndFor
```
Malheureusement, cet algorithme a un coût en $\grandO{N\_s^2}$ ce qui est trop important pour être utilisable en pratique. De plus, nous ne disposons en général pas de fonction permettant de retrouver, à un sommet donné, les triangles auxquels il appartient.

## Algorithme d'assemblage

Une autre manière de procéder, que l'on appelle **assemblage**, boucle sur les éléments plutôt que sur les sommets, en remarquant que :
$$
a(\mphi{J},\mphi{I}) = \sum\_{p=1}^{\Nt} \aK{p}(\mphi{J},\mphi{I}), \qquad \aK{p}(\mphi{J},\mphi{I}) = \left(\int\_{\tri{p}}\nabla \mphi{J}(x) \cdot\overline{\nabla \mphi{I}(x)}\diff x +\int\_{\tri{p}}\mphi{J}(x) \overline{\mphi{I}(x)}\diff x\right).
$$
Ensuite, nous réécrivons la matrice $A$ sous la forme suivante
$$
A = \sum\_{i=1}^{N_h}\sum\_{j=1}^{N_h}a(\mphi{J},\mphi{I}) \ee\_I^T\ee\_J,
$$
où $\ee\_J$ est le vecteur de la base canonique de $\Rb^{\Ns}$. Nous avons alors
$$
\begin{array}{r l}
  A &= \dsp \sum\_{I=1}^{\Ns}\sum\_{J=1}^{\Ns}a(\mphi{J},\mphi{I}) \ee\_I^T\ee\_J\\\\\\
    &= \dsp \sum\_{I=1}^{\Ns}\sum\_{J=1}^{\Ns}\sum\_{p=1}^{\Nt}\aK{p}(\mphi{J},\mphi{I}) \ee\_I^T\ee\_J\\\\\\
    &= \dsp \sum\_{p=1}^{\Nt}\sum\_{I=1}^{\Ns}\sum\_{J=1}^{\Ns}\aK{p}(\mphi{J},\mphi{I}) \ee\_I^T\ee\_J
\end{array}
$$

Nous remarquons maintenant que $\aK{p}(\mphi{J},\mphi{I})$ est nul dès lors que $\sumit{I}$ ou $\sumit{J}$ n'est pas un sommet de $\tri{p}$. Finalement, la somme sur tous les sommets du maillage se réduit alors à une somme sur les sommets de $\tri{p}$ uniquement, notés $\\{\sumitK{p}{1}, \sumitK{p}{2}, \sumitK{p}{3}\\}$.

$$
\begin{array}{r c l}
  A   &=& \dsp \sum\_{p=1}^{\Nt}\sum\_{i=1}^{3}\sum\_{j=1}^{3}\aK{p}(\mphiK{p}{j},\mphiK{p}{i}) \ee\_{I\_{p,i}}^T\ee\_{I\_{p,j}}\\\\\\
&=& \dsp \sum\_{p=1}^{\Nt}\sum\_{i=1}^{3}\sum\_{j=1}^{3}\aK{p}(\mphi{I\_{p,j}},\mphi{I\_{p,i}}) \ee\_{I\_{p,i}}^T\ee\_{I\_{p,j}}
\end{array}
$$

Pour chaque élément (=triangle) du maillage, nous effectuons 9 opérations : l'assemblage est de complexité linéaire par rapport au nombre d'éléments, ce qui est bien moindre que $\Ns^2$.



```
A = 0; // Matrice nulle
B = 0; // Vecteur nul
For p = 1:N_triangles
  For i=1:3 //3 = N_s
    I = Loc2Glob(p, i)$ // Indice globale du i-ème sommet dans la matrice
    For j=1:3 //3 = N_s
      J = Loc2Glob(p, j)$ // Indice globale de j-ème sommet dans la matrice
      A(I,J) += a_{p}(phi_J, phi_I) // forme a(.,.) restreinte au triangle K_p
    EndFor
  B_I += l_{p}(phi_I)$ // forme l(.) restreinte au triangle K_p
  EndFor
EndFor
```

{{% alert note %}}
Pour utiliser une telle méthode, nous avons besoin de :

1. La connectivité des éléments et en particulier, pour un triangle donné, connaître ses 3 sommets
2. La fonction que nous avons appelée $\loctoglob$

Ce sont précisément les données que nous fournissent le fichier de maillage (quel hasard) !
{{% /alert %}}

{{% alert note%}}
En réalité, les boucles sur les sommets locaux, c'est-à-dire les boucles sur $i$ et $j$, ne varient pas de 1 à 3, mais de 1 au nombre de sommets $N^p\_s$ de l'élément. En effet, un élément peut être par exemple un segment, avec uniquement 2 sommets ou un tétraèdres, avec 4 sommets.
{{% /alert%}}

{{% alert warning %}}
Cet algorithme est pour l'instant encore inutilisable :
  
- Les quantités $\aK{p}(\mphi{J}, \mphi{I})$ ne sont pas déterminées analytiquement : nous verrons plus tard comment les approcher efficacement à l'aide de formules de quadrature.
- L'écriture de l'algorithme suppose que la matrice est dense, au sens où elle possède une valeur pour chaque indice $(I,J)$. Nous devons donc adapter cette écriture pour le cas d'une matrice creuse (diminution du coût mémoire).
- Il manque toujours et bien entendu les (éventuelles) conditions de Dirichlet.
{{% /alert %}}
