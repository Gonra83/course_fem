+++
title = "Estimation d'Erreur"

date = 2018-09-09T00:00:00
# lastmod = 2018-09-09T00:00:00

draft = false  # Is this a draft? true/false
toc = true  # Show table of contents? true/false
type = "docs"  # Do not modify.

math = true

# Add menu entry to sidebar.
[menu.fem]
  name = "Estimation d'Erreur"
  weight = 60

+++
$\newcommand{\Cb}{\mathbb{C}}$
$\newcommand{\Nb}{\mathbb{N}}$
$\newcommand{\Pb}{\mathbb{P}}$
$\newcommand{\Qb}{\mathbb{Q}}$
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
$\newcommand{\qq}{\mathbf{q}}$
$\newcommand{\ssb}{\mathbf{s}}$
$\newcommand{\xx}{\mathbf{x}}$
$\newcommand{\yy}{\mathbf{y}}$
$\newcommand{\zz}{\mathbf{z}}$
$\newcommand{\Ccal}{\mathcal{C}}$
$\newcommand{\Ascr}{\mathscr{A}}$
$\newcommand{\Cscr}{\mathscr{C}}$
$\newcommand{\Dscr}{\mathscr{D}}$
$\newcommand{\Sscr}{\mathscr{S}}$
$\newcommand{\Tscr}{\mathscr{T}}$
$\newcommand{\omegai}{\omega\_i}$
$\newcommand{\dsp}{\displaystyle}$
$\newcommand{\diff}{{\rm d}}$
$\newcommand{\conj}[1]{\overline{#1}}$
$\newcommand{\dn}{\partial_\nn}$
$\newcommand{\card}{\mathrm{card}}$
$\newcommand{\supp}{\mathrm{supp}}$
$\newcommand{\diam}{\mathrm{diam}}$
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
$\newcommand{\mphi}[1]{\varphi\_{#1}}$
$\newcommand{\ui}{u\_i}$
$\newcommand{\uj}{u\_j}$
$\newcommand{\Sscrh}{\hme{\Sscr}}$
$\newcommand{\deltaij}{\delta\_{i,j}}$
$\newcommand{\Kp}{K\_p}$
$\newcommand{\Kq}{K\_q}$
$\newcommand{\Kl}{K\_\ell}$
$\newcommand{\Pzero}{\Pb\_0}$
$\newcommand{\Pun}{\Pb\_1}$
$\newcommand{\Punw}{\Pun(\omega)}$
$\newcommand{\Pdeux}{\Pb\_2}$
$\newcommand{\Ptrois}{\Pb\_3}$
$\newcommand{\Pquatre}{\Pb\_4}$
$\newcommand{\Pk}{\Pb\_k}$
$\newcommand{\grandO}[1]{O\left(#1\right)}$
$\newcommand{\Cun}{\Cscr^1(\Omega)}$
$\newcommand{\Cunz}{\Cscr^1\_0(\Omega)}$
$\newcommand{\Cdeux}{\Cscr^2(\Omega)}$
$\newcommand{\Hoz}{H^1\_0(\Omega)}$
$\newcommand{\HoD}{H^1\_{0,\Gamma\_D}(\Omega)}$
$\newcommand{\Vhz}{V\_{h,0}}$
$\newcommand{\Hog}{H^1\_{g,D}}$
$\newcommand{\Kh}{\widehat{K}}$
$\newcommand{\qh}{\widehat{\qq}}$
$\newcommand{\sh}{\widehat{\ssb}}$
$\newcommand{\phih}{\widehat{\phi}}$
$\newcommand{\varphih}{\widehat{\varphi}}$
$\newcommand{\psih}{\widehat{\psi}}$
$\newcommand{\TK}{T^K}$
$\newcommand{\varphiK}{\varphi^K}$
$\newcommand{\ug}{u\_g}$
$\newcommand{\ut}{u\_t}$



Nous étudions ici à "quel point" la solution numérique est "proche" de la solution exacte, en fonction du raffinement de maillage. Les résultats sont très techniques, nous ne donnerons aucune démonstration. Cependant, il est important de retenir de ce qui suit que la méthode des éléments fonctionne d'autant mieux que :

1. La solution recherchée est régulière
2. Le maillage est régulier (pas de triangle "plat")

## Un premier élément : le lemme de Céa

Le Lemme de Céa nous a déjà donné première estimation de l'erreur :
\begin{equation}
\label{eq:cea}
\normH{u-\uh} \leq C \inf\_{\vh\in\Vh}\normH{u-\vh}.
\end{equation}
En d’autres termes, nous devons examinons simplement la question de savoir *comment approcher une fonction (quelconque)*
$v\in V$ par une fonction de $\Vh$, et notamment comment se comporte cette approximation lorsque le maillage se raffine.

Nous devons donc estimer $\inf\_{\vh\in\Vh}\normH{u-\vh}$.

## Opérateur d'interpolation

On introduit un opérateur d'interpolation $\Pi\_h$ dont on peut majorer la distance à une fonction $v\in V$ donnée :
$$
\begin{array}{r c c l}
  \Pi\_h^K \colon  & \Cscr^0(\overline{\Omega}) & \to & \Pun(\Omega)\\\\\\
                & v & \mapsto & \dsp \Pi\_h(v) = \sum\_{j=1}^{\Nh} v(\ssb\_j)\varphi\_j
\end{array}
$$

Autrement dit, $\Pi\_h(v)$ est l'échantillonnage de $v$ sur tous les noeuds du maillage. D'après \eqref{eq:cea}, si on prend $w$ continue sur $\overline{\Omega}$, nous avons
$$
\normH{u-\uh} \leq C \normH{u-\Pi\_h(w)}.
$$
Peut-on prendre $w=u$ ? Oui, si $u$ est suffisamment régulier... Ce qui est en réalité le cas, en général. Dans ce cas là, nous avons alors :
$$
\normH{u-\uh} \leq C \normH{u-\Pi\_h(u)}.
$$
L'erreur commise par la méthode des éléments finis est donc majoré par l'erreur d'interpolation de la solution.

{{% alert warning %}}
Il n'y a aucune raison pour que $\uh = \Pi\_h u$ !
{{% /alert %}}

La stratégie consiste à construire un opérateur d'interpolation $\Pi\_h$ dont on peut majorer la distance à une fonction $v\in V$ donnée. Localement, sur un triangle $K$ de sommet $\{\ssb^K\_1,\ssb^K\_2,\ssb^K\_3\}$, nous pouvons construire cet opérateur :
$$
\begin{array}{r c c l}
  \Pi\_h^K \colon  & \Cscr^0(K) & \to & \Pun(K)\\\\\\
                & v & \mapsto & \dsp \Pi\_h^K(v) = \sum\_{j=1}^3 v(\ssb\_j^K)\varphi\_j^K
\end{array}
$$




## Contexte de l'étude

Nous nous plaçons dans le cas du problème de Dirichlet sur un domaine $\Omega$ polygonal :
\begin{equation}
\label{pb:diri}
\left\\{
  \begin{array}{r c l l }
    -\Delta u & =& f & (\Omega)\\\\\\
    u &=&0&(\partial\Omega).
  \end{array}
\right.
\end{equation}
L'approximation éléments finis par une méthode d'ordre $k$ de cette méthode est la suivante :
\begin{equation}
\label{pb:dirih}
  \left\\{
    \begin{array}{l}
      \text{Trouver }u\in \Vhz^k\text{ tel que }\\\\\\
      \forall \vh\in \Vhz^k, \quad a(\uh,\vh) = \ell(\vh),
    \end{array}
  \right.
\end{equation}
avec
$$
\begin{array}{r l}
a(\uh, \vh) &=\dsp  \int\_{\Omega}\nabla \uh(\xx)\cdot\conj{\nabla \vh(\xx)}\diff\xx \\\\\\
\ell(\vh)&=\dsp \int\_{\Omega}f(\xx)\conj{\vh(\xx)}\diff\xx.
\end{array}
$$

L'espace $\Vhz^k$ est l'espace des éléments finis d'ordre $k$ dont les fonctions sont nulles sur $\partial\Omega$:
$$
\Vhz^k = \enstq{u\in\Cscr^0(\overline{\Omega})}{\forall K\in\Tscr\_h, u\restrict\_K\in\Pk(T) \text{ et } u\restrict\_{\partial\Omega}= 0}.
$$

## Maillages réguliers

Nous introduisons  trois définitions pour un triangle $K$ :

1. **Le diamètre** $\diam(K)$ : la plus grande distance entre deux points de $K$
2. **La rondeur** $\rho(K)$  : le diamètre du plus grand cercle inscrit dans $K$
3. **L'aplatissement** : le rapport $\frac{\diam(k)}{\rho(K)}$. Plus cette valeur est grande, plus le triangle est plat.


Nous pouvons maintenant définir une suite de maillages réguliers :
{{% thm definition %}}
Soit $(\Tscr\_h)\_{h>0}$ une suite de maillages de $\Omega$. On dit qu'il s'agit d'une suite de maillages réguliers si :

1. La suite $h=\max\_{K\in\Tscr\_h}\diam(K)$ tend vers $0$
2. L'applatissement de tous les triangles est borné par une constante indépendamment de la finesse de maillage :
  $$
  \exists C>0 | \forall h>, \forall K\in\Tscr\_h,\quad    \frac{\diam(K)}{\rho(K)} \leq C.
  $$
{{% /thm %}}

{{% alert note %}}
La dernière condition signifie qu'il existe un angle $\theta\_0$ qui minimise tous les angles de tous les triangles du maillage.
{{% /alert %}}


## Estimation de l'erreur

Dans cette section, la suite  de maillages $(\Tscr\_h)\_h$ est supposée régulière et la dimension de l'espace est 2 ou 3.

{{% thm proposition %}}
Pour tout $v\in H^{k+1}(\Omega)$, l'interpolée $\Pi\_hv$ est bien définie et il existe une constance $C>0$ indépendante de $h$ et $v$ telle que, pour $k \geq 1$ :
$$
  \normH{v - \Pi\_h v}\leq C h^k\norm{v}\_{H^{k+1}(\Omega)}.
$$
{{% /thm  %}}
Cette proposition montre que l'erreur d'interpolation d'une fonction régulière dépend de la régularité de la fonction, et surtout que plus $k$ des éléments finis augmente, plus l'interpolation sera précise. Nous pouvons enfin énoncer le théorème d'estimation de l'erreur par la méthode des éléments finis.

{{% thm theorem %}}
Soit $u\in\Hoz$, la solution du problème de Dirichlet \eqref{pb:diri}, et soit $\uh\in \Vhz$ la solution (exacte) du problème approchée \eqref{pb:dirih} par la méthode des éléments finis $\Pk$. La méthode des éléments finis converge :
$$
  \lim\_{h\to 0}\normH{u-\uh} = 0,
$$
et nous avons l'estimation suivante, si $u\in H^{k+1}(\Omega)$ (la solution exacte):
$$
  \normH{u-u\_h}\leq C h^k\norm{u}\_{H^{k+1}(\Omega)},
$$
où $C>0$ est indépendante de $h$ et de $u$. 
{{% /thm %}}

Pour un problème donné, nous  pouvons étudierons préférentiellement l'estimation suivante en norme $\Lo$ de l'erreur :
$$
\normL{u-u\_h}\leq C h^{k+1},
$$
où la constante $C$, dépend ici de $u$. Cette relation est intéressante à étudier puisque l'on constate que plus l'ordre des polynômes augmente, plus l'estimation sera fine. La norme $\Lo$ est en générale plus facile à calculer numériquement que la norme sur $\Ho$.


