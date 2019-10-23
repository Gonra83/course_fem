+++
title = "2. Formules d'intégration"

date = 2018-09-09T00:00:00
# lastmod = 2018-09-09T00:00:00

draft = false  # Is this a draft? true/false
toc = true  # Show table of contents? true/false
type = "docs"  # Do not modify.

math = true
weight = 40
diagram = false
#markup = "mmark"

edit_page = {repo_url = "https://github.com/Bertbk/course_fem", repo_branch = "master", submodule_dir="content/course/fem/"}

[git]
  icon = "github"
  repo = "https://github.com/Bertbk/course_fem"
  submodule_dir = "content/course/fem/"


# Add menu entry to sidebar.
[menu.fem]
  parent = "II. Formulations Variationnelles"
  name = "2. Formules d'intégration"
  weight = 20


+++

$\newcommand{\Cb}{\mathbb{C}}$
$\newcommand{\Rb}{\mathbb{R}}$
$\newcommand{\PS}[2]{\left(#1,#2\right)}$
$\newcommand{\norm}[1]{\left\\|#1\right\\|}$
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
$\newcommand{\divv}{{\rm div}}$
$\newcommand{\rot}{\mathbf{rot}}$
$\newcommand{\phii}{\phi\_i}$
$\newcommand{\yN}{y\_N}$

## Domaines

Dans ce cours, les domaines $\Omega$ seront des ouverts **bornés** de $\Rb^d$ et **réguliers**, c'est-à-dire au moins de classe $\Cscr^1$. La quantité $d= 2,3$ est la dimension du problème considéré.  Remarquons que nombreux résultats d'intégration que nous énoncerons restent vrais pour un domaine à bord polygonal, et retenons surtout que les domaines considérés ne comportent ni "fissure" ni point de rebroussement, et leur frontière est "régulière", comme illustré sur les figures ci-dessous.


### Régularité

{{< thm/thm type="definition" label="def:ouvert_regulier" >}}
Un ouvert borné $\Omega$ de $\Rb^d$ est régulier de classe $\Cscr^k$ ($k\geq 1$) si en chaque point $\xx$ de $\partial\Omega$, il existe un repère orthonormé $\mathcal{R}$ de $\Rb^d$ $\xx$ (dans lequel un point est noté $\yy = (\yy',y\_d) \in\Rb^{d-1}\times\Rb$), un cylindre ouvert $Q(\delta, \delta_d)$ contenant $\xx$ :
$$
Q(\delta, \delta_d) = \left\\{(\yy',y\_d)\in\Rb^d \text{ tel que } \\|\yy'\\|<\delta \text{ et } y\_d < \delta\_d\right\\}
$$
et une fonction $\phi\colon B(\mathbf{O}, \delta)\subset\Rb^{d-1}\to\Rb^d$ de classe $\Cscr^k$, tel que :

1. $Q(\delta, \delta_d)\cap\Omega = \left\\{(\yy',y\_d)\in Q(\delta,\delta_d) \text{ tel que } y\_d>\phi(\yy')\right\\}$
2. $Q(\delta, \delta_d)\cap\partial\Omega = \left\\{(\yy',y\_d)\in Q(\delta,\delta_d) \text{ tel que } y\_d = \phi(\yy')\right\\}$
{{< /thm/thm >}}

Cela signifie que $\Omega$ est localement [l'épigraphe](https://fr.wikipedia.org/wiki/%C3%89pigraphe\_\(math%C3%A9matiques\)) d’une fonction de classe $\Cscr^k$ : $\Omega$ est (localement) toujours situé du "même côté" que le graphe de $\phi$ :


{{< figure src="../img/def_ouvert.svg" title="Illustration de la définition d'un ouvert régulier." numbered="true" >}}


Cette définition implique, par exemple, que les points de rebroussement ne sont pas autorisés ainsi que les fissures ($\Omega$ n'est pas toujours du même côté que son bord).



{{< figure src="../img/regulier.svg" title="Ouvert régulier (à gauche), avec point de rebroussement (milieu) et \"fissure\" (à droite). Les deux derniers ouverts ne sont pas réguliers" numbered="true" >}}


### Normale unitaire sortante $\nn$

La frontière de $\Omega$ étant toujours supposée au moins de classe $\Cscr^1$, nous pouvons définir le vecteur unitaire normale $\nn=[n_1,\ldots,n_d]^T$ en tout point du bord. Par convention, $\nn$ pointe toujours en dehors de $\Omega$ (on dit que $\nn$ est *sortante*).

Avec {{< thm/ref "def:ouvert_regulier" >}}la définition des ouverts réguliers{{< /thm/ref>}}, nous disposons de l'expression explicite de $\nn(\yy', \phi(y_d))$ dans le repère local par la formule suivante :

$$
\nn(\yy',\phi(y_d)) = \frac{(\nabla \phi(\yy'), -1)^T}{\\|(\nabla \phi(\yy'), -1)^T\\|}.
$$

{{< figure src="../img/normal.svg" title="Normale unitaire $\nn$ extérieure sortante à $\Omega$" numbered="true" >}}


## Formules de Green

Nous admettrons le théorème suivant, résultat central dans l'analyse des EDP.

{{< thm/thm theorem "de Green" >}}
Soit $\Omega$ un ouvert borné, régulier de classe $\Cscr^1$ de $\Rb^d$. Si $w$ est une fonction de $\Cscr^1(\overline{\Omega})$ alors elle vérifie la formule de Green
$$
\int\_{\Omega}\frac{\partial w}{\partial x\_i}(x)\diff x = \int\_{\partial \Omega}w(x)n\_i(x)\diff s,
$$
où $n\_i$ est la $n^{ème}$ composante de la normale extérieure $\nn$ à $\Omega$.
{{< /thm/thm >}}

De ce Théorème fondamental découlent des Corollaires qui nous seront pratiques. Par exemple, si l'on prend $w=uv$ dans la formule précédente, il vient :

{{< thm/thm corollary "Formule d'intégration par parties" >}}
Soit $\Omega$ un ouvert borné, régulier de classe $\Cscr^1$. Soit $u$ et $v$ deux fonctions de $\Cscr^1(\overline{\Omega})$, alors elles vérifient la formule d'intégration par parties
$$
\int\_{\Omega}\frac{\partial u}{\partial x\_i}(x)v(x)\diff x =
-\int\_{\Omega}u(x)\frac{\partial v}{\partial x\_i}(x)\diff x
+ \int\_{\partial\Omega}u(x)v(x)n\_i(x)\diff s.
$$
{{< /thm/thm >}}

En supposant $u\in\Cscr^2(\overline{\Omega})$, soit à peine plus régulier, nous pouvons appliquer le corollaire précédent pour obtenir :

{{< thm/thm corollary "Formule de Green" >}}
Soit $\Omega$ un ouvert borné, régulier de classe $\Cscr^1$ et soient deux fonctions $u\in\Cscr^2(\overline{\Omega})$ et $v\in\Cscr^1(\overline{\Omega})$. Elles vérifient alors la Formule de Green :
$$
\int\_{\Omega}\Delta u(x)v(x)\diff x =
-\int\_{\Omega}\nabla u(x)\cdot \nabla v(x) \diff x
+ \int\_{\partial\Omega}\frac{\partial u}{\partial \nn}(x)v(x)\diff s,
$$
où $\displaystyle\nabla u = \left(\frac{\partial u}{\partial x\_i}\right)\_{1\leq i \leq d}$ est le vecteur gradient de $u$, et $\displaystyle\frac{\partial u}{\partial \nn} = \nabla u \cdot \nn$ est la **dérivée normale** de $u$ sur le bord $\partial\Omega$.
{{< /thm/thm >}}


## Autres formules d'intégration

Nous considérons ici $\Omega$ un ouvert borné et régulier de classe $\Cscr^1$. On supposera $u,v$ deux fonctions scalaires et $\boldsymbol{\phi}=(\phi\_1, \phi\_2, \phi\_3)^T$ et $\boldsymbol{\psi}=(\psi\_1, \psi\_2, \psi\_3)^T$ deux fonctions vectorielles, toutes suffisamment dérivables à chaque fois. Nous rappelons les opérateurs de divergence $\divv$, du rotationnel $\rot$ et le produit vectoriel $\times$ :
$$
\divv(\boldsymbol{\phi}) = \sum\_{i=1}^d \frac{\partial \phi\_i}{\partial x\_i},
$$
$$
\rot \boldsymbol{\phi} = \left(
  \begin{array}{c}
  \displaystyle\frac{\partial \phi\_3}{\partial x\_2} - \frac{\partial \phi\_2}{\partial x\_3}\\\\\\
  \displaystyle\frac{\partial \phi\_1}{\partial x\_3} - \frac{\partial \phi\_3}{\partial x\_1}\\\\\\
  \displaystyle\frac{\partial \phi\_2}{\partial x\_1} - \frac{\partial \phi\_1}{\partial x\_2}
  \end{array}
\right),\qquad
\boldsymbol{\phi}\times \boldsymbol{\psi} = 
\left(
  \begin{array}{l}
  \phi\_2\psi\_3 - \phi\_3\psi\_2\\\\\\
  \phi\_3\psi\_1 - \phi\_1\psi\_3\\\\\\
  \phi\_1\psi\_2 - \phi\_2\psi\_1\\\\\\
  \end{array}
\right).
$$


{{% alert exercise %}}
À l'aide de la formule de Green, montrez les formules suivantes (vous pouvez développer les expressions...) :


- **La formule de Stokes :**

$$
\int\_{\Omega}\divv \boldsymbol{\phi}. v\;\diff x = -
\int\_{\Omega}\boldsymbol{\phi}\cdot\nabla v\;\diff x +
\int\_{\partial\Omega}(\boldsymbol{\phi}\cdot\nn)v\;\diff s
$$

- **La formule du rotationnel :**

$$
\int\_{\Omega}\rot \boldsymbol{\phi} \cdot \boldsymbol{\psi}\;\diff x -
\int\_{\Omega} \boldsymbol{\phi}\cdot\rot \boldsymbol{\psi} \;\diff x =-
\int\_{\partial\Omega}(\boldsymbol{\phi}\times\nn)\cdot \boldsymbol{\psi} \;\diff s
$$

{{% /alert %}}

<!-- 
\begin{correction}
  \begin{enumerate}
  \item Nous pouvons calculer direction par direction (l'inversion somme-intégrale est rendue possible puisque $\Omega$ est borné et la somme finie) :
    $$
      \int\_{\Omega}\Delta u(x)v(x)\diff x =
      \int\_{\Omega}\sum_{j=1}^3\frac{\partial^2 u}{\partial x_j^2}(x) v(x) \diff x =
      \sum_{j=1}^3\int\_{\Omega}\frac{\partial^2 u}{\partial x_j^2}(x) v(x) \diff x.
    $$
Nous appliquons ensuite la formule de Green et re-regroupons les sommes :
$$
  \begin{array}{r c l}
\dsp      \sum_{j=1}^3\int\_{\Omega}\frac{\partial^2 u}{\partial x_j^2}(x) v(x) \diff x
      &=&
    \dsp  \sum_{j=1}^3\left[-\int\_{\Omega}\frac{\partial u}{\partial x_j}(x)\frac{\partial v}{\partial x_j}(x) \diff x
      +\int\_{\partial\Omega}\frac{\partial u}{\partial x_j}(x)v(x)n_j(x) \diff x\right]\\
\dsp     & =&
\dsp      -\int\_{\Omega}\sum_{j=1}^3\frac{\partial u}{\partial x_j}(x)\frac{\partial v}{\partial x_j}(x) \diff x
              +\int\_{\partial\Omega}\sum_{j=1}^3\left[\frac{\partial u}{\partial x_j}(x)n_j(x)\right]v(x) \diff x\\
      & =&\dsp -\int\_{\Omega}\nabla u(x)\cdot\nabla v(x) \diff x
           +\int\_{\partial\Omega}(\nabla u(x)\cdot \nn(x)) v(x)n_j(x) \diff x.
  \end{array}
    $$
    Comme $\nabla u(x)\cdot\nn(x) = \dn u(x)$, le résultat est démontré.
  \item Nous appliquons la même idée :
    $$
      \begin{array}{>{\dsp}r c >{\dsp}l}
        \int\_{\Omega}\divv \sigma(x) \phi(x)\diff x
        &=& \int\_{\Omega}\sum_{j=1}^3\frac{\partial  \sigma_j}{\partial x_j}(x) \phi(x)\diff x \\
        &=&  \sum_{j=1}^3 \int\_{\Omega}\frac{\partial  \sigma_j}{\partial x_j}(x) \phi(x)\diff x.
      \end{array}
    $$
    À l'aide de la formule de Green, nous obtenons
    $$
      \begin{array}{>{\dsp}r c >{\dsp}l}
        \sum_{j=1}^3 \int\_{\Omega}\frac{\partial  \sigma_j}{\partial x_j}(x) \phi(x)\diff x
        & = & \sum_{j=1}^3 \left[-\int\_{\Omega}\sigma_j(x) \frac{\partial\phi}{\partial x_j}(x)\diff x
              +\int\_{\partial\Omega}\sigma_j(x) \phi(x) n_j(x)\diff s\right]\\
        & = &  -\int\_{\Omega} \sum_{j=1}^3\left[\sigma_j(x)\frac{\partial\phi}{\partial x_j}(x)\right]\diff x   +\int\_{\partial\Omega} \sum_{j=1}^3\left[\sigma_j(x) n_j(x)\right]\phi(x) \diff s\\
        & = &  -\int\_{\Omega} \sigma(x)\cdot \nabla\phi(x)\diff x
              +\int\_{\partial\Omega} (\sigma(x) \cdot\nn(x))\phi(x) \diff s.\\
      \end{array}
    $$
  \item Pour simplifier, nous notons $\partial_j = \frac{\partial}{\partial x_j}$ :
    $$
      \begin{array}{>{\dsp}r c >{\dsp}l}
        \int\_{\Omega}\rot \phi \cdot \psi\diff x
        & = & \int\_{\Omega}\left[\partial_2\phi\_3 - \partial_3\phi\_2\right]\psi_1
              +\left[\partial_3\phi\_1 - \partial_1\phi\_3\right]\psi_2
              +\left[\partial_1\phi\_2 - \partial_2\phi\_1\right]\psi_3\diff x\$$0.2cm]
        & = & - \int\_{\Omega} \phi\_3\partial_2\psi_1 - \phi\_2\partial_3\psi_1
              +\phi\_1\partial_3\psi_2 - \phi\_3\partial_1\psi_2
              +\phi\_2\partial_1\psi_3 - \phi\_1\partial_2\psi_3\diff x\$$0.2cm]
        &   & \quad+ \int\_{\partial\Omega}\left[\phi\_3n_2 - \phi\_2n_3\right]\psi_1
              +\left[\phi\_1n_3 - \phi\_3n_1\right]\psi_2
              +\left[\phi\_2n_1 - \phi\_1n_2\right]\psi_3
              \diff s\$$0.2cm]
        & = & - \int\_{\Omega}
              \left[\partial_3\psi_2-\partial_2\psi_3\right]\phi\_1+
              \left[\partial_1\psi_3-\partial_3\psi_1\right]\phi\_2+
              \left[\partial_2\psi_1-\partial_1\psi_2\right]\phi\_3\$$0.2cm]
        &   & \quad+ \int\_{\partial\Omega}(\phi\times\nn)\cdot\psi
              \diff s\$$0.2cm]
        & = & \int\_{\Omega} \phi\cdot\rot \psi \diff x + \int\_{\partial\Omega}(\phi\times\nn)\cdot\psi
              \diff s\\
      \end{array}
    $$
    
  \end{enumerate}
\end{correction} -->