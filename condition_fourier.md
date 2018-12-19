+++
title = "Conditions de Fourier-Robin"

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
  parent = "menu_conditions"
  name = "Fourier-Robin"
  weight = 40

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
$\newcommand{\mphi}[1]{\varphi\_{#1}}$
$\newcommand{\sumit}[1]{\mathbf{s}\_{#1}}$

## Problème

Étudions le problème suivant pour $f$ et $g$ suffisamment régulières :

\begin{equation}\label{eq:dnNonH}
 \left\\{ 
   \begin{array}{r c l l}
    -\Delta u +u &=& f & (\Omega),\\\\\\
    \dn u +  u& = & g & (\partial \Omega).
  \end{array}
  \right.
\end{equation}
La condition de Fourier (ou Robin ou Fourier-Robin) s'écrit aussi $\dn u = g -u$ sur $\partial\Omega$. Après calcul, la formulation variationnelle s'écrit
$$
\left\\{ 
  \begin{array}{r c l l}
    \text{Trouver }u\in\Ho\text{ tel que }\\\\\\
    \forall v\in\Ho, a(u,v) = \ell(v),
  \end{array}
\right.
$$
avec :
$$
\begin{array}{l c c l}
a\colon & \Ho\times\Ho & \to &\Ho\\\\\\
        & (u,v)&\mapsto& \dsp \int\_{\Omega}\nabla u\cdot\overline{\nabla v} +  \int\_{\Omega} u \overline{ v} + 
 \int\_{\partial \Omega} u|\_{\partial\Omega} \overline{ v}|\_{\partial\Omega}\\\\\\
\ell\colon & \Ho & \to &\Ho\\\\\\
        & v&\mapsto& \dsp \int\_{\Omega}f \overline{v} + \int\_{\partial \Omega}g \overline{v}|\_{\partial\Omega}
 \end{array}
$$


## Existence et unicité

Nous avons vu que [les intégrales sur le bord ont un sens]({{<relref "condition_neumann.md">}}) du fait de l'existence de l'opérateur trace. Pour [une condition de Neumann]({{<relref "condition_neumann.md">}}), l'opérateur $\ell$ est le même et nous avons déjà vu qu'il vérifie les hypothèses du Théorème de Lax-Milgram. Il ne nous reste qu'à vérifier que $a(\cdot,\cdot)$ est sesquilinéaire (trivial), continue  et coercive.

1. Continuité de $a(\cdot,\cdot)$ pour tout $u,v\in\Ho$ :
$$
\begin{array}{r c l}
\abs{a(u,v)} & = & \dsp\abs{\int\_{\Omega}\nabla u\cdot\overline{\nabla v} +  \int\_{\Omega} u \overline{ v} + 
 \int\_{\partial \Omega} u|\_{\partial\Omega} \overline{ v}|\_{\partial\Omega}}\\\\\\
 & \leq & \dsp\abs{\int\_{\Omega}\nabla u\cdot\overline{\nabla v} +  \int\_{\Omega} u \overline{ v}} + 
 \abs{\int\_{\partial \Omega} u|\_{\partial\Omega} \overline{ v}|\_{\partial\Omega}}\\\\\\
  & \leq & \dsp \normH{u} \normH{v}+\norm{u|\_{\partial\Omega}}\_{\partial\Omega} \norm{v|\_{\partial\Omega}}\_{\partial\Omega}\\\\\\
  & \leq & \dsp \normH{u} \normH{v} + C^2\normH{u}\normH{v}\\\\\\
  & \leq & \dsp (1 + C^2)\normH{u} \normH{v}\\\\\\
 \end{array}
$$
La constante $C$ est la constante de continuité de l'opérateur Trace sur $\partial\Omega$.

2. Coercivité de $a(\cdot,\cdot)$, avec $u\in\Ho$ :
$$
\begin{array}{r c l}
a(u,u) & = & \dsp\int\_{\Omega}\nabla u\cdot\overline{\nabla u} +  \int\_{\Omega} u \overline{u} + 
 \int\_{\partial \Omega} u|\_{\partial\Omega} \overline{u}|\_{\partial\Omega}\\\\\\
  & = & \dsp \normH{u}^2+ \underbrace{\int\_{\partial \Omega} u|\_{\partial\Omega} \overline{u}|\_{\partial\Omega}}\_{\geq 0}\\\\\\
  & \geq & \dsp \normH{u}^2
 \end{array}
$$
Le problème admet donc une unique solution.

## Matrice de masse sur le bord
Après discrétisation dans la base éléments finis, nous sommes ramenés à la résolution du système linéaire
$$
A U = b,
$$
où la matrice $A$ et le vecteur $b$ sont donnés par
$$
\begin{array}{r c l}
  A(I,J) &=& \dsp\int\_{\Omega}\nabla \mphi{J}\cdot\overline{\nabla \mphi{I}} +  \int\_{\Omega} \mphi{J} \overline{ \mphi{I}} + 
 \int\_{\partial \Omega} \mphi{J}|\_{\partial\Omega} \overline{ \mphi{I}}|\_{\partial\Omega}\\\\\\
  B(I) &=& \dsp\int\_{\Omega} f \overline{ \mphi{I}} +  \int\_{\partial \Omega}g \overline{ \mphi{I}}|\_{\partial\Omega}
\end{array}
$$
Le vecteur $B$ se calcule grâce aux formules de quadratures. La matrice $A$ est obtenue par la somme de la matrice de rigidité $D$, de masse $M$ et d'une dernière matrice $M\_{\partial\Omega}$ de coefficients :
$$
M\_{\partial\Omega}(I,J)= \int\_{\partial \Omega} \mphi{J}|\_{\partial\Omega} \overline{\mphi{I}}|\_{\partial\Omega}.
$$
Cette matrice correspond à une matrice de masse sur le bord $\partial\Omega$. Nous pouvons tout d'abord remarquer que $\mphi{I}|\_{\partial\Omega} = 0$ dès que $\sumit{I}$ n'est pas sur $\partial\Omega$. Comme toujours, nous préférons la décomposer en contributions élémentaires où, ici, un élément sera un segment :
$$
M\_{\partial\Omega}(I,J)= \sum\_{\sigma \in \partial\Omega} 
\int\_{\sigma} \mphi{J}|\_{\sigma} \overline{\mphi{I}}|\_{\sigma}.
$$
Nous pouvons maintenant remarquer que la somme sur les arêtes n'en est pas une puisque l'intégrale sur $\sigma$ est nulle dès que $\sumit{I}$ ou $\sumit{J}$ n'est pas un sommet de l'arête. Cependant, n'oublions pas que nous ne calculons pas les coefficients un à un mais que nous *assemblons* la matrice, autrement dit, nous parcourons chaque segment, calculons toutes les contributions élémentaires associées à ce dernier, et additionnons le tout dans la grande matrice du système. 

Autrement dit et quitte à renuméroter, nous considérons une arête $\sigma = [\sumit{1}^{\sigma}, \sumit{2}^{\sigma}]$, nous cherchons à calculer :
$$
M^e\_{\sigma}(i,j) =\int\_{\sigma} \mphi{j}^{\sigma} \overline{\mphi{i}^{\sigma}},
$$
avec $\mphi{i}^{\sigma} = \mphi{I}|\_{\sigma}$ et $\sumit{i}^{\sigma} = \sumit{I}$. La matrice $M^e\_{\sigma}$ est de dimension 2x2.

## Éléments Finis P1

Nous introduisons la coordonnée curviligne $t$ 
$$
\forall \xx \in \sigma, t(\xx) = \frac{\norm{\xx-\sumit{1}^{\sigma}}}{\norm{\sumit{1}^{\sigma}-\sumit{2}^{\sigma}}} \in [0,1].
$$
Quand $\xx = \sumit{1}^{\sigma}$ alors $t=0$ et $\xx = \sumit{2}^{\sigma}$ alors  $t=1$.


La trace d'une fonction de forme $\mathbb{P}\_1$ sur $\sigma$ est la "fonction chapeau" 1D classique. Plus précisément :
$$
\begin{array}{l}
\mphi{1}^{\sigma}(\xx) =\mphi{1}^{\sigma}(\xx(t)) = \hat{\phi\_1}(t) = 1-t\\\\\\
\mphi{2}^{\sigma}(\xx) =\mphi{2}^{\sigma}(\xx(t)) = \hat{\phi\_2}(t) = t
\end{array}
$$

À l'inverse, connaissant $t$ on peut retrouver le point $\xx$ :
$$
\xx(t) = (1-t)\sumit{1} + t\sumit{2}.
$$
Nous avons une transformation bijective entre $\sigma$ et le segment $[0,1]$ dit de référence et noté $\hat{\sigma}$. Nous pouvons opérer un changement de variable ($i,j = 1,2$):
$$
\int\_{\sigma}\mphi{j}^{\sigma} \overline{\mphi{i}^{\sigma}} \diff \xx= \abs{\sigma}\int\_{0}^1\mphi{j}^{\sigma}(\xx(t)) \overline{\mphi{i}^{\sigma}\xx(t)} \diff t = \abs{\sigma}\int\_{0}^1\hat{\phi}\_{j}(t) \overline{\hat{\phi}\_i(t)} \diff t.
$$
Le coefficient de masse de bord se calcule alors aisément : 
$$
M^e\_{\sigma}(i,j) =\frac{\abs{\sigma}}{6}
\left(
  \begin{array}{c c}
  2 & 1\\\\\\
  1 & 2
  \end{array}
\right).
$$
