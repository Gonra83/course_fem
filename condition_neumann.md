+++
title = "Conditions de Neumann Non Homogène"

date = 2018-09-09T00:00:00
# lastmod = 2018-09-09T00:00:00

draft = false  # Is this a draft? true/false
toc = true  # Show table of contents? true/false
type = "docs"  # Do not modify.

math = true

# Add menu entry to sidebar.
[menu.fem]
  parent = "menu_conditions"
  name = "Neumann Non Homogène"
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


Étudions le problème suivant, pour $f\in\Cscr^0(\overline{\Omega})$ et $g\in\Cscr^0(\partial\Omega)$:

\begin{equation}\label{eq:dnNonH}
 \left\\{ 
   \begin{array}{r c l l}
    -\Delta u + u &=& f & (\Omega),\\\\\\
    \dn u & = & g & (\partial \Omega).
  \end{array}
  \right.
\end{equation}
Commençons par la formulation variationnelle dans l'espace des fonctions $\Cscr^1(\Omega)$. Après multiplication par des fonctions test et intégration par partie, nous obtenons
$$
\int\_{\Omega}\nabla u(x) \cdot \overline{\nabla v(x)} \diff x +
\int\_{\Omega}  u(x)\overline{ v(x)} \diff x
-\int\_{\partial\Omega} \dn u(x)\overline{v(x)} \diff s(x)
= \int\_{\Omega} f(x)\overline{v(x)} \diff x.
$$
En utilisant la condition $\dn u = g$ sur $\partial\Omega$, nous obtenons la formulation variationnelle suivante :
\begin{equation}\label{fv:dnNonH}
  \left\\{\begin{array}{l}
    \text{Trouver }u\in\Cscr^1(\overline{\Omega})\text{ tel que}\\\\\\
    \forall v \in\Cscr^1(\overline{\Omega}),\quad a(u,v) = \ell(v),
  \end{array}\right.
\end{equation}
avec
$$
\begin{array}{r c l}
  a(u,v) &:=& \dsp\int\_{\Omega}\nabla u(x) \cdot \overline{\nabla v(x)} \diff x +
  \int\_{\Omega}  u(x)\overline{ v(x)} \diff x\\\\\\
  \ell(v) &:= &\dsp\int\_{\partial\Omega} g(x)\overline{v(x)} \diff s(x)
  + \int\_{\Omega} f(x)\overline{v(x)} \diff x.
\end{array}
$$
Nous avons alors la proposition suivante
{{% thm proposition %}}
Soit $u\in \Cscr^2(\overline{\Omega})$. Alors $u$ est solution de \eqref{eq:dnNonH} si et seulement si $u$ est solution de la formulation variationnelle \eqref{fv:dnNonH}
{{% /thm %}}
{{% thm proof %}}
  Le sens $\implies$ est évident. Montrons l'autre sens, c'est-à-dire prenons $u$ une fonction $\Cscr^2(\overline{\Omega})$ solution de \eqref{fv:dnNonH} :
  $$
    \forall v \in \Cscr^1(\overline{\Omega}),\qquad 
    \int\_{\Omega}\nabla u(x) \cdot \overline{\nabla v(x)} \diff x +
    \int\_{\Omega}  u(x)\overline{ v(x)} \diff x
    =
\int\_{\partial\Omega} g(x)\overline{v(x)} \diff s(x)
+ \int\_{\Omega} f(x)\overline{v(x)} \diff x.
$$
Nous appliquons la formule de Green sur le premier terme pour obtenir (nous simplifions la notation en supprimant les quantités $(x)$)
  $$
    \forall v \in \Cscr^1(\overline{\Omega}),\qquad 
    - \int\_{\Omega}\Delta u. \overline{v} \diff x +
    \int\_{\partial\Omega}\dn u. \overline{v}\diff x +
    \int\_{\Omega}  u\overline{ v} \diff x
    =
\int\_{\partial\Omega} g\overline{v} \diff s
+ \int\_{\Omega} f\overline{v} \diff x.
$$
Nous regroupons les termes pour obtenir
  \begin{equation}\label{eq:proof1}
    \forall v \in \Cscr^1(\overline{\Omega}),\qquad 
     \int\_{\Omega}\left(- \Delta u + u - f\right)\overline{v} \diff x =
\int\_{\partial\Omega} \left(g - \dn u\right)\overline{v} \diff s
\end{equation}
Cette expression étant valable pour tout $v$ de $\Cscr^1(\overline{\Omega})$, elle l'est également pour les fonctions $\Cscr^{\infty}\_c(\Omega)$, qui sont nulles sur le bord $\partial\Omega$ :
$$
  \forall v \in \Cscr^{\infty}\_c(\Omega),\quad 
    \int\_{\Omega}\left(- \Delta u + u - f\right)\overline{v} \diff x = 0,
$$
ce qui implique que $- \Delta u + u -f = 0$ presque partout. Ceci implique par ailleurs que \eqref{eq:proof1} devient :
  $$
    \forall v \in \Cscr^1(\overline{\Omega}),\qquad 
\int\_{\partial\Omega} \left(g - \dn u\right)\overline{v} \diff s = 0.
$$
En particulier, comme $\dn u$ et $g$ sont continues sont $\partial\Omega$, nous pouvons prendre $v\in\Cscr^1(\overline{\Omega})$ tel que $v|_{\partial\Omega} = g - \dn u$. Nous obtenons alors
  $$
\int\_{\partial\Omega} \abs{g - \dn u}^2\diff s = 0 = \normL{g-\dn u}^2,
$$
  soit donc $g = \dn u$ presque partout sur $\partial\Omega$.
{{% /thm %}}


Pour pouvoir appliquer le Théorème de Lax-Milgram, nous devons basculer dans l'espace de Sobolev, plutôt que celui des fonctions dérivables (fortement). La formulation faible \eqref{fv:dnNonH} s'écrirait alors
\begin{equation}\label{fvH:dnNonH}
  \left\\{\begin{array}{l}
           \text{Trouver }u\in\Ho\text{ tel que}\\\\\\
           \forall v \in\Ho,\quad a(u,v) = \ell(v),
  \end{array}\right.
\end{equation}
où $a(\cdot,\cdot)$ et $\ell(\cdot)$ sont définies de la même manière que précédemment. Pour pouvoir appliquer le Théorème de Lax-Milgram, nous savons par le cas de Neumann homogène que l'application $a(\cdot,\cdot)$ est continue et coercive. Le problème vient de la fonction $\ell$ :
$$
\ell(v) = \int\_{\Omega}f\overline{v} + \int\_{\partial\Omega}g\overline{v}.
$$
En effet, il n'est pas clair que la deuxième quantité existe et soit continue : nous n'avons pas donné de sens à la trace sur $\partial\Omega$ d'une fonction de $\Ho$, c'est-à-dire à $v|\_{\partial\Omega}$. C'est l'objet du théorème ci-dessous (admis).

{{% thm theorem "Continuité de la trace" %}}
  Soit $\Gamma\subset\partial\Omega$ une partie du bord de mesure non nulle au sens de la mesure de surface. Alors il existe une unique application $\gamma\_{\Gamma}\colon\Ho\to L^2(\Gamma)$ qui est continue au sens de $\normH{\cdot}$ :
  $$
\exists C>0 \text{ tel que } \forall v \in\Ho \quad \norm{\gamma\_{\Gamma}(v)}\_{L^2(\partial\Omega)} \leq C\normH{v}.
  $$
  Cette application est de plus caractérisée par
  $$
\forall\varphi\in \Cscr^1(\overline{\Omega}),\qquad \gamma\_{\Gamma}(\varphi) = \varphi|_{\Gamma}.
  $$
{{% /thm %}}

Ce théorème nous permet de montrer que la forme $\ell$ a un sens (chaque quantité existe) et est bien continue puisque, pour tout $v$ de $\Ho$ :
$$
\begin{array}{r c l }
  \abs{\ell(v)} &\leq & \dsp \abs{\int\_{\Omega} f(x)\conj{v(x)}\diff x} + \abs{\int\_{\partial\Omega} g(x)\conj{v(x)}\diff x}\\\\\\
    &\leq & \dsp \normL{f}\normL{v} + \abs{\int\_{\partial\Omega} g(x)\conj{\gamma\_{\partial\Omega}(v(x))}}\\\\\\
    &\leq & \dsp \normL{f}\normL{v} + \norm{g}\_{L^2(\partial\Omega)}\norm{\gamma\_{\partial\Omega}(v)}\_{L^2(\partial\Omega)}\\\\\\
    &\leq & \dsp \left(\normL{f} + C\norm{g}\_{L^2(\partial\Omega)}\right)\normH{v}.
\end{array}
$$
Nous pouvons en conclure que \eqref{fvH:dnNonH} admet une unique solution par le Théorème de Lax-Milgram.
