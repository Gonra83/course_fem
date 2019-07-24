+++
title = "Espaces de Sobolev"

date = 2018-09-09T00:00:00
# lastmod = 2018-09-09T00:00:00

draft = false  # Is this a draft? true/false
toc = true  # Show table of contents? true/false
type = "docs"  # Do not modify.

math = true
weight = 70
diagram = false
#markup = "mmark"

edit_page = {repo_url = "https://github.com/Bertbk/course_fem", repo_branch = "master", submodule_dir="content/course/fem/"}

[git]
  icon = "github"
  repo = "https://github.com/Bertbk/course_fem"
  submodule_dir = "content/course/fem/"


# Add menu entry to sidebar.
[menu.fem]
  parent = "menu_fv"
  name = "Espaces de Sobolev"
  weight = 50


+++
$\newcommand{\Cb}{\mathbb{C}}$
$\newcommand{\Nb}{\mathbb{N}}$
$\newcommand{\Rb}{\mathbb{R}}$
$\newcommand{\PS}[2]{\left(#1,#2\right)}$
$\newcommand{\PSV}[2]{\PS{#1}{#2}\_V}$
$\newcommand{\PSL}[2]{\PS{#1}{#2}\_{L^2(\Omega)}}$
$\newcommand{\PSH}[2]{\PS{#1}{#2}\_{H^1(\Omega)}}$
$\newcommand{\norm}[1]{\left\\|#1\right\\|}$
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




## Espace L<sup>2</sup>(Ω)

Rappelons que l'espace $L^2(\Omega)$ est l'espace des fonctions de carré mesurable (au sens de Lebesgue). Muni du produit scalaire
$$
\PSL{f}{g} = \int\_{\Omega} f(x)\overline{g(x)}\diff x,
$$
l'espace $L^2(\Omega)$ est un espace de Hilbert, de norme induite :
$$
\normL{f} = \left(\int\_{\Omega} \abs{f(x)}^2\diff x\right)^{\frac{1}{2}}.
$$
Il est important de remarquer qu'une fonction de $L^2(\Omega)$ est définie *presque partout*. Autrement dit, deux fonctions $f$ et $g$ de $L^2(\Omega)$ peuvent être *égales* tout en ayant des valeurs différentes sur un sous-ensemble $\omega$ de $\Omega$, de mesure nulle. Une fonction mesurable est en réalité une *classe de fonctions*.

Rappelons que l'espace $\Cscr^{\infty}_c(\Omega)$ des fonctions $\Cscr^{\infty}$ sur $\Omega$ à support compact dans $\Omega$ est dense dans $L^2(\Omega)$. Ces fonctions (et toutes leurs dérivées) s'annulent sur le bord de $\Omega$. 

{{% thm proposition "Densité dans L2" %}}
L'ensemble $\Cscr^{\infty}_c(\Omega)$ est dense dans $L^2(\Omega)$.
{{% /thm %}}

Autrement dit, pour tout élément $f$ de $L^2(\Omega)$, il existe une suite $(f\_n)\_n$ de fonctions de $\Cscr^{\infty}_c$ qui converge vers $f$ pour la norme de $L^2(\Omega)$. Cette proposition est extrêmement importante : pour démontrer des propriétés de $L^2(\Omega)$, nous utiliserons des propriétés de $\Cscr^{\infty}_c$ et passerons à la limite dans $L^2(\Omega)$, comme par exemple pour le Corollaire suivant
{{% thm corollary %}}
Soit $f$ une fonction de $L^2(\Omega)$ telle que
$$
\forall v \in \Cscr^{\infty}_c(\Omega),\qquad \int\_{\Omega} f(x)\overline{v(x)} \diff x= 0,
$$
alors $f(x)=0$ presque partout dans $\Omega$.
{{% /thm %}}
{{% thm proof %}}
Soit $(f_n)_n$ une suite de $\Cscr^{\infty}_c(\Omega)$ qui converge vers $f$ (Proposition de Densité dans $L^2$). Nous avons alors
$$
0 = \lim\_{n\to \infty}\int\_{\Omega} f(x)\overline{f_n(x)} \diff x= \int\_{\Omega}\abs{f(x)}^2\diff x = \normL{f}^2,
$$
d'où $f$ est nulle "au sens de" $L^2(\Omega)$, c'est-à-dire que $f(x)=0$ presque partout.
{{% /thm %}}

L'espace $L^2(\Omega)$ est un "petit" espace de Hilbert qui contient $\Cscr^1(\Omega)$. Nous nous rapprochons du but... Cependant les fonctions de $L^2(\Omega)$ ne sont pas dérivables ! Elles ne sont donc pas utilisables en pratique dans les formulations faibles. C'est tout l'objet de la section suivante : proposer une nouvelle forme de dérivation *plus faible*, c'est-à-dire ici, qui ne requiert pas de continuité.

## Dérivée faible

{{% thm definition %}}
Une fonction de $L^2(\Omega)$ est dérivable au sens faible par rapport à la direction $x_i$ si et seulement si il existe un élément $g\_i$ de $L^2(\Omega)$ tel que
$$
\forall v \in \Cscr^{\infty}\_c(\Omega),\quad \int\_{\Omega} f(x) \partial\_{x\_i} v(x)\diff x =- \int\_{\Omega} g\_i(x) v(x)\diff x.
$$
Nous notons alors $g\_i = \partial\_{x\_i}f =\partial\_{_i}f$, qui est unique en vertu du Corollaire précédent.
{{% /thm %}}

Nous noterons maintenant $\dxi f \in L^2(\Omega)$ ou $\di f \in L^2(\Omega)$ pour signifier que $f$ est dérivable au sens faible par rapport à $x\_i$. De la même manière, nous pouvons définir le gradient faible :

{{% thm definition%}}
Une fonction $f\in L^2(\Omega)$ admet un gradient faible, noté $\nabla f$, si et seulement si $f$ est dérivable au sens faible par rapport à toutes ses variables, et nous avons alors
$$
\nabla f = \left(\partial\_{x\_1}f, \partial\_{x\_2}f, \ldots, \partial\_{x\_d}f\right)^T.
$$
{{% /thm %}}

Le lien entre *dérivée faible* et *dérivée forte* (ou *classique*) est maintenant présenté :

{{% thm proposition %}}
Soit $u\in\Cscr^1(\Omega)$ tel que son gradient, au sens classique, $\nabla u$ soit dans $\Cscr^0(\overline{\Omega})$, alors $u$ admet un gradient au sens faible $\widetilde{\nabla} u$ et l'on a $\nabla u = \widetilde{\nabla} u$.
{{% /thm %}}

{{% thm proof %}}
Il suffit de montrer ce résultat pour une direction uniquement, c'est-à-dire montrer que $\widetilde{\di}u = \di u$, si $\widetilde{\di}$ est la dérivée partielle au sens faible. Par intégration par partie, nous avons :
$$
\forall v \in \Cscr^{\infty}_c(\Omega), \qquad \int\_{\Omega} \di u(x) \overline{v(x)} \diff x= -\int\_{\Omega} u(x) \overline{\di v(x)}\diff x,
$$
et par définition, nous avons :
$$
\forall v \in \Cscr^{\infty}_c(\Omega), \qquad -\int\_{\Omega} u(x) \overline{\di v(x)} = \int\_{\Omega} \widetilde{\di}u(x) \overline{v(x)}\diff x. 
$$


Nous avons donc
$$
\forall v \in \Cscr^{\infty}_c(\Omega), \qquad \int\_{\Omega} (\di u - \widetilde{\di} u)(x) \overline{v(x)}\diff x = 0,
$$
et nous concluons grâce au Corollaire précédent.
{{% /thm %}}

{{% alert warning %}}
Dans la suite, puisque nous ne travaillerons qu'avec des dérivées partielles faibles, nous **omettrons le tilde**.
{{% /alert %}}

## Espace de Sobolev H<sup>1</sup>(Ω)

Nous disposons maintenant des outils nécessaires pour introduire l'espace de Sobolev $H^1(\Omega)$ des fonctions de carré intégrable et dérivables au sens faible dans chaque direction ($d=2,3$ est la dimension) :
$$
H^1(\Omega) = \enstq{u\in L^2(\Omega)}{\nabla u \in (L^2(\Omega))^d}.
$$
Nous munissons cet espace du produit scalaire suivant (pour $u$ et $v$ dans $\Ho$)
$$
\PSH{u}{v} =
\int\_{\Omega} u(x)\overline{v(x)} \;\diff x +
\int\_{\Omega} \nabla u(x) \cdot \overline{\nabla v(x)} \;\diff x,
$$
et de la norme induite, pour $u\in\Ho$ :
$$
\normH{u} = 
\left(
\int\_{\Omega} |u(x)|^2 \;\diff x +
\int\_{\Omega} |\nabla u(x)|^2\;\diff x 
\right)^{\frac{1}{2}}.
$$

{{% alert note %}}
Nous pouvons montrer que c'est effectivement un produit scalaire avec les arguments similaires à ceux utilisés pour montrer que la "même" application est un produit scalaire sur $\Cscr^1(\Omega)$.
{{% /alert %}}
{{% alert tips %}}
Pour $u$ de $\Ho$, nous avons clairement
$$
  \normH{u}^2 = \normL{u}^2 + \sum\_{i=1}^d\normL{\di u}^2,
$$
et donc les inégalités suivantes :

1. $\normH{u}^2 \geq \normL{u}^2$
2. $\normH{u}^2 \geq \sum_{i=1}^d\normL{\partial_i u}^2 \geq \normL{\partial_i u}^2, \qquad \forall i=1,2,\ldots, d$
{{% /alert %}}

Nous montrons maintenant que $\Ho$ muni de cette norme est complet.

{{% thm lemma "Complétude de H1"%}}
L'espace $H^1(\Omega)$ est complet pour la norme $\normH{\cdot}$.
{{% /thm %}}
{{% thm proof %}}
Prenons une suite de Cauchy $(u_n)_n$ de $H^1(\Omega)$ et montrons qu'elle converge dans $H^1(\Omega)$. Par définition de la suite de Cauchy, nous avons
$$
\forall \varepsilon > 0,\exists N>0\text{ tel que }\forall n > N, \forall p>N, \quad \normH{u_n-u_p}\leq \varepsilon.
$$
Par ailleurs, pour $n,p$ de $\Nb$ l'inégalité suivante est vérifiée :
$$
\normL{u_n - u_p}\leq \normH{u_n - u_p},
$$
ce qui fait de la suite $(u_n)_n$ une suite de Cauchy dans $L^2(\Omega)$, puisque :
$$
\forall \varepsilon > 0,\exists N>0\text{ tel que }\forall n > N, \forall p>N, \quad \normL{u_n - u_p}\leq \normH{u_n-u_p}\leq \varepsilon.
$$
L'espace $\Lo$ étant complet, la suite $(u_n)_n$ converge dans $L^2(\Omega)$ vers $u\in L^2(\Omega)$. Nous appliquons le même raisonnement aux dérivées partielles : pour $i= 1,\ldots, d$, nous avons aussi
$$
\normL{\partial_i u_n - \partial_i u_p}\leq \normH{u_n -  u_p}.
$$
Ainsi, pour tout $i$, la suite $(\partial_i u_n)_n$ est aussi de Cauchy dans $L^2(\Omega)$ et converge donc vers un élément $f_i\in L^2(\Omega)$. Il nous faut donc montrer que $u$ est dérivable (au sens faible) et que $f_i = \partial_i u$. Remarquons pour cela que, par définition,
$$
\forall \varphi \in \Cscr^{\infty}_c(\Omega),\qquad \int\_{\Omega}\partial_i u_n (x)\varphi(x) \diff x=
-\int\_{\Omega} u_n(x) \partial_i \varphi(x)\diff x. 
$$
En passant à la limite dans $L^2(\Omega)$ dans cette expression, il vient que : 
$$
\forall \varphi \in \Cscr^{\infty}_c(\Omega),\qquad \int\_{\Omega} f_i (x)\varphi(x) \diff x=
-\int\_{\Omega} u(x) \partial_i \varphi(x)\diff x. 
$$
Autrement dit, $u$ est dérivable par rapport à toutes ses variables et $\partial_i u = f_i$, ce qui implique que $u$ est bien dans $H^1(\Omega)$. Nous avons donc montré que la suite $(u_n)_n$ converge dans $L^2(\Omega)$ vers un élément $u$ de $\Ho$. Il nous reste à montrer que cette convergence est toujours valable pour la norme de $\Ho$. Utilisons la remarque précédente pour décomposer la norme dans $\Ho$ :

$$
\normH{u_n - u}^2 = \normL{u_n - u}^2 + \sum\_{j=1}^d \normL{\dj u_n - \dj u}^2 \to 0 (n \to +\infty).
$$
La suite de Cauchy $(u_n)_n$ est donc convergente dans $H^1(\Omega)$, ce dernier est donc complet.
{{% /thm %}}

Nous en déduisons le corollaire suivant:
{{% thm corollary %}}
$H^1(\Omega)$ est un espace de Hilbert pour le produit scalaire $\PSH{\cdot}{\cdot}$.
{{% /thm %}}
Nous avons également le résultat de densité suivant
{{% thm proposition %}}
L'espace $\Cscr^{\infty}_c(\Omega)$ est dense dans $H^1(\Omega)$ pour la norme $\normH{\cdot}$.
{{% /thm %}}
En particulier, l'espace $\Cscr^{1}(\Omega)$, qui contient $\Cscr^{\infty}_c(\Omega)$, est dense dans $H^1(\Omega)$ pour la norme $\normH{\cdot}$. Ce résultat nous dit que $H^1(\Omega)$ est le "plus petit" espace complet contenant $\Cscr^{1}(\Omega)$ : c'est ce que nous cherchions !


![Taste like victory](https://media1.tenor.com/images/377369f2a6c278dd72fba07fba2f446c/tenor.gif?itemid=4512955)

## Formulations faibles dans les espaces de Sobolev

Reprenons notre problème modèle
$$
\left\\{
  \begin{array}{r c l l}
    -\Delta u + u & = & f & (\Omega),\\\\\\
    \dn u & = & 0 & (\partial\Omega).
  \end{array}
\right.
$$
La formulation faible associée à ce problème-ci s'écrit dans $\Ho$ :
\begin{equation}\label{eq:FVHpbmodel}
\left\\{
  \begin{array}{l}
    \text{Trouver $u\in H^1(\Omega)$ tel que}\\\\\\
    \forall v \in H^1(\Omega), \quad a(u,v) = \ell(v),
    \end{array}
  \right.
\end{equation}
avec
$$
\begin{array}{l c c l}
a\colon & H^1(\Omega)\times H^1(\Omega) & \to& \Cb \\\\\\
   & (u,v) & \longmapsto & \dsp \int\_{\Omega} u(x)\overline{v(x)} \diff x +\int\_{\Omega} \nabla u(x)\cdot \overline{\nabla v(x)} \diff x,\\\\\\
\ell \colon & H^1(\Omega) & \to& \Cb \\\\\\
   & v & \longmapsto & \dsp \int\_{\Omega} f(x)\overline{v(x)} \diff x.
\end{array}   
$$

La forme $a(\cdot,\cdot)$ est bien sesquilinéaire et c'est même le produit scalaire sur $\Ho$. Sa coercivité a déjà été montrée, et $\ell$ est continue. La différence avec ce qui précède est que nous travaillons maintenant dans l'espace $H^1(\Omega)$  qui est un espace de Hilbert. Le Théorème de Lax-Milgram peut s'appliquer pour obtenir que **\eqref{eq:FVHpbmodel} admet une unique solution $u$ dans $H^1(\Omega)$**.

{{% alert note %}}
La solution faible est-elle solution forte du problème initial ? Oui si $u$ est plus régulière. En particulier si $u\in H^2(\Omega)$, où
$$
H^2(\Omega) = \enstq{v \in \Ho}{\forall i,j, \quad \di\dj v\in \Lo}.
$$
Dans ce cas, l'égalité $-\Delta u + u = f$ est à comprendre *presque partout*.
{{% /alert %}}

{{% alert note %}}
En réalité, nous pouvons nous passer de la régularité $H^2(\Omega)$ de $u$, mais la démonstration devient plus compliquée...
{{% /alert %}}
