+++
title = "Méthode de Galerkin"

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
  parent = "menu_fem"
  name = "Méthode de Galerkin"
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
$\newcommand{\vh}{v\_h}$
$\newcommand{\Vh}{V\_h}$
$\newcommand{\uh}{u\_h}$
$\newcommand{\Nh}{N\_h}$
$\newcommand{\mphi}[1]{\varphi\_{#1}}$
$\newcommand{\uj}{u\_j}$
$\newcommand{\hme}[1]{#1_h}$
## Contexte

Dans ce chapitre nous considérons un espace de Hilbert $V$ muni du produit scalaire $\PSV{\cdot}{\cdot}$ et de sa norme associée $\normV{\cdot}$. Nous considérons la formulation variationnelle suivante
\begin{equation}
\label{eq3:pbmodel}
\left\\{
  \begin{array}{l}
    \text{Trouver $u\in V$ tel que}\\\\\\
    \forall v\in V,\quad a(u,v) = \ell(v).
  \end{array}
\right.
\end{equation}

Les formes continues $a(\cdot,\cdot)$ et $\ell(\cdot)$ sont respectivement sesquilinéaire et anti-linéaire, et $a(\cdot,\cdot)$ est de plus coercive. De cette manière, le Théorème de Lax-Milgram s'applique et le problème \eqref{eq3:pbmodel} admet une unique solution.

Nous noterons $\PSV{\cdot}{\cdot}$ et $\normV{\cdot}$ respectivement le produit scalaire et la norme sur $V$.

## Dimension finie

Obtenir une solution de \eqref{eq3:pbmodel} est compliqué car $V$ est (a priori) de dimension infini. La méthode de Galerkin consiste à "approcher" l'espace fonctionnel $V$ par un espace $\Vh\subset V$, de **dimension fini**, mais toujours de Hilbert, et ce pour le même produit scalaire ! La formulation faible \eqref{eq3:pbmodel} est alors résolue dans $\Vh$ uniquement, avec pour solution $u\_h$ :
\begin{equation}\label{eq3:pbmodelh}
\left\\{
  \begin{array}{l}
    \text{Trouver $\uh\in \Vh$ tel que}\\\\\\
    \forall \vh\in \Vh,\quad a(\uh,\vh) = \ell(\vh).
  \end{array}
\right.
\end{equation}
On espère alors que cette solution approchée $\uh$ soit une bonne estimation de la solution exacte $u$, c'est-à-dire que
$$
\lim_{h\to 0}\normV{\uh-u} = 0.
$$
Remarquons tout d'abord que la formulation faible \eqref{eq3:pbmodelh} admet une unique solution
{{% thm lemma %}}
Le problème "approché" \eqref{eq3:pbmodelh} admet une unique solution.
{{% /thm %}}
{{% thm proof %}}
  L'espace $\Vh\subset V$ est un sous-espace de Hilbert de $V$, nous pouvons donc appliquer le Théorème de Lax-Milgram, dont les hypothèses sur $a(\cdot,\cdot)$ et $\ell(\cdot)$ sont toujours vérifiées sur $\Vh$.
{{% /thm  %}}

Travailler dans un espace de dimension finie présente un très grand avantage : on peut en extraire une **base de taille finie** et ramener le calcul de $\uh$ à la **résolution d'un système linéaire**, pour lequel les outils (numériques) ne manquent pas. Citons par exemple les bibliothèques suivantes :

- [MUMPS](http://mumps.enseeiht.fr/) : solveur open-source direct parallèle
- [Pardiso](https://software.intel.com/en-us/mkl-developer-reference-fortran-intel-mkl-pardiso-parallel-direct-sparse-solver-interface) : solveur direct parallèle privatif d'Intel
- [PETSc](https://www.mcs.anl.gov/petsc/) : Bibliothèque contenant entres autres de nombreux solveurs directs (dont MUMPS) ou itératifs (GMRES, ...)

{{% thm lemma %}}
Soit $V$ un espace de Hilbert et $\Vh$ un sous espace de dimension fini. Soit $a(\cdot,\cdot)$ une forme sesquilinéaire continue et coercive sur $V$, $\ell(\cdot)$ une forme anti-linéaire continue sur $V$. Le problème approché \eqref{eq3:pbmodelh} admet une unique solution. De plus, cette solution s'obtient par la résolution d'un système linéaire de matrice définie positive.
{{% /thm %}}
{{% thm proof %}}
Le problème  \eqref{eq3:pbmodelh} admet toujours une unique solution d'après le Théorème de Lax-Milgram. Comme $\Vh$ est de dimension finie, notée $\Nh$, nous pouvons en extraire une base $(\mphi{1}, \mphi{2}, \..., \mphi{\Nh})$ et écrire
$$
\uh = \sum\_{j=1}^{\Nh} \uj \mphi{j}.
$$
La formulation faible peut alors se réécrire sur les fonctions de cette base uniquement :
$$
\forall i, \qquad \sum\_{j=1}^{\Nh}  a(\mphi{j},\mphi{i}) \uj = \ell(\mphi{i}),
$$
ou encore
$$
\hme{A} \hme{U} = \hme{B},
$$
avec $\hme{A} = (a(\mphi{j}, \mphi{i}))\_{ 1\leq i,j\leq \Nh}$, $\hme{U}=(\uj)\_{1\leq j \leq \Nh}$ et $\hme{B}=(\ell(\mphi{i}))\_{1\leq i\leq \Nh}$. Montrons maintenant que la matrice $\hme{A}$ est définie positive : 
$$
\begin{array}{r l}
\forall \hme{W}\in\Rb^{\Nh}, \hme{W} = (w\_i)\_{1\leq i \leq \Nh},\\\\\\
\PS{\hme{W}}{\hme{A}\hme{W}} = \overline{\hme{W}^T}\hme{A} \hme{W} 
&=\dsp \sum\_{i=1}^{\Nh} \sum\_{j=1}^{\Nh} \overline{w\_j}a(\mphi{i},\mphi{j})w\_i \\\\\\
&=\dsp \sum\_{i=1}^{\Nh}\sum\_{j=1}^{\Nh}a(w\_i\mphi{i}, w\_j\mphi{j})\\\\\\
&=\dsp a\left(\sum\_{i=1}^{\Nh}w\_i\mphi{i}, \sum\_{j=1}^{\Nh}w\_j\mphi{j}\right)
\end{array}
$$
L'indice $j$ étant muet, nous pouvons changer son intitulé : 
$$
\PS{\hme{W}}{\hme{A}\hme{W}} = a\left(\sum\_{i=1}^{\Nh}w\_i\mphi{i}, \sum\_{i=1}^{\Nh}w\_i\mphi{i}\right)
$$
Nous utilisons maintenant la coercivité de $a(\cdot,\cdot)$ :
$$
\PS{\hme{W}}{\hme{A}\hme{W}} \geq \alpha\normV{\sum\_{i=1}^{\Nh}w\_i\mphi{i}}^2.
$$
Comme $\alpha > 0$, alors le terme $\PS{\hme{W}}{\hme{A}\hme{W}}$ est nul si et seulement si $\normV{\sum\_{i=1}^{\Nh}w\_i\mphi{i}}$ est nulle et donc si et seulement si $\sum\_{i=1}^{\Nh}w\_i\mphi{i}$ est la fonction nulle. Comme la famille $(\mphi{i})\_{1\leq i \leq \Nh}$ forme une base de $\Vh$, cela revient à dire que $w\_i = 0$ pour tout $i$ et donc que $\hme{W}$ est le vecteur nul. Nous avons donc montré que 
$$
\forall\hme{W}\in\Rb^{\Nh}\setminus\\{0\\}, \PS{\hme{W}}{\hme{A}\hme{W}} > 0.
$$
{{% /thm  %}} 

{{% alert note %}}
Quelques remarques :

- La matrice $\hme{A}$ *discrétise* l'opérateur $a(\cdot,\cdot)$ au sens où elle est de taille finie.
- La **coercivité** d'une forme $a(\cdot,\cdot)$ est, en quelque sorte, l'équivalent de la **définie positivité** de sa matrice. La coercivité s'applique au domaine "continue" (les *fonctions* ou *opérateurs*) tandis que la définie positivité est un terme appliqué au domaine "algébrique" (les *matrices* (infinies ou non)).  
- L'hypothèse de Lax-Milgram sur la **coercivité** de $a(\cdot,\cdot)$ est une **hypothèse forte** puisque la matrice $\hme{A}$ discrétisant $a(\cdot,\cdot)$ doit être **définie positive** !
{{% /alert %}}

## Erreur commise

Nous quantifions maintenant l'erreur commise en approchant $u$ par $\uh$ grâce au Lemme de Céa. Avant cela, notons une propriété très intéressante de la solution approchée $\uh$ : l'erreur commise est orthogonale à l'espace $\Vh$ :
{{% thm lemma%}}
Soit $u$ la solution exacte (*i.e.* solution de \eqref{eq3:pbmodel}) et $\uh$ la solution approchée (*i.e.* solution de \eqref{eq3:pbmodelh}). Soit $\hme{e} = u-\uh$ est l'erreur d'approximation, alors nous avons l'égalité suivante
$$
\forall \vh\in \Vh,\qquad a(\hme{e}, \vh) = 0.
$$
Autrement dit, l'erreur est orthogonale à $\Vh$.
{{% /thm %}}
{{% thm proof %}}
Comme $\Vh\subset V$, nous pouvons choisir $v=\vh$ dans la formulation variationnelle \eqref{eq3:pbmodel}:
$$
\begin{array}{r l}
\forall \vh\in \Vh,\quad a(u-\uh,\vh) &= a(u,\vh) - a(\uh,\vh) \\\\\\
& = \ell(\vh) - \ell(\vh) \\\\\\
& = 0
\end{array}
$$
{{% /thm  %}}
Nous pouvons maintenant montrer que l'erreur d'approximation $\uh$ de $u$ est uniformément bornée par la distance entre $u$ et l'espace $\Vh$. Ce résultat est connu comme étant [**le Lemme de Céa**](https://fr.wikipedia.org/wiki/Lemme_de_C%C3%A9a), démontré par [Jean Céa](https://fr.wikipedia.org/wiki/Jean_C%C3%A9a) durant [sa thèse](http://archive.numdam.org/article/AIF_1964__14_2_345_0.pdf/), en 1964.
{{% thm lemma "de Céa"%}}
Soit $u$ la solution exacte (*i.e.* solution de \eqref{eq3:pbmodel}) et $\uh$ la solution approchée (*i.e.* solution de \eqref{eq3:pbmodelh}). Nous avons
$$
\normV{u-\uh}\leq \frac{M}{\alpha}\inf_{\vh\in \Vh}\normV{u-\vh},
$$
où $M$ et $\alpha$ sont respectivement les constantes de continuité et de coercivité de $a(\cdot,\cdot)$ qui apparaissent dans le Théorème de Lax-Milgram.
{{% /thm %}}
{{% thm proof %}}
Pour $\vh\in \Vh$, la quantité $\vh-\uh$ est aussi un élément de $\Vh$, ce qui implique d'après le lemme précédent que
$$
\begin{array}{r l }
a(u - \uh, u - \uh)  &= a(u - \uh, u-\vh + \vh-\uh) \\\\\\
&= a(u - \uh, u-\vh) + a(u-\uh, \vh-\uh)\\\\\\
&= a(u - \uh, u-\vh).
\end{array}
$$
La coercivité et la continuité de $a(\cdot,\cdot)$ impliquent que
$$
\begin{array}{r l }
\forall \vh\in \Vh,\quad \alpha\normV{u-\uh}^2 &\leq \Re\left[a(u - \uh, u - \uh)\right]  \\\\\\
&\leq \Re\left[a(u - \uh, u - \vh)\right] \\\\\\
&\leq \abs{a(u - \uh, u - \vh)} \\\\\\
&\leq M\normV{u-\uh}\normV{u-\vh}.
\end{array}
$$
Nous en déduisons le résultat cherché :
$$
\forall \vh\in \Vh,\qquad \normV{u-\uh}\leq\frac{M}{\alpha}\normV{u-\vh}.
$$
{{% /thm  %}}

{{% alert note %}}
Le point important du Lemme de Céa est de remplacer le problème d'estimation de l'erreur par un problème d'approximation. En effet, il nous suffit de montrer que la solution est "bien approchée" par les fonctions de $\Vh$ pour savoir que l'erreur ne sera *qu'une constante fois plus grande* que cette erreur d'approximation. 
{{% /alert %}}

{{% thm lemma %}} 
Soit $\hme{\Pi} : V \to \Vh$ un **opérateur d'interpolation** tel que 
$$ 
\forall v \in V, \qquad \lim\_{h\to 0}\normV{v - \hme{\Pi} v} = 0, 
$$ 
alors la méthode de Galerkin converge, c'est-à-dire : 
$$ 
\lim\_{h\to 0}\normV{u-\uh} = 0. 
$$ 
{{% /thm %}} 
{{% thm proof %}} 
C'est une conséquence directe du lemme de Céa, puisque : 
$$ 
0 \leq \normV{u-\uh} \leq \frac{M}{\alpha}\normV{u - \hme{\Pi}u} \to 0 \quad (h\to 0). 
$$ 
{{% /thm  %}}