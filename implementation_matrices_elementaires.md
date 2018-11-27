+++
title = "Calcul des Matrices Élémentaires"

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
  name = "Calcul des Matrices Élémentaires"
  weight = 30

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
$\newcommand{\sK}{\mathbf{s}^K}$
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
$\newcommand{\Sscrh}{\hme{\Sscr}}$
$\newcommand{\deltaij}{\delta\_{i,j}}$
$\newcommand{\Kp}{K\_p}$
$\newcommand{\Kq}{K\_q}$
$\newcommand{\Kl}{K\_\ell}$
$\newcommand{\Pun}{\Pb\_1}$
$\newcommand{\Punw}{\Pun(\omega)}$
$\newcommand{\grandO}[1]{O\left(#1\right)}$
$\newcommand{\qh}{\widehat{\qq}}$
$\newcommand{\sh}{\widehat{\ssb}}$
$\newcommand{\phih}{\widehat{\phi}}$
$\newcommand{\varphih}{\widehat{\varphi}}$
$\newcommand{\psih}{\widehat{\psi}}$
$\newcommand{\gh}{\widehat{g}}$
$\newcommand{\Kh}{\widehat{K}}$
$\newcommand{\sumit}[1]{\ssb\_{#1}}$
$\newcommand{\sumitK}[2]{\ssb\_{#2}^{#1}}$
$\newcommand{\tri}[1]{K\_{#1}}$
$\newcommand{\loctoglob}{\mathrm{Loc2Glob}}$
$\newcommand{\aK}[1]{a\_{#1}}$
$\newcommand{\ellK}[1]{\ell\_{#1}}$
$\newcommand{\Ns}{N\_s}$
$\newcommand{\mphi}[1]{\varphi\_{#1}}$
$\newcommand{\mphiK}[2]{\mphi{#2}^{#1}}$
$\newcommand{\xK}[2]{x^{#1}\_{#2}}$
$\newcommand{\yK}[2]{y^{#1}\_{#2}}$
$\newcommand{\TK}[1]{T^{\tri{#1}}}$
$\newcommand{\BK}[1]{B\_{\tri{p}}}$
$\newcommand{\JK}[1]{J\_{\tri{#1}}}$

## Matrices de Masse et de Rigidité

Nous devons maintenant calculer les *contributions élémentaires*, c'est à dire les quantités $\aK{p}(\mphiK{p}{j}, \mphiK{p}{i})$ et $\ellK{p}(\mphiK{p}{i})$. Pour simplifier, les sommets d'un triangle $\tri{p}$ seront notés $(\sumitK{p}{1}, \sumitK{p}{2}, \sumitK{p}{3})$ et ordonnés dans le sens trigonométrique. Nous noterons $\sumitK{p}{i}=(\xK{p}{i},\yK{p}{i})$ et $\mphiK{p}{j}$ une fonction de forme du triangle $\tri{p}$ sans la supposer linéaire. D'autre part, nous scindons les contributions élémentaires en deux parties :

- La matrice de masse, notée $M$ de coefficient $M(I,J)$ donné par
$$
M(I,J) = \int\_{K}\mphi{J}(\xx)\overline{\mphi{I}(\xx)}\diff\xx.
$$
- Matrice de rigidité, notée $D$ de coefficient $D(I,J)$ donné par
$$
D(I,J)=  \int\_{K}\nabla\mphi{J}(\xx)\overline{\nabla\mphi{I}(\xx)}\diff\xx.
$$

{{% alert note%}}
Deux remarques :

- La matrice $M$ représente l'opérateur identité dans la base des éléments finis (ce n'est pas la matrice diagonale remplie de 1...).
- Dans la littérature, cette matrice est souvent notée $K$, mais nous l'appelons $D$ pour éviter toute confusion avec les triangles, nommés $K$ également.
{{% /alert %}}

## Passage à l'élément de référence

### Transformation linéaire

Une méthode utilisée couramment pour calculer les coefficients des matrices de masse et de rigidité, est  de ramener les calculs d'intégrale portant sur un triangle quelconque $\tri{p}$ au calcul d'une intégrale sur un *triangle de référence* $\Kh$. Ce dernier est souvent choisi comme étant le triangle rectangle unitaire de sommets $\sh\_{1}=(0,0)$, $\sh\_{2}=(1,0)$ et $\sh\_{3}=(0,1)$, ordonnés dans le sens trigonométrique. Sur le triangle de référence $\Kh$, nous construisons des fonctions *d'interpolation géométrique*, $(\psih\_i)\_{1\leq i \leq 3}$ :
$$
\forall i,j=1,2,3, \quad \psih\_i(\sh\_{j}) = \deltaij,
$$
qui sont les mêmes que les fonctions de forme $\Pun$. Nous pouvons les calculer analytiquement :
$$
\left\\{
  \begin{array}{l}
  \psih\_{1}(\xi,\eta) = 1 - \xi - \eta\\\\\\
  \psih\_{2}(\xi,\eta) = \xi\\\\\\
  \psih\_{3}(\xi,\eta) = \eta\\\\\\
  \end{array}
\right.
$$
Tout triangle $\tri{p}$ est ensuite obtenu une transformation bijective linéaire $\TK{p}$ du triangle de référence. Une des transformations possibles est celle-ci
$$
\begin{array}{r c c l}
  \TK{p}\colon & \Kh & \to & \tri{p}\\\\\\
  & (\xi,\eta) & \mapsto & \TK{p}(\xi,\eta) = (x,y) = \psih\_{1}(\xi,\eta) \sumitK{p}{1} + \psih\_{2}(\xi,\eta) \sumitK{p}{2} + \psih\_{3}(\xi,\eta) \sumitK{p}{3},
\end{array}
$$
dont la matrice Jacobienne est la suivante
$$
\JK{p} = 
\left(
  \begin{array}{c c}
    \dsp\frac{\partial x}{\partial \xi} &\dsp \frac{\partial x}{\partial \eta} \\\\\\
    \dsp\frac{\partial y}{\partial \xi} &\dsp \frac{\partial y}{\partial \eta}
  \end{array}
\right) =
\left(
  \begin{array}{c c}
    \xK{p}{2} - \xK{p}{1} & \xK{p}{3} - \xK{p}{1}\\\\\\
    \yK{p}{2} - \yK{p}{1} & \yK{p}{3} - \yK{p}{1}
  \end{array}
\right)
$$
Le déterminant de cette matrice vaut
$$
\det(\JK{p}) = (\xK{p}{2}-\xK{p}{1})(\yK{p}{3}-\yK{p}{1}) - (\xK{p}{3}-\xK{p}{1})(\yK{p}{2}-\yK{p}{1}).
$$
En valeur absolue, cela correspond à 2 fois l'aire du triangle $\tri{p}$. Le déterminant est donc non nul puisque le triangle n'est pas dégénéré et la transformation $\TK{p}$ est donc bien inversible. Une illustration de la transformation $\TK{p}$ est présentée sur la figure ci-dessous.

{{< figure src="../ref.svg" title="Passage du triangle de référence $\Kh$ vers un triangle $\tri{p}$ par la transformation $\TK{p}$." numbered="true" >}}

{{% alert note%}}
Nous avons choisi ici une transformation linéaire du triangle $\Kh$ au triangle $\tri{p}$. Si nous souhaitons obtenir des éléments courbes, nous devons alors prendre une transformation, par exemple, quadratique.
{{% /alert %}}

### Contribution de la matrice de masse

Toute fonction de forme $\mphiK{p}{j}$ est ainsi définie à partir de l'élément de référence par la relation suivante :
$$
\mphiK{p}{j}(x,y) = \mphiK{p}{j}(\TK{p}(\xi,\eta)) = \varphih\_{j}(\xi,\eta).
$$
La fonction $\varphih\_{j} = \mphiK{p}{j}\circ\TK{p}$ peut être vue comme la transformée de la fonction de forme $\mphiK{p}{j}$ dans le triangle de référence. La contribution de la matrice de masse s'écrira alors
\begin{equation}\label{eq:intMasse}
\int\_{\tri{p}} \mphiK{p}{j}\overline{\mphiK{p}{i}} \diff(x,y) = \det(\JK{p})\int\_{\Kh} \varphih\_{j}\overline{\varphih\_{i}} \diff (\xi,\eta).
\end{equation}

À bien y regarder, seul le déterminant dépend du triangle $\tri{p}$ considéré, le reste étant calculable *a priori*.

### Contribution de la matrice de rigidité

Pour calculer les dérivées partielles selon $x$ et $y$ de $\varphih\_{j}$, nous utilisons la dérivée de fonction composée :
$$
\left(
  \begin{array}{c}
    \dsp \frac{\partial \mphiK{p}{j}}{\partial x}\\\\\\
    \dsp \frac{\partial \mphiK{p}{j}}{\partial y}
  \end{array}
\right) = 
\left(
  \begin{array}{c c}
    \dsp \frac{\partial \xi}{\partial x} & \dsp \frac{\partial \eta}{\partial x}\\\\\\
    \dsp \frac{\partial \xi}{\partial y} & \dsp \frac{\partial \eta}{\partial y}
  \end{array}
\right)
\left(
  \begin{array}{c}
    \dsp \frac{\partial \varphih\_{j}}{\partial \xi}\\\\\\
    \dsp \frac{\partial \varphih\_{j}}{\partial \eta}
  \end{array}
\right)
$$
En notant $\BK{p}$ la matrice de passage, nous avons
$$
\nabla\_{x,y}\mphiK{p}{j}(x,y) = \BK{p}\nabla\_{\xi,\eta}\varphih\_{j}(\xi,\eta).
$$
Pour obtenir la matrice $\BK{p}$, nous utilisons la Jacobienne $\JK{p}$, en remarquant que :
$$
  \left(
    \begin{array}{c}
      \dsp \frac{\partial \varphih\_{j}}{\partial \xi}\\\\\\
      \dsp \frac{\partial \varphih\_{j}}{\partial \eta}
    \end{array}
  \right)
  =
  \left(
    \begin{array}{c c}
      \dsp \frac{\partial x}{\partial \xi} & \dsp \frac{\partial y}{\partial \xi}\\\\\\
      \dsp \frac{\partial y}{\partial \eta} & \dsp \frac{\partial y}{\partial \eta}
    \end{array}
  \right)
  \left(
    \begin{array}{c}
      \dsp \frac{\partial \mphiK{p}{j}}{\partial x}\\\\\\
      \dsp \frac{\partial \mphiK{p}{j}}{\partial y}
    \end{array}
  \right).
$$
Autrement dit, nous avons
$$
\nabla\_{\xi,\eta}\varphih\_{j}(\xi,\eta) = (\JK{p})^T\nabla\_{x,y}\mphiK{p}{j}(x,y).
$$
Nous en déduisons que $\BK{p} = (\JK{p}^T)^{-1}$, en particulier, dans le cas d'une transformation linéaire de triangle, nous obtenons :
$$
\BK{p} =
\frac{1}{\det(\JK{p})}
  \left(
  \begin{array}{c c}
    \yK{p}{3}-\yK{p}{1} & \yK{p}{1}-\yK{p}{2}\\\\\\
    \xK{p}{1}-\xK{p}{3} & \xK{p}{2}-\xK{p}{1}
  \end{array}
\right).
$$
Au final, comme $X\cdot Y = X^TY$, nous obtenons
\begin{equation}\label{eq:intRigidite}
  \int\_{\tri{p}} \nabla\mphiK{p}{j}\cdot\overline{\nabla\mphiK{p}{i}} \diff(x,y) =
\int\_{\tri{p}} (\nabla\mphiK{p}{j})^T\overline{\nabla\mphiK{p}{i}} \diff(x,y)
  = \det(\JK{p})\int\_{\Kh} (\nabla\varphih\_{j})^T  (\BK{p}^T \overline{\BK{p}})\overline{\nabla\varphih\_{i}} \diff (\xi,\eta).
\end{equation}
La matrice $\BK{p}$ étant réelle, nous pouvons supprimer la conjugaison portant sur $\BK{p}$.

## Cas des éléments finis P<sub>1</sub>-Lagrange

### Fonctions de forme sur le triangle de référence 

Pour les éléments finis $\Pun$-Lagrange, les fonctions $\varphih\_{j} = \mphiK{p}{j}\circ\TK{p}$ sont les fonctions de forme $\Pun$ telles que
$$
\varphih\_{j}(\sh\_{i}) = \deltaij.
$$

{{% alert warning %}}
L'indice $j=1,2,3$ est maintenant *local* au triangle $\tri{p}$ ! 
{{% /alert %}}

La fonction de forme $\mphiK{p}{j}$ correspond à la fonction de forme basée sur le $j^{ème}$ sommet de $\tri{p}$. Pour éviter tout problème de "rebroussement", nous avons imposé à $\tri{p}$ et $\Kh$ la même orientation et donc "l'ordre" des sommets.

Autrement dit, les fonctions de forme $\varphih\_{j}$ sont **identiques** aux fonctions d'interpolation géométrique $\psih\_{j}$. Nous parlons alors d'éléments finis **isoparamétriques**. Les fonctions $\varphih\_{j}$ sont calculables analytiquement, ainsi que leurs dérivées partielles :
$$
\left\\{
  \begin{array}{l}
    \varphih\_{1}(\xi,\eta) = 1 - \xi - \eta\\\\\\
    \varphih\_{2}(\xi,\eta) = \xi\\\\\\
    \varphih\_{3}(\xi,\eta) = \eta
  \end{array}
\right.
$$
$$
\nabla\_{\xi,\eta}\varphih\_{1} =
\left(
  \begin{array}{l}
    -1\\\\\\
    -1
  \end{array}
\right)
,
\quad
\nabla\_{\xi,\eta}\varphih\_{2} =
\left(
  \begin{array}{l}
    1\\\\\\
    0
  \end{array}
\right),
\quad
\nabla\_{\xi,\eta}\varphih\_{3} =
\left(
  \begin{array}{l}
    0\\\\\\
    1
  \end{array}
\right).
$$


### Contributions élémentaires de la matrice de masse

En prenant l'expression \eqref{eq:intMasse}, l'expression du déterminant de $\JK{p}$ ainsi que des fonctions de forme, nous obtenons les formules suivantes.
{{% thm lemma %}}
  Pour $i,j=1,2,3$, avec $i=j$ :
$$
\int\_{\tri{p}} \mphiK{p}{j}\overline{\mphiK{p}{j}} \diff(x,y)  =\frac{\det(\JK{p})}{12},
$$
et pour $j\neq i$:
$$
\int\_{\tri{p}} \mphiK{p}{j}\overline{\mphiK{p}{i}} \diff(x,y)  =\frac{\det(\JK{p})}{24}.
$$
{{% /thm %}}
{{% thm proof %}}
Nous utilisons l'expression suvante
$$
\int\_{\tri{p}} \mphiK{p}{j}\overline{\mphiK{p}{i}} \diff(x,y) = \det(\JK{p})\int\_{\Kh} \varphih\_j\overline{\varphih\_i} \diff (\xi,\eta).
$$
Prenons tout d'abord le cas $i=j=3$, soit $\varphih\_2(\xi,\eta) = \eta$. Dans ce cas :
$$
\int\_{\Kh} \abs{\eta}^2 \diff (\xi,\eta) = \int\_0^1\int\_0^{1-\xi} \abs{\eta}^2 \diff\eta\diff\xi = \frac{1}{3}\int\_0^1(1-\xi)^3\diff\xi = \frac{1}{12}.
$$
Les calculs sont similaires pour $j=1$ et $j=2$.

Prenons maintenant $i\neq j$, par exemple $i=3$ et $j=2$ :
$$
  \int\_{\Kh} \xi\eta \diff (\xi,\eta) = \int\_0^1\left(\int\_0^{1-\xi} \eta \diff\eta\right)\xi\diff\xi
  =  \frac{1}{2}\int\_0^1(1-\xi)^2\xi\diff\xi  
  =  \frac{1}{2}\left[ \frac{1}{2} - \frac{2}{3} +\frac{1}{4}\right] =\frac{1}{24}.
$$
Les calculs sont similaires avec $i=1$ et $j=2,3$.
{{% /thm %}}
La matrice de masse élémentaire $M^{\tri{p}}$ du triangle $\tri{p}$ est donc donnée par
$$
M^{\tri{p}} = \frac{\det(\JK{p})}{24}\left(
  \begin{array}{c c c}
    2 & 1 & 1\\\\\\
    1 & 2 & 1\\\\\\
    1 & 1 & 2
  \end{array}
\right).
$$

### Contributions élémentaires de la matrice de rigidité

Bien que nous puissions obtenir une expression analytique dans le cas d'un triangle quelconque, nous nous en tenons ici au triangle de référence.
{{% thm lemma %}}
Dans le triangle de référence, la matrice de rigidité $\hat{D}$ vaut
$$
\hat{D} =  \frac{1}{2}
  \left(
    \begin{array}{l l c}
      2 & -1 & -1 \\\\\\
      -1 & 1 & 0 \\\\\\
      -1 & 0 & 1
    \end{array}
  \right)
$$
{{% /thm %}}
{{% thm proof %}}
  Clairement, la matrice est symétriques. Nous avons :
  $$\hat{D}\_{1,1} =
    \int\_{\Kh}\nabla\varphih\_1\cdot\overline{\nabla\varphih\_1} \diff (\xi,\eta) =
    \int\_{\Kh} (-1,-1)\left(\begin{array}{l}-1\\\\\\ -1\end{array}\right) \diff (\xi,\eta) =
    2 \int\_{\Kh} \diff(\xi,\eta) = 1.
  $$
  $$\hat{D}\_{2,2} =
    \int\_{\Kh}\nabla\varphih\_2\cdot\overline{\nabla\varphih\_2} \diff (\xi,\eta) =
    \int\_{\Kh} (1,0)\left(\begin{array}{l}1\\\\\\ 0\end{array}\right) \diff (\xi,\eta) =
     \int\_{\Kh} \diff(\xi,\eta) = \frac{1}{2} =\hat{D}\_{3,3}. 
  $$
  $$\hat{D}\_{1,2} =
    \int\_{\Kh}\nabla\varphih\_1\cdot\overline{\nabla\varphih\_2} \diff (\xi,\eta) =
    \int\_{\Kh} (-1,-1)\left(\begin{array}{l}1\\\\\\ 0\end{array}\right) \diff (\xi,\eta) =
     -\int\_{\Kh} \diff(\xi,\eta) = -\frac{1}{2}.
  $$
  $$\hat{D}\_{1,3} =
    \int\_{\Kh}\nabla\varphih\_1\cdot\overline{\nabla\varphih\_2} \diff (\xi,\eta) =
    \int\_{\Kh} (-1,-1)\left(\begin{array}{l}0\\\\\\ 1\end{array}\right) \diff (\xi,\eta) =
     -\int\_{\Kh} \diff(\xi,\eta) = -\frac{1}{2}.
  $$
  $$\hat{D}\_{2,3} =
    \int\_{\Kh}\nabla\varphih\_1\cdot\overline{\nabla\varphih\_2} \diff (\xi,\eta) =
    \int\_{\Kh} (1,0)\left(\begin{array}{l}0\\\\\\ 1\end{array}\right) \diff (\xi,\eta) =
    0.
  $$
{{% /thm %}}


## Quadratures

### Sur un triangle

En général, nous ne pouvons pas calculer analytiquement les intégrales. Par exemple, pour les termes du membre de droite, nous devons calculer :
$$
\int\_{\tri{p}}f(\xx)\overline{\mphiK{p}{i}(\xx)}\diff \xx.
$$
Sauf pour certaines fonctions $f$ particulières, nous ne disposerons certainement pas de formules explicites pour ce terme. En pratique, nous passons à l'éléments de référence et nous approchons l'intégrale à l'aide d'une formule de quadrature :
$$
\begin{array}{r l}
\dsp \int\_{\tri{p}}f(\xx)\overline{\mphiK{p}{i}(\xx)}\diff \xx &=
\dsp \det(\JK{p})\int\_{\Kh}f(\xx(\xi,\eta))\overline{\varphih\_i(\xi,\eta)}\diff (\xi,\eta) \\\\\\
& \dsp \simeq \det(\JK{p})\sum\_{m=1}^M\omega\_m f(\xx(\xi\_m,\eta\_m))\overline{\varphih(\xi\_m,\eta\_m)}.
\end{array}
$$
Les points $(\xi\_m,\eta\_m)$ sont appelés *points de quadrature* (parfois *Points de Gauss*, même si la règle de quadrature n'est pas de Gauss) et les quantités $\omega\_m\in\Rb$ les *poids* associés. Notons que le point $\xx\_m = \xx(\xi\_m,\eta\_m)$ s'obtient par l'expression vue précédemment :
$$
\xx\_m = \sum\_{i=1}^3\sumitK{p}{i}\psih\_i(\xi\_m,\eta\_m).
$$
Nous présentons ici deux règles de quadrature pour l'intégration sur $\Kh$ d'une fonction $g$ quelconque (intégrale) : $\int\_{\Kh}\gh(\xx)\diff\xx$. La première règle est exacte pour des polynômes de degré 1, la deuxième pour des polynômes de degré 2 (règles de Hammer) :

| $\xi\_m$ | $\eta\_m$ | $\omega\_m$ |Degré de précision|
| -------- | --------  | --------   | ---------------- |
|    1/3 | 1/3 | 1/6 | 1 |
|    1/6 | 1/6 | 1/6 | 2 |
|    4/6 | 1/6 | 1/6 |   |
|    1/6 | 4/6 | 1/6 |   |

###  Sur une arrête

Dans ce cas, nous utilisons aussi une arrête de référence $[0,1]$ ainsi qu'une transformation, nous ne détaillons pas les calculs et fournissons uniquement deux formules de quadrature sur le segment de référence, exacte pour des polynômes de degré 1 :

- Point du milieu : $\dsp \int\_0^1\gh(x)\diff x \simeq \gh(\frac{1}{2})$
- Trapèze :  $\dsp \int\_0^1\gh(x)\diff x \simeq \frac{1}{2}\left(\gh(0) + \gh(1)\right)$

{{% alert note %}}
Les formules de quadrature ont évidemment un impact sur la qualité de l'approximation, toutefois, elles jouent un rôle relativement mineur par rapport aux autres approximations (et l'on peut choisir plus de points d'intégration !).
{{% /alert %}}
