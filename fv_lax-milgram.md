+++
title = "Théorie de Lax-Milgram"

date = 2018-09-09T00:00:00
# lastmod = 2018-09-09T00:00:00

draft = false  # Is this a draft? true/false
toc = true  # Show table of contents? true/false
type = "docs"  # Do not modify.

math = true

edit_page = {repo_url = "https://github.com/Bertbk/course_fem", repo_branch = "master", submodule_dir="content/course/fem/"}

[git]
  icon = "github"
  repo = "https://github.com/Bertbk/course_fem"
  submodule_dir = "content/course/fem/"


# Add menu entry to sidebar.
[menu.fem]
  parent = "menu_fv"
  name = "Théorie de Lax-Milgram"
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
$\newcommand{\normL}[1]{\left\\|#1\right\\|\_{L^2(\Omega)}}$
$\newcommand{\normH}[1]{\left\\|#1\right\\|\_{H^1(\Omega)}}$
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

Nous entrons maintenant dans le cœur de l'analyse variationnelle des EDP. Dans cette section, nous énonçons le théorème principal : celui de Lax-Milgram. 

## Rappel : théorème de représentation

{{% thm theorem "Représentation de Riesz" %}}
Soit $V$ un espace de Hilbert de produit scalaire $\PS{\cdot}{\cdot}$ et de norme induite $\norm{\cdot}$. Pour toute forme anti-linéaire continue $\ell$, il existe un unique $w\in V$ tel que
$$
\ell(v) = \PS{w}{v}, \quad \forall v\in V.
$$
De plus, nous avons
$$
\norm{w} = \sup_{v\in V\setminus\{0\}}\frac{\abs{\ell(v)}}{\norm{v}}.
$$
{{% /thm %}}

{{% alert note%}}
Ce théorème montre que la forme $\ell$ peut être **représentée** par un vecteur $w$ qui est unique. Autrement dit, peu importe $v$, la quantité $\ell(v)$ peut se calculer par la seule connaissance du vecteur $w$ et d'un "simple" produit scalaire.
{{% /alert %}}


## Théorème de Lax-Milgram

Nous pouvons maintenant énoncer le théorème de Lax-Milgram (**à connaître par cœur**).

{{% thm theorem "de Lax-Milgram" %}}
Soit $V$ un espace de Hilbert de produit scalaire $\PS{\cdot}{\cdot}$ et de norme $\norm{\cdot}$, et soit la formulation faible suivante
\begin{equation}\label{eq:fvlax}
\left\\{
  \begin{array}{l}
    \dsp \text{Trouver $u\in V$ tel que,}\\\\\\
    \forall v\in V,\quad a(u,v) = \ell(v).
  \end{array}
\right.
\end{equation}
Sous réserve des quatre hypothèses suivantes :

1. $\ell$ est une forme anti-linéaire continue sur $V$ :
$$
\exists C>0 / \forall v \in V, \quad |\ell(v)| \leq C\norm{v}.
$$
2. $a(\cdot,\cdot)$ est une forme sesquilinéaire  sur $V\times V$. 
3. $a(\cdot,\cdot)$ est continue : 
$$
\exists M>0 / \forall (u,v) \in V\times V, \quad a(u,v) \leq M\norm{u}\norm{v}.
$$
4. $a(\cdot,\cdot)$ est coercive (ou elliptique) :
$$
\exists \alpha > 0 / \forall u \in V, \quad \Re\left(a(u,u)\right) \geq \alpha\norm{u}^2.
$$

Alors la formulation faible \eqref{eq:fvlax} admet une unique solution. De plus cette solution dépend continûment de la forme linéaire $\ell$ :
$$
\norm{u} \leq \frac{M}{\alpha}C
$$
{{% /thm %}}

{{% thm proof %}}
Comme il est question de forme linéaire, nous allons utiliser le Théorème de représentation de Riesz. En effet, pour tout $w$ de $V$, l'application $v\to a(w,v)$ est anti-linéaire et continue de $V$ dans $\Rb$. Il existe donc un unique élément de $V$, noté $A(w)$ (Théorème de Riesz), tel que
$$
\forall v\in V, \quad a(w,v) = \PS{A(w)}{v}.
$$


Nous allons montrer que l'opérateur $A\colon V\to V$ est continu, inversible et d'inverse continu. L'opérateur $A$ est clairement linéaire. En prenant $v=A(w)$ et en utilisant la continuité de $a(\cdot,\cdot)$, nous obtenons :
$$
\|A(w)\|^2  = \PS{A(w)}{A(w)}= a(w,A(w)) \leq M\|w\|\|A(w)\|.
$$
Cette relation étant valable pour tout $w$, elle signifie que $A$ est continue, puisque :
$$
\forall w\in V, \qquad \|A(w)\| \leq M\|w\|.
$$
Appliquons de nouveau le Théorème de représentation de Riesz au membre de droite, puisque $\ell$ est une forme anti-linéaire continue:
$$
\exists! f\in V\text{ tel que } \|f\| = \|\ell\|_{V'} \text{ et } \forall v\in V, \ell(v) = \PS{f}{v}.
$$
Comme $A(u) = f$ est équivalent à $\forall v\in V, \PS{A(u)}{v} = \PS{f}{v}$, alors notre formulation faible \eqref{eq:fvlax} devient un problème linéaire:
$$
\eqref{eq:fvlax} \Longleftrightarrow 
\left\\{
  \begin{array}{l}
  \text\{Trouver $u\in V$ tel que\}\\\\\\
   A(u) = f.
  \end{array}
\right.
$$

La question est : $A$ est-elle bijective ?

Utilisons la coercivité de l'application $a(\cdot,\cdot)$ :
$$
\alpha\|w\|^2 \leq \Re\left(a(w,w)\right)  = \Re\left((A(w), w)\right)\leq \abs{((A(w), w)} \leq \|A(w)\|\|w\|,
$$
ce qui implique que
\begin{equation}\label{eq:demoLax}
\alpha\|w\|\leq\|A(w)\|.
\end{equation}
Comme $\alpha>0$, alors $A$ est injective. En dimension finie et comme $A$ est un endomorphisme, nous pourrions en déduire la surjectivité de $A$. Mais nous sommes malheureusement en dimension infinie, nous devons donc montrer que $\Image(A) = V$, pour cela nous montrons que $\Image(A)$ est fermé dans $V$ et que son orthogonal (dans $V$) est réduit au singleton nul. Prenons une suite $(A(w_n))_n$ de $\Image(A)$ qui converge dans $V$. Nous avons, pour tout $n,p\in\Nb$ et grâce à \eqref{eq:demoLax},
$$
\alpha\|w_n - w_p\|\leq\|A(w_n) - A(w_p)\|.
$$
Quand $n$ et $p$ tendent vers l'infini, alors $\|w_n - w_p\| \to 0$. La suite $(w_n)_n$ est donc une suite de Cauchy dans $V$, qui est fermé, elle est donc convergente vers $w\in V$. Par continuité de $A$, la suite $(A(w_n))_n$ converge vers $A(w)$, élément de $\Image(A)$. Ce qui implique que $\Image(A)$ est fermé. Prenons maintenant $v\in \Image(A)^{\perp}$, par la coercivité de $a(\cdot,\cdot)$, nous avons
$$
\alpha\|v\|^2 \leq \abs{\Re\left(a(v,v)\right)} \leq \abs{a(v,v)} = \abs{\PS{A(v)}{v}} = 0.
$$
Autrement dit, $v=0$ et donc $\Image(A)^\perp = \{0\}$ et nous avons
$$
\Image(A) = \overline{\Image(A)} = \left(\Image(A)^{\perp}\right)^{\perp} = \{0\}^{\perp} = V.
$$
L'application $A$ est donc bijective. Son inverse $A^{-1}$ existe, et, avec \eqref{eq:demoLax}, nous obtenons sa continuité :
$$
\forall w\in V, \qquad \norm{A^{-1}(w)}\leq \frac{1}{\alpha}\norm{w}.
$$
Ceci prouve que $u$ dépend continûment du membre de droite $f$ (qui dépend de $\ell$). 
{{% /thm %}}


{{% alert note %}}
À quoi sert ce théorème ? Sous réserve de 4 hypothèses, nous aurons la garantie que la formulation faible obtenue précédemment admet une solution (ce qui est bien) et que cette solution est unique (encore mieux !). Il est donc d'une importance capitale.
{{% /alert %}}

## Application au problème modèle

Reprenons notre problème
$$
\left\\{
  \begin{array}{l}
    \text{Trouver $u\in \Cscr^1(\overline{\Omega})$ tel que} \\\\\\
    \forall v \in \Cscr^1(\overline{\Omega}), \quad a(u,v) = \ell(v),
  \end{array}
\right.
$$
avec
$$
\begin{array}{l r c l}
a \colon & \Cscr^1(\overline{\Omega}) \times \Cscr^1(\overline{\Omega}) & \to & \Cb\\\\\\
  & (u,v)&\mapsto & \dsp \int\_{\Omega} \nabla u\cdot \conj{\nabla v} \;\diff x+ \int\_{\Omega} u \conj{v} \;\diff x\\\\\\
\ell \colon & \Cscr^1(\overline{\Omega}) & \to & \Cb\\\\\\
  & v & \mapsto & \dsp \int\_{\Omega} f \conj{v} \;\diff x,
\end{array}
$$
et tentons d'appliquer le Théorème de Lax-Milgram, pour démontrer qu'il admet une unique solution (spoiler alert : ça ne va pas marcher). Nous montrons tout d'abord le résultat intermédiaire suivant:
{{% thm lemma %}}
La fonction $\PSH{\cdot}{\cdot}:\Cscr^1(\overline{\Omega}) \times\Cscr^1(\overline{\Omega})$ définie par
$$
\PSH{u}{v} = \int\_{\Omega} \nabla u(x)\cdot\nabla v(x) \diff x+ \int\_{\Omega} u(x)v(x)\diff x,
$$
réalise un produit scalaire sur $\Cscr^1(\overline{\Omega})$.
{{% /thm %}}
{{% thm proof %}}
La forme $\PSH{\cdot}{\cdot}$ est clairement sesquilinéaire du fait de la linéarité de l'intégrale. Pour tout $u$ de $\Cscr^1(\overline{\Omega})$, nous avons
$$
\PSH{u}{u} = \int\_{\Omega} \abs{\nabla u(x)}^2 \diff x+ \int\_{\Omega} \abs{u(x)}^2\diff x \geq 0.
$$
Il reste à montrer que $\PSH{u}{u} \neq 0$ dès que $u$ n'est pas la fonction nulle. Nous avons
$$
\begin{array}{r c l l}
\PSH{u}{u} = 0 &\implies& \dsp \int\_{\Omega} \abs{\nabla u(x)}^2 \diff x+ \int\_{\Omega} \abs{u}^2\diff x = 0 \\\\\\
& \implies &  \dsp  \int\_{\Omega} \abs{u}^2 \;\diff x = 0& \textit{Somme de termes positifs}
\end{array}
$$
  Montrons par l'absurde que $u(x) = 0$ pour tout $x$ de $\Omega$ en supposant qu'il existe $x_0$ dans $\Omega$ tel que $u(x_0)\neq 0$. Nous avons alors $\abs{u(x_0)}>0$ et comme $\abs{u}$ est continue, il existe un ouvert $U_0$ autour de $x_0$ tel que $\abs{u(x)}>0$ pour tout $x$ de $U_0$. Nous avons alors
  $$
\int\_{\Omega} \abs{u}^2 \;\diff x \geq  \int\_{U_0} \abs{u}^2 \;\diff x > 0,
  $$
ce qui est absurde, donc $u(x)= 0$ pour tout $x$ de $\Omega$. 
{{% /thm %}}


Notons $\normH{\cdot}$ la norme induite par $\PSH{\cdot}{\cdot}$, dans ce cas l'application est clairement coercive puisque 
$$
\PSH{u}{u} = \norm{u}^2.
$$
D'autre part, $\ell$ est continue:
$$
\begin{array}{r c l l}
\dsp |\ell(v)| = \left|\int\_{\Omega} f v \diff x\right|
&\leq &\dsp \normL{f}\normL{v} & \textit{Cauchy-Schwarz}\\\\\\
&\leq &\dsp \normL{f}\left|\int\_{\Omega}\abs{v}^2\right|^{\frac{1}{2}} & \\\\\\
&\leq& \dsp \normL{f}\left|\int\_{\Omega}\abs{v}^2 + \int\_{\Omega}\nabla v\cdot \overline{\nabla v}\right|^{\frac{1}{2}} & \textit{Ajout d'un terme positif} \\\\\\
&\leq& \dsp \normL{f}\normH{v}.
\end{array}
$$


En remarquant que $a(\cdot,\cdot) = \PSH{\cdot}{\cdot}$, nous avons donc :
 
:ballot_box_with_check: $\ell(\cdot)$ continue et anti-linéaire sur $\Cscr^1(\overline{\Omega})$<br/>
:ballot_box_with_check: $a(\cdot,\cdot)$ sesquilinéaire sur $\Cscr^1(\overline{\Omega})\times \Cscr^1(\overline{\Omega})$ <br/>
:ballot_box_with_check: $a(\cdot,\cdot)$ continue sur $\Cscr^1(\overline{\Omega})\times \Cscr^1(\overline{\Omega})$ <br/>
:ballot_box_with_check: $a(\cdot,\cdot)$ coercive sur $\Cscr^1(\overline{\Omega})\times\Cscr^1(\overline{\Omega})$<br/>

Nous sommes tentés de crier victoire et d'appliquer le Théorème de Lax-Milgram...

<div style="width:100%;height:0;padding-bottom:56%;position:relative;"><iframe src="https://giphy.com/embed/nKN7E76a27Uek" width="100%" height="100%" style="position:absolute" frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div>

...Sauf que nous ne sommes pas dupes : $\Cscr^1(\overline{\Omega})$ **n'est pas un espace de Hilbert pour la norme $\normH{\cdot}$** car l'espace n'est pas complet (voir exercice) ! 

{{% alert note %}}
Nous pourrions trouver une norme pour lequel $\Cscr^1(\overline{\Omega})$ devient complet, toutefois le problème vient en réalité de la régularité demandée à la solution $u$. 
{{% /alert %}}

L'idée ici est d'autoriser à la solution $u$ à être *un peu moins régulière* pour ainsi appartenir à un espace de Hilbert. L'espace idéal serait le "plus petit" espace de Hilbert possible $V$ qui contienne malgré tout $\Cscr^1(\overline{\Omega})$. Cet espace existe et s'appelle espace de Sobolev $H^1(\Omega)$.

{{% alert exercise %}}
Montrez que $\Cscr^1([-1,1])$ munit du produit scalaire $(\cdot, \cdot)\_{H^1(]-1,1[)}$ n'est pas complet. Pour cela, nous vous suggérons d'étudier la suite de fonctions $(u\_n)\_n$ définies sur $[-1,1]$ par
$$
\forall x \in [-1,1],\quad u\_n(x) = 
\begin{cases}
-x -1 & \text{ si } -1 < x \leq -\frac{1}{n},\\\\\\
\frac{n}{2}x^2 -1+\frac{1}{2n} & \text{ si } -\frac{1}{n} < x < \frac{1}{n},\\\\\\
x -1 & \text{ si } \frac{1}{n} \leq x < 1,
\end{cases}
$$
{{% /alert %}}