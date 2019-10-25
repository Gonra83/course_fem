+++
title = "3. Formulations variationnelles"

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
  parent = "II. Formulations Variationnelles"
  name = "3. Formulations variationnelles"
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
Soit une fonction $\varphi\colon\Omega\to\Cb$, son **support** $\supp$ est alors défini par :
$$
\supp(\varphi) := \overline\{\enstq\{x\in \Omega\}\{\varphi(x) \neq 0\}\}.
$$
{{< /thm/thm >}}

{{< thm/thm definition >}}
L'espace $\Cscr^{\infty}\_c(\Omega)$ est celui des fonctions $\Cscr^{\infty}$ sur $\Omega$ à support compact dans $\Omega$. 
{{< /thm/thm >}}


{{< thm/thm lemma >}}
Soit $\varphi \in \Cscr^{\infty}\_c(\Omega)$, alors $\varphi$ est nulle sur le bord $\partial\Omega$.
{{< /thm/thm >}}
{{< thm/proof >}}
Nous avons $\supp(\varphi) \subset \Omega \subset \Rb^d$, et de plus, $\supp(\varphi)$ est un compact, donc un fermé borné, tandis que $\Omega$ est un ouvert borné et n'est pas fermé. Cela implique que :

1. L'ensemble $\Omega\setminus \supp(\varphi)$ est un ouvert sur lequel $\varphi$ est identiquement nulle.
2. $\partial\Omega \cap \supp(\varphi) = \emptyset$

La fonction $\varphi$ peut donc être prolongée par continuité par 0 sur le bord de $\Omega\setminus \supp(\varphi)$ qui contient $\partial\Omega$.
{{< /thm/proof >}}


{{< thm/thm type="lemma" label="lemma:cinf" >}}
Soit $\Omega$ un ouvert de $\Rb^d$, g une fonction continue dans $\Omega$. Si pour toute fonction $\varphi$ de $\Cscr^{\infty}(\Omega)$ à support compact dans $\Omega$, on a
$$
\int\_{\Omega}g(x)\varphi(x)\;\diff x = 0,
$$
alors $g$ est nulle dans $\Omega$.
{{< /thm/thm >}}
{{< thm/proof >}}
Montrons ce Lemme par l'absurde. Prenons $x_0 \in \Omega$ tel que $g(x_0) \neq 0$. Quitte à multiplier par $-1$, prenons $g(x_0) >0$. Par continuité, il existe un voisinage ouvert $U\_x$ autours de $x$ tel que $g(x)>0$ pour tout $x$ de $U\_{x\_0}$. Prenons maintenant une fonction test positive $\varphi$ à support inclus dans $U\_x$ ($\varphi > 0$ sur $U\_x$):
$$
0 = \int\_{\Omega}g(x) \varphi(x)\diff x = \int\_{U\_x} g(x)\varphi(x) \diff x > 0,
$$
ce qui est en contradiction avec l'hypothèse sur $g(x_0)\neq 0$.
{{< /thm/proof >}}

## L'équivalence des formulations

{{< thm/thm proposition >}}
Soit $u\in\Cscr^2(\overline{\Omega})$, alors $u$ vérifie \eqref{eq:pbmodel} si et seulement si $u$ satisfait \eqref{eq:FVpbmodel}.
{{< /thm/thm >}}
{{< thm/proof >}}
Rappelons que le sens $\Rightarrow$ est évident. 

Partons maintenant de \eqref{eq:FVpbmodel} et utilisons la formule de Green "à l'envers" et prenons un $v$ arbitraire de $\Cscr^1(\Omega)$ :

$$
  \begin{array}{r r c l}
&\dsp  \int\_{\Omega} \nabla u\cdot \conj{\nabla v} \;\diff x +\int\_{\Omega}  u \conj{v} \;\diff x \dsp -\int\_{\Omega} f\conj{v}\;\diff x &=& 0 \\\\\\
\implies& \dsp \int\_{\Omega} \left(\nabla u\cdot \conj{\nabla v} + \Delta u\cdot\conj{v}\right)\;\diff x
+ \int\_{\Omega} (-\Delta u +  u - f)\conj{v}\;\diff x &=& 0\\\\\\
 \implies &
\dsp \int\_{\partial\Omega}(\dn u) \conj{v} \;\diff s + \int\_{\Omega} (-\Delta u + u - f)\conj{v}\;\diff x &=& 0
\end{array}
$$
La fonction $v$ étant arbitraire, nous
\begin{equation}
\label{eq:tmp}
\forall v \in \Cscr^1, \dsp \int\_{\partial\Omega}(\dn u) \conj{v} \;\diff s + \int\_{\Omega} (-\Delta u + u - f)\conj{v}\;\diff x =0.
\end{equation}
Remarquons maintenant que $\Cscr^{\infty}\_c(\Omega)\subset\Cscr^1(\Omega)$. La relation ci-dessus est donc valable pour toute fonction $v$ de pour toute fonction $v$ de $\Cscr^{\infty}\_c(\Omega)$, le {{< thm/ref ref="lemma:cinf">}}lemme précédent{{< /thm/ref>}} implique que $u$ est solution de l'EDP recherchée :
$$
-\Delta u + u = f \qquad (\Omega).
$$
Il nous reste à montrer que $u$ vérifie la condition au bord $\dn u = 0$ sur $\partial\Omega$. La relation \eqref{eq:tmp} se simplifie
$$
\forall v \in \Cscr^1, \dsp \int\_{\partial\Omega}(\dn u) \conj{v} \;\diff s=0.
$$
Comme $u\in\Cscr^2(\overline{Omega})$, on a $\dn u\in\Cscr^1(\partial\Omega)$. Il existe donc $v\in\Cscr^1(\overline{Omega})$ telle que $v|\_{\partial\Omega} = \dn u$. En l'injectant dans l'équation ci-dessus, on obtient :
$$
\dsp \int\_{\partial\Omega} |\dn u|^2 \;\diff s=0.
$$
La fonction $|\dn u|^2$ étant positive sur $\partial\Omega$ et continue, nous en concluons que $|\dn u|^2 =0$ sur $\partial\Omega$ et donc que $\dn u = 0$ sur $\partial\Omega$, ce qui termine la preuve.
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

## Applications web

Même si nous n'avons pas encore parcouru toutes les conditions aux limites possibles, l'application web ci-dessous, développée par [Mina Pêcheux](http://minapecheux.com/wp/), permet de comprendre l’influence des conditions aux limites et des autres paramètres sur la “forme” de la formulation faible :

[<button type="button" class="btn btn-outline-primary">Accès à l'application en plein écran</button>]({{<relref "app/weak-formulation/v2/index.html">}})


{{< app src="../app/weak-formulation/v2/index.html" >}}