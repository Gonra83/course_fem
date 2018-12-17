+++
title = "Conditions de Dirichlet"

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
  name = "Dirichlet"
  weight = 20

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


## Formulation faible et espace H<sup>1</sup><sub>0</sub>


Nous considérons tout d'abord le cas où $g= 0$. La condition de Dirichlet est dite **essentielle** car elle est intégrée à l'espace fonctionnel. On étudie tout d'abord ce problème dans le cas régulier, et on introduit l'espace des fonctions $\Cun$ nulles sur le bord de $\Omega$ :
$$
\Cunz = \enstq{u\in\Cun}{u\restrict\_{\partial\Omega}= 0}.
$$
Supposons que $u\in\Cdeux$, alors en multipliant par une fonction test $v\in\Cun$, en intégrant sur $\Omega$  et en utilisant la formule de Green, il vient que
$$
\begin{array}{r l}
  \dsp \int\_{\Omega} -\Delta u(\xx)\overline{v}(\xx)\diff(\xx) &=
  \dsp \int\_{\Omega} \nabla u(\xx)\cdot\overline{\nabla v(\xx)}\diff\xx+ 
  \dsp \int\_{\partial\Omega} \dn u(\xx) \overline{v(\xx)}\diff\xx \\\\\\ &=
  \dsp \int\_{\Omega} \nabla u(\xx)\cdot\overline{\nabla v(\xx)}\diff\xx.
\end{array}
$$
Nous obtenons donc la formulation faible suivante :
$$
\left\\{
  \begin{array}{l}
    \text{Trouver } u\in\Cunz\text{ tel que }\\\\\\
    \dsp \forall v \in \Cunz,\quad a(u,v) = \ell(v),
  \end{array}
\right.
$$
avec
$$
\left\\{
  \begin{array}{r l}
    a(u,v) &= \dsp \int\_{\Omega} \nabla u(\xx)\cdot\overline{\nabla v(\xx)}\diff\xx \\\\\\
    \ell(v) &= \dsp\int\_{\Omega} f(\xx)\overline{ v(\xx)}\diff\xx.
  \end{array}
\right.
$$
Malheureusement, nous ne pourrons toujours pas appliquer le Théorème de Lax-Migram sur cette formulation faible, car $\Cunz$ n'est pas complet (en tout cas, pas pour la norme qui nous intéresse). Nous introduisons alors un espace de Sobolev qui prend en compte la condition de Dirichlet.
$$
\Hoz = \enstq{u\in\Ho}{\gamma\_{\partial\Omega} u = 0},
$$
où $\gamma\_{\partial\Omega}:\Ho\to L^2(\partial\Omega)$ est l'application trace sur $\partial\Omega$.
{{% thm lemma %}}
L'espace $\Hoz$ est un espace de Hilbert.
{{% /thm  %}}
{{% thm proof %}}
Par la définition de l'espace, nous avons $\Hoz = \ker(\gamma\_{\partial\Omega})$. Nous avons vu que l'application trace est continue, son noyau est alors fermé. L'espace $\Hoz$ est un sous-espace fermé de $\Ho$ qui est un Hilbert : $\Hoz$ est donc également un espace de Hilbert.
{{% /thm  %}}
La formulation faible que nous étudions finalement est :
$$
\left\\{
  \begin{array}{l}
    \text{Trouver } u\in\Hoz\text{ tel que }\\\\\\
    \dsp \forall v \in \Hoz,\quad a(u,v) = \ell(v).
  \end{array}
\right.
$$

Nous vérifions maintenant les hypothèses du théorème de Lax-Milgram pour démontrer l'existence et l'unicité de la solution à la formulation variationnelle ci-dessus :

1. $\Hoz$ est un espace de Hilbert
2. Continuité de $\ell(\cdot)$ :
  $$
    \begin{array}{ r >{\displaystyle}l l}
      \forall v\in\Hoz,\quad \abs{\ell(v)} & \dsp = \abs{\int\_{\Omega}f(\xx)\conj{v(\xx)}\diff\xx} & \\\\\\
      & \leq \normL{f}\normL{v}& \textit{Cauchy Schwarz}\\\\\\
      & \leq \normL{f}\normH{v}& \textit{Inégalité des normes}
    \end{array}
  $$
3. Continuité de $a(\cdot,\cdot)$ :
  $$
    \begin{array}{ r >{\displaystyle}l l}
      \forall u, v\in\Hoz,\quad \abs{a(u,v)} &\dsp  = \abs{\int\_{\Omega}\nabla u(\xx)\cdot \conj{\nabla v(\xx)}\diff\xx} & \\\\\\
      & \leq \normL{\nabla u}\normL{\nabla v}& \textit{Cauchy Schwarz}\\\\\\
      & \leq \normH{u}\normH{v}& \textit{Inégalité des normes}
    \end{array}
  $$
4. Coercivité de $a(\cdot,\cdot)$ :
  $$
  \forall u\in\Hoz,\quad \Re\left(a(u,u)\right)  = a(u,u) = \abs{\int\_{\Omega}\nabla u(\xx)\cdot \conj{\nabla u(\xx)}\diff\xx} = \normL{\nabla u}^2\ldots
  $$
La coercivité est en réalité compliquée à obtenir puisque nous aimerions avoir :  
$$ 
\normL{\nabla u}^2 \geq C \normH{u}^2 = C\left(\normL{\nabla u}^2 + \normL{u}^2\right),
$$ 
et fort heureusement c'est le cas, grâce à l'inégalité de Poincaré.

## Inégalité de Pointcaré

Nous admettrons le théorème suivant, qui nous permet d'obtenir la coercivité de $a(\cdot,\cdot)$. Au final, toutes les hypothèses du théorème de Lax-Milgram sont respectées et le problème admet une unique solution.

{{% thm theorem "Inégalité de Poincaré" %}}
Il existe une constante $C>0$ telle que, pour tout $u\in\Hoz$, nous avons :
$$
  \normL{\nabla u}^2 \geq C \normH{u}^2.
$$
{{% /thm %}}

{{% alert note %}}
L'inégalité de Poincaré est aussi valable si la condition de Dirichlet n'est posée que sur une partie du bord $\partial\Omega$, comme montré ci-après.
{{% /alert %}}

## Condition de Dirichlet partielle : combinaison de Neumann et  Dirichlet

 Prenons par exemple le problème suivant, où $w\in L^2(\Gamma\_N)$, $\Gamma\_D\cup\Gamma\_N =\partial\Omega$ et $\Gamma\_D\cap\Gamma\_N = \emptyset$ :

\begin{equation}\label{eq:eqGammaD}
  \left\\{
    \begin{array}{r c l l}
      -\Delta u & = & f & (\Omega)\\\\\\
      u & =  & 0 & (\Gamma\_D)\\\\\\
      \dn u & =  & w & (\Gamma\_N)
    \end{array}
  \right.
\end{equation}

En notant $\gamma\_D \colon \Ho\to L^2(\Gamma\_D)$ l'application trace sur $\Gamma\_D$, nous introduisons l'espace $\HoD$ suivant :

$$
\HoD = \enstq{u\in\Ho}{\gamma\_D(u) = 0}.
$$
Autrement dit, $\HoD$ peut être vu comme les fonctions $\Ho$ nulles sur le bord $\Gamma\_D$. L'espace $\HoD$ est toujours un espace de Sobolev, pour les mêmes raisons que pour $\Hoz$ et la formulation faible s'écrira alors, après calculs :
$$
\left\\{
  \begin{array}{l}
    \text{Trouver }u\in\HoD \text{ tel que }\\\\\\
    \forall v\in\HoD,\quad a(u,v) = \ell(v),
  \end{array}
\right.
$$
avec, pour toutes fonctions $u$ et $v$ de $\HoD$ :
$$
\left\\{
  \begin{array}{r l}
    a(u,v) &=\dsp \int\_{\Omega}\nabla u(\xx)\cdot\conj{\nabla v(\xx)} \diff\xx \\\\\\
    \ell(v) &= \dsp \int\_{\Omega}f(\xx)\conj{v(\xx)}\diff\xx + \int\_{\Gamma\_N}w(\xx)\conj{v(\xx)}\diff\xx.
  \end{array}
\right.
$$

Nous vérifions maintenant les hypothèses du théorème de Lax-Milgram. La continuité de $a$ et de $\ell$ ont déjà été démontré précédemment. Seule nous intéresse ici la coercivité de $a$, donnée par une autre version de l'inégalité de Poincaré (plus complète) :
{{% thm theorem "Inégalité de Poincaré générale" %}}
Soit $\Gamma\_D\subset\partial\Omega$ une partie du bord de mesure non nulle. Il existe une constante $C>0$ telle que :
$$
  \forall u\in\HoD,\quad \normL{\nabla u}^2 \geq C \normH{u}^2.
$$
{{% /thm %}}




## Prise en compte des conditions de Dirichlet dans la matrice


Dans la suite, nous considérons le cas général où la condition de Dirichlet homogène est posée sur une partie du bord $\Gamma\_D$ uniquement, c'est à dire le problème \eqref{eq:eqGammaD}.


Si $V_h$ est l'espace des éléments finis $\Pb^1$ sur $\Omega$, alors une discrétisation naturelle de $\Hoz$ est l'espace $\Vhz$ définie
$$
\Vhz = \enstq{u\in V_h}{u\restrict\_{\Gamma\_D} = 0}
$$

Mais nous pouvons aussi raisonner sur le système linéaire directement. Nous séparons les degrés de liberté en deux sous-ensembles :

1. Ceux qui appartiennent à $\Omega$ ou à $\Gamma\_N$ : nous les noterons avec un indice $I$ (pour Intérieur) : $u\_I$
2. Ceux qui appartiennent à $\Gamma\_D$, ils seront notés avec un indice $D$ : $u\_D$

Quitte à renumérotter, le vecteur $U$ de degrés de liberté se réécrit
$$
U =\left(
  \begin{array}{c}
    u\_I\\\\\\
    u\_D
  \end{array}
\right),
$$
et le système linéaire $AU = b$  devient :
$$
AU = b \iff 
\left(
  \begin{array}{c c}
    A\_{I,I}  & A\_{I, D}\\\\\\
    A\_{D, I} & A\_{D,D}
  \end{array}
\right)
\left(
  \begin{array}{c}
    u\_I\\\\\\
    u\_D
  \end{array}
\right) = 
\left(
  \begin{array}{c}
    b\_I\\\\\\
    b\_D
  \end{array}
\right)
$$

Les degrés de liberté $u\_D$ sont en réalité fixés à 0 du fait de la condition de Dirichlet, autrement dit, le système à résoudre se résume à ($I\_{D,D}$ étant la matrice identité) :
$$
  AU = b \iff 
  \left(
    \begin{array}{c c}
      A\_{I,I}  &A\_{I,D}\\\\\\
      0 & I\_{D,D}
    \end{array}
  \right)
  \left(
    \begin{array}{c}
      u\_I\\\\\\
      u\_D
    \end{array}
  \right)
  = 
  \left(
    \begin{array}{c}
      b\_I\\\\\\
      0
    \end{array}
  \right)
$$


Informatiquement, nous devons donc rendre les lignes et colonnes associées aux degrés de liberté de Dirichlet, nulles, sauf sur la diagonale avec la valeur 1. Cette opération est souvent effectuée après l'assemblage de la matrice.

{{% alert note %}}
La valeur de 1 sur la diagonale est finalement arbitraire : nous pouvons choisir n'importe quelle valeur. Pour des raisons de précision numérique, il peut être plus pertinent de choisir comme valeur la moyenne de la somme de la diagonale de $A\_{I,I}$ (sa trace). Cette technique peu coûteuse permet d'éviter de polluer le conditionnement de la matrice par des valeurs potentiellement trop grande ou trop petite par rapport à la "moyenne".
{{% /alert %}}

{{% alert note %}}
Dans le cas de condition de Dirichlet homogène, ce système ce simplifie :
$$
  AU = b \iff 
  \left(
    \begin{array}{c c}
      A\_{I,I}  & 0\\\\\\
      0 & I\_{D,D}
    \end{array}
  \right)
  \left(
    \begin{array}{c}
      u\_I\\\\\\
      u\_D
    \end{array}
  \right)
  = 
  \left(
    \begin{array}{c}
      b\_I\\\\\\
      0
    \end{array}
  \right),
$$
ou encore, plus simplement : $A\_{I,I} u\_I = b\_I$.
{{% /alert %}}

## Condition de Dirichlet non homogène

### Notion de relèvement

Nous considérons maintenant le cas d'une condition de Dirichlet non homogène, autrement dit, si $g\in L^2(\Gamma\_D)$ et $g\neq 0$ :

$$
\left\\{
  \begin{array}{r c l l}
    -\Delta u & = & f & (\Omega)\\\\\\
    u & =  & g & (\Gamma\_D)\\\\\\
    \dn u & =  & w & (\Gamma\_N)
  \end{array}
\right.
$$

Nous pouvons introduire l'espace suivant
$$
\Hog = \enstq{u\in \Ho}{u\restrict\_{\Gamma\_D} = g},
$$
mais ce **n'est pas un espace vectoriel** ! Pour remédier à ce problème, nous nous ramenons au cas d'une condition de Dirichlet homogène en introduisant un *relèvement* $u\_g$ de $g$ : une fonction de $\Ho$ telle que $\gamma\_{\Gamma\_D}u\_g = g$. Nous ne nous préoccuperons pas de savoir si une telle fonction existe et supposons que tel est le cas (*en réalité, $g$ doit appartenir à l'espace $H^{\frac{1}{2}}(\partial\Omega)$*). Le problème devient alors de chercher $\ut = u-u\_g$ satisfaisant :

$$
\left\\{
  \begin{array}{r c l l}
    -\Delta \ut & = & f +\Delta u\_g & (\Omega)\\\\\\
    \ut & =  & 0 & (\Gamma\_D))\\\\\\
    \dn \ut & =  & h & (\Gamma\_N)
  \end{array}
\right.
$$

{{% alert note %}}
Le relèvement n'est pas unique, puisque si $u\_0\in\Hoz$ alors $u\_g + u\_0$ est aussi un relèvement acceptable.
{{% /alert %}}

### Construction d'un relèvement en P1

En éléments finis $\Pun$, un relèvement naturel est la fonction $u\_{h, g}$ de $\Vh$ telle que
$$
u\_{h,g}(\ssb\_j) =
\left\\{
  \begin{array}{l l}
    g(\ssb\_j) & \text{ si }\ssb\_j\in\Gamma\_D,\\\\\\
    0 & \text{ sinon.}
  \end{array}
\right.
$$
Cette fonction n'est pas un relèvement de $g$ puisqu'elle ne coïncide avec $g$ que sur les sommets, mais pas nécessairement entre les sommets. Toutefois, au niveau discret, elle remplit ce rôle : c'est **un relèvement de l'interpolée** $g\_h = \Pi\_h g$ de $g$ sur l'espace éléments finis (la différence est subtile mais importante).

En pratique, la matrice est alors décomposée ainsi :
$$
AU = b \iff 
\left(
  \begin{array}{c c}
    A\_{I,I}  & A\_{I, D}\\\\\\
    0 & I\_{D,D}
  \end{array}
\right)
\left(
  \begin{array}{c}
    u\_I\\\\\\
    u\_D
  \end{array}
\right) = 
\left(
  \begin{array}{c}
    b\_I\\\\\\
    g\_h
  \end{array}
\right).
$$
La matrice obtenue est non symétrique, ce qui peut poser des problèmes (par ex. augmentation du coût de stockage mémoire). Une astuce simple consiste à réécrire sous la forme suivante :
$$
  AU = b \iff 
  \left(
    \begin{array}{c c}
      A\_{I,I}  & 0\\\\\\
      0 & I\_{D,D}
    \end{array}
  \right)
  \left(
    \begin{array}{c}
      u\_I\\\\\\
      u\_D
    \end{array}
  \right)
  = 
  \left(
    \begin{array}{c}
      b\_I - A\_{I,D} g\_h\\\\\\
      g\_h
    \end{array}
  \right).
$$