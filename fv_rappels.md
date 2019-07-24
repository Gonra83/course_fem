+++
title = "Espaces de Hilbert : Rappels"

date = 2018-09-09T00:00:00
# lastmod = 2018-09-09T00:00:00

draft = false  # Is this a draft? true/false
toc = true  # Show table of contents? true/false
type = "docs"  # Do not modify.

math = true

weight = 30
diagram = false
#markup = "mmark"
math = true

edit_page = {repo_url = "https://github.com/Bertbk/course_fem", repo_branch = "master", submodule_dir="content/course/fem/"}

[git]
  icon = "github"
  repo = "https://github.com/Bertbk/course_fem"
  submodule_dir = "content/course/fem/"


# Add menu entry to sidebar.
[menu.fem]
  parent = "menu_fv"
  name = "Espaces de Hilbert : Rappels"
  weight = 10

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


{{% thm definition %}}
Soit $V$ un $\mathbb{C}-$espace vectoriel, alors l'application $\PS{\cdot}{\cdot}\colon V\times V \to \mathbb{C}$ est un produit scalaire si et seulement si elle vérifie, pour tout $\xx,\yy,\zz\in V$ et tout scalaire $\alpha\in\mathbb{C}$:

1. $\PS{\xx}{\yy} = \overline{\PS{\yy}{\xx}}$
2. $\PS{\xx + \yy}{\zz} = \PS{\xx}{\zz} + \PS{\yy}{\zz}$
3. $\PS{\alpha \xx}{\yy} = \alpha\PS{\xx}{\yy}$
4. $\PS{\xx}{\xx} \in \Rb^+$
5. $\PS{\xx}{\xx} = 0 \Longrightarrow \xx = 0$
{{% /thm %}}


{{% thm definition %}}
Un $\mathbb{C}-$espace vectoriel $V$ est dit pré-Hilbertien si il est muni d'un produit scalaire.
{{% /thm %}}

Le produit scalaire est donc anti-linéaire (ou semi-linéaire) en $y$ puisque :
$$
\PS{x}{\alpha y} = \overline{\alpha}\PS{x}{y}.
$$ 

{{< thm definition >}}
  Soit $V$ un $\mathbb{C}-$espace vectoriel, alors l'application $\norm{\cdot}\colon V \to \Rb$ est une norme si et seulement si elle vérifie, pour tout $\xx,\yy\in V$ et tout scalaire $\alpha\in\mathbb{C}$:

1. Séparation : $\norm{\xx} = 0 \Longrightarrow x = 0$
2. Absolue homogénéité  : $\norm{\alpha \xx} = \abs{\alpha}\norm{\xx}$
3. Inégalité triangulaire : $\norm{\xx + \yy} \leq \norm{\xx} + \norm{\yy}$
{{< /thm >}}

Un produit scalaire induit une norme sur un espace de Hilbert :

$$
\norm{\xx} := \sqrt{\PS{\xx}{\xx}}.
$$

Nous rappelons l'inégalité de Cauchy Schwarz:
{{% thm proposition "Inégalité de Cauchy Schwarz"%}}
Pour tout $\xx$ et $\yy$ appartenant à un espace pré-Hilbertien $V$ :
$$
\abs{\PS{\xx}{\yy}} \leq \norm{\xx}\norm{\yy}.
$$
{{% /thm %}}

{{% thm definition %}}
Un espace pré-Hilbertien $V$ est un espace de Hilbert si et seulement si il est complet pour la norme $\norm{\cdot}$ induite par son produit scalaire.
{{% /thm %}}


{{% thm definition %}}
Soit $V$ un espace de Hilbert. L'application $f:V\times V \to \mathbb{C}$ est une forme sesquilinéaire sur $V$ si et seulement si, pour tout $\xx,\yy, \zz$ de $V$ et $\alpha$ de $\mathbb{C}$:

1. $f(\xx, \yy + \alpha \zz) = f(\xx,\yy) + \overline{\alpha}f(\xx,\zz)$
2. $f(\alpha \xx + \yy, \zz) = \alpha f(\xx,\zz) + f(\yy,\zz)$
{{% /thm %}}