+++
title = "Formulations variationnelles"

date = 2018-09-09T00:00:00
# lastmod = 2018-09-09T00:00:00

draft = false  # Is this a draft? true/false
toc = true  # Show table of contents? true/false
type = "docs"  # Do not modify.

math = true
weight = 50
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
  name = "Formulations variationnelles"
  weight = 30

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
$\newcommand{\conj}[1]{\overline{#1}}$
$\newcommand{\dn}{\partial_\nn}$
$\newcommand{\supp}{\mathrm{supp}}$
$\newcommand{\enstq}[2]{\left\\{#1 \mathrel{}\middle|\mathrel{}#2\right\\}}$

## Problème modèle

Nous considérons le problème modèle suivant, avec $\Omega$ un ouvert borné régulier de $\Rb^d$ et $f\in\Cscr^0(\overline{\Omega})$ :

\begin{equation}
\left\\{\begin{array}{r c l l}
-\Delta u + u & = & f & \text{ dans } \Omega,\\\\\\
\dn u & = & 0 & \text{ sur } \Gamma.
\end{array}\right.
\label{eq:pbmodel}
\end{equation}

Cette équation est parfois appelée *positive Helmholtz equation*.


Pour résoudre ce problème, nous apprécierions grandement que $u$ soit de classe $\Cscr^2(\overline{\Omega})$ *(pour pouvoir la dériver deux fois)*. Comme nous le verrons plus loin, cette condition sur la régularité pose problème. 


## Fonctions tests

Dans un premier temps, nous ne nous soucions guère de la régularité et nous proposons de multiplier l'équation par (le conjugué d')une **fonction test** $v\in\Cscr^1(\overline{\Omega})$, d'intégrer sur $\Omega$ et d'utiliser les [formules de Green]({{< relref "fv_formules_integration.md#formules-de-green">}}) :

$$
\begin{array}{ r r c l}
& \dsp\int\_{\Omega} -\Delta u.\conj{v}\;\diff x + \int\_{\Omega} u.\conj{v}\;\diff x = \int\_{\Omega}f\conj{v}\;\diff x  \\\\\\
\implies&  \dsp\int\_{\Omega} \nabla u\cdot \conj{\nabla v} \;\diff x  - \int\_{\partial\Omega} \underbrace{(\dn u)}_{=0} \conj{v} \;\diff x + \int\_{\Omega} u.\conj{v}\;\diff x = \int\_{\Omega}f\conj{v}\;\diff x \\\\\\
\implies&\dsp \int\_{\Omega} \nabla u\cdot \conj{\nabla v} \;\diff x   + \int\_{\Omega} u.\conj{v}\;\diff x = \int\_{\Omega}f\conj{v}\;\diff x
\end{array}
$$

Comme $v$ est arbitraire, l'égalité ci-dessous vaut pour tout $v$ :

\begin{equation}
\forall v \in \Cscr^1(\overline{\Omega}), \qquad
\int\_{\Omega} \nabla u \cdot \conj{\nabla v} \;\diff x
+ \int\_{\Omega} u \cdot \conj{ v} \;\diff x
= \int\_{\Omega} f \conj{v} \;\diff x.
\label{eq:FVpbmodel}
\end{equation}

Dans le cas où $u\in\Cscr^2(\overline{\Omega})$, il est clair que $u$ est solution de \eqref{eq:pbmodel} implique que $u$ est solution de \eqref{eq:FVpbmodel}. La grande question étant : la réciproque est-elle vraie ? La réponse, sans surprise, est oui. Nous devons cependant introduire un nouvel espace de fonctions.


{{% alert note %}}
Un des grands intérêts de l'expression \eqref{eq:FVpbmodel} est que **seules les dérivées premières** de $u$ apparaissent, pas les secondes ! Autrement dit, si on souhaite résoudre \eqref{eq:FVpbmodel}, chercher $u$ dans $\Cscr^1(\overline{\Omega})$ suffirait. C'est pour cela qu'elle nous intéresse...
{{% /alert %}}

## Fonctions infiniment dérivables et à support compact

{{< thm/thm definition >}}
Soit une fonction $w\colon\Omega\to\Cb$, son **support** $\supp$ est alors défini par :
$$
\supp(w) := \overline\{\enstq\{x\in \Omega\}\{w(x) \neq 0\}\}.
$$
{{< /thm/thm >}}

{{< thm/thm definition >}}
L'espace $\Cscr^{\infty}\_c(\Omega)$ est celui des fonctions $\Cscr^{\infty}$ sur $\Omega$ à support compact dans $\Omega$. 
{{< /thm/thm >}}
{{% alert note %}}
Remarquons que pour une fonction $\Cscr^{\infty}\_c(\Omega)$, son support est alors un fermé borné de $\Omega$ et que, par continuité, elle est nulle sur le bord de $\Omega$.
{{% /alert %}}


{{< thm/thm lemma >}}
Soit $\Omega$ un ouvert de $\Rb^d$, g une fonction continue dans $\Omega$. Si pour toute fonction $\varphi$ de $\Cscr^{\infty}(\Omega)$ à support compact dans $\Omega$, on a
$$
\int\_{\Omega}g(x)\varphi(x)\;\diff x = 0,
$$
alors $g$ est nulle dans $\Omega$.
{{< /thm/thm >}}
{{< thm/proof >}}
Montrons ce Lemme par l'absurde. Prenons $x_0 \in \Omega$ tel que $g(x_0) \neq 0$. Quitte à multiplier par $-1$, prenons $g(x_0) >0$. Par continuité, il existe un voisinage ouvert $U\_x$ autours de $x$ tel que $g(x)>0$ pour tout $x$ de $U\_{x\_0}$. Prenons maintenant une fonction test positive $\phi$ à support inclus dans $U\_x$ ($\phi > 0$ sur $U\_x$):
$$
0 = \int\_{\Omega}g(x) \phi(x)\diff x = \int\_{U\_x} g(x)\phi(x) \diff x > 0,
$$
ce qui est en contradiction avec l'hypothèse sur $g(x_0)\neq 0$.
{{< /thm/proof >}}

## L'équivalence des formulations

{{< thm/thm proposition >}}
Soit $u\in\Cscr^2(\overline{\Omega})$, alors $u$ vérifie \eqref{eq:pbmodel} si et seulement si $u$ satisfait \eqref{eq:FVpbmodel}.
{{< /thm/thm >}}
{{< thm/proof >}}
Rappelons que le sens $\Rightarrow$ est évident. Remarquons maintenant que $\Cscr^{\infty}\_c(\Omega)\subset\Cscr^1(\Omega)$ et donc, en utilisant la formule de Green "à l'envers" dans \eqref{eq:FVpbmodel}, il vient que, pour tout $v$ de $\Cscr^{\infty}\_c(\Omega)$,
$$
  \begin{array}{r r c l}
&    \dsp  \int\_{\Omega} \nabla u\cdot \conj{\nabla v} \;\diff x +\int\_{\Omega}  u \conj{v} \;\diff x \dsp -\int\_{\Omega} f\conj{v}\;\diff x &=& 0 \\\\\\
\implies& \dsp \int\_{\Omega} \left(\nabla u\cdot \conj{\nabla v} + \Delta u\cdot\conj{v}\right)\;\diff x
+ \int\_{\Omega} (-\Delta u +  u - f)\conj{v}\;\diff x &=& 0\\\\\\
 \implies &
\dsp \int\_{\partial\Omega}\underbrace{(\dn u)}_{=0} \conj{v} \;\diff s + \int\_{\Omega} (-\Delta u + u - f)\conj{v}\;\diff x &=& 0\\\\\\
\implies & \dsp \int\_{\Omega} (-\Delta u + u - f)\conj{v}\;\diff x &=& 0\\\\\\
\end{array}
$$
Ce qui se résume ainsi :
$$
\forall v \in \Cscr^\infty\_c(\Omega), \qquad \int\_{\Omega} (-\Delta u + u - f)\conj{v}\;\diff x = 0
$$
Pour conclure, nous pouvons utiliser le lemme précédent.
{{< /thm/proof >}}

## Formulation variationnelle ou faible

L'expression \eqref{eq:FVpbmodel} s'appelle **Formulation Variationnelle** du problème \eqref{eq:pbmodel} (ou **Formulation Faible**). Elle se réécrit sous la manière compacte usuelle suivante : 

\begin{equation}
\left\\{\begin{array}{l}
\text\{Trouver $u\in \Cscr^1(\overline{\Omega})$ tel que, \} \\\\\\
\forall v \in \Cscr^1(\overline{\Omega}), \quad a(u,v) = \ell(v),
\end{array}\right.
\label{eq:FV}
\end{equation}
avec
$$
\left\\{\begin{array}{r c l}
a(u,v) &:=& \dsp\int\_{\Omega} \nabla u\cdot \conj{\nabla v} \;\diff x+ \int\_{\Omega} u \conj{v} \;\diff x \\\\\\
\ell(v) &:=& \dsp\int\_{\Omega} f \conj{v} \;\diff x
\end{array}\right.
$$

Plutôt que de tenter de résoudre le problème d'origine \eqref{eq:pbmodel}, nous sommes maintenant tentés de résoudre la formulation variationnelle \eqref{eq:FV}, en cherchant $u$ uniquement $\Cscr^1(\overline{\Omega})$ - et, surprise, nous avons (presque) raison !

## Application web

Même si nous n'avons pas encore parcouru toutes les conditions aux limites possibles, faites un tour sur [cette application web]({{<relref "condition_app.md">}}) pour mieux faire le lien entre les paramètres et opérateurs de l'EDP et la formulation faible qui en résulte.

[<button type="button" class="btn btn-outline-primary">Accès à l'application</button>]({{<relref "app/weak-formulation/v2/index.html">}})