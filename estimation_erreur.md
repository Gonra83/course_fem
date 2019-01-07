+++
title = "Estimation d'Erreur"

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
$\newcommand{\wh}{w\_h}$
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
$\newcommand{\tri}[1]{K\_{#1}}$



Nous étudions ici à "quel point" la solution numérique est "proche" de la solution exacte, en fonction du raffinement de maillage. Les résultats sont très techniques, nous ne donnerons aucune démonstration. Cependant, il est important de retenir de ce qui suit que la méthode des éléments fonctionne d'autant mieux que :

1. La solution recherchée est régulière
2. Le maillage est régulier (pas de triangle "applati")

## Contexte de l'étude

Nous restons en dimension de l'espace à 2 ou 3.

### Problème de Dirichlet

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

L'espace $\Vhz$ est l'espace des éléments finis d'ordre 1 dont les fonctions sont nulles sur $\partial\Omega$:
$$
\Vhz = \enstq{u\in\Pun(\Omega)}{u\restrict\_{\partial\Omega}= 0}.
$$

### Maillages réguliers

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


## Un premier élément : le lemme de Céa

Le Lemme de Céa nous a déjà donné première estimation de l'erreur :
\begin{equation}
\label{eq:cea}
\normH{u-\uh} \leq \frac{M}{\alpha} \inf\_{\vh\in\Vh}\normH{u-\vh},
\end{equation}
où $M$ et $\alpha$ sont respectivement la constante de continuité et de coercivité de la forme $a(\cdot,\cdot)$. Ces constantes dépendent du problème physique uniquement (de l'EDP) et non de la méthode de résolution : nous ne pouvons pas agir sur ces paramètres. Le troisième terme en revanche fait intervenir l'espace $\Vh$ et en particulier $\inf\_{\vh\in\Vh}\normH{u-\vh}$ correspond en quelque sorte à la "meilleure approximation possible de $u$ dans $\Vh$" au sens de $\Ho$. Nous en revenons au point de départ : nous n'approchons pas $u$ mais son espace $V$ par un sous espace $\Vh$. 

Si nous utilisons des éléments finis $\Pun$, notre paramètre h est la finesse de maillage (ou le nombre de sommets). Nous cherchons à savoir "à quelle vitesse" $\Vh$ se "rapproche" de $V$, et donc $\uh$ et de $u$.

Nous cherchons à obtenir une estimation ou une majoration de $\inf\_{\vh\in\Vh}\normH{u-\vh}$ puisque, pour tout $\wh$ de $\Vh$, nous avons :
$$
\normH{u-\uh} \leq \frac{M}{\alpha} \inf\_{\vh\in\Vh}\normH{u-\vh} \leq \frac{M}{\alpha} \normH{u-\wh}
$$
Nous ne trouverons probablement pas "Le" $\vh$ qui réalise $\inf\_{\vh\in\Vh}\normH{u-\vh}$, cependant nous utilisons un $\wh$ qui tende vers $u$ quand h tend vers 0 : l'interpolé de $u$ sur $\Vh$.

## Opérateur d'interpolation

Pour les éléments finis $\Pun$, un opérateur d'interpolation naturel est le suivant :
$$
\begin{array}{r c c l}
  \Pi\_h \colon  & \Cscr^0(\overline{\Omega}) & \to & \Pun(\Omega)\\\\\\
                & v & \mapsto & \dsp \Pi\_h(v) = \sum\_{I=1}^{\Nh} v(\ssb\_I)\varphi\_I
\end{array}
$$
Autrement dit, $\Pi\_h(v)$ est l'échantillonnage de $v$ sur tous les noeuds du maillage. D'après \eqref{eq:cea}, nous pouvons choisir une fonction quelconque $w$ continue sur $\overline{\Omega}$ et nous avons :
$$
\normH{u-\uh} \leq \frac{M}{\alpha} \normH{u-\Pi\_h(w)}.
$$
Plutôt qu'une fonction $w$ quelconque, on a (très) envie de prendre $w=u$. Le peut-on ? Oui, si $u$ est suffisamment régulière (=continue)... Ce qui est en réalité très souvent le cas (rappellons que $u$ est la solution exacte d'un problème physique comme la température, le (petit) déplacement, ...) ! Prenons un peu de liberté et supposons que cela soit vérifié, nous avons alors :
$$
\normH{u-\uh} \leq \frac{M}{\alpha} \normH{u-\Pi\_h(u)}.
$$
L'erreur commise par la méthode des éléments finis est donc majoré par **l'erreur d'interpolation de la solution sur $\Pun$**.

{{% alert warning %}}
Il n'y a aucune raison pour que $\uh = \Pi\_h u$ ! Rappelon-nous que $\uh$ est "proche" de $u$ au sens de la norme de l'énergie (intégrale) et non "point à point".
{{% /alert %}}

<!-- On s'intéresse maintenant à $\normH{u-\Pi\_h(u)}^2$ qui a le bon goût de pouvoir se décomposer triangle par triangle :
$$
\normH{u-\Pi\_h(u)}^2 = \int\_{\Omega}\abs{u-\Pi\_h(u)}^2 = \sum\_{p=1}^{N\_t}\int\_{\tri{p}}\abs{u-\Pi\_h(u)}^2
$$ -->

<!-- La stratégie consiste à construire un opérateur d'interpolation $\Pi\_h$ dont on peut majorer la distance à une fonction $v\in V$ donnée. Localement, sur un triangle $K$ de sommet $\{\ssb^K\_1,\ssb^K\_2,\ssb^K\_3\}$, nous pouvons construire cet opérateur :
$$
\begin{array}{r c c l}
  \Pi\_h \colon  & \Cscr^0(K) & \to & \Pun(K)\\\\\\
                & v & \mapsto & \dsp \Pi\_h^K(v) = \sum\_{j=1}^3 v(\ssb\_j^K)\varphi\_j^K
\end{array}
$$ -->








## Estimation de l'erreur


{{% thm proposition admis %}}
Pour tout $v\in H^{2}(\Omega)$, l'interpolée $\Pi\_hv$ est bien définie et il existe une constance $C>0$ indépendante de $h$ et $v$ telle que :
$$
  \normH{v - \Pi\_h v}\leq C h\norm{v}\_{H^{2}(\Omega)}.
$$
{{% /thm  %}}

Cette proposition implique le théorème suivant
{{% thm theorem admis %}}
Soit $u\in\Hoz$, la solution du problème de Dirichlet \eqref{pb:diri}, et soit $\uh\in \Vhz$ la solution (exacte) du problème approchée \eqref{pb:dirih} par la méthode des éléments finis $\Pun$. La méthode des éléments finis converge :
$$
  \lim\_{h\to 0}\normH{u-\uh} = 0,
$$
et nous avons l'estimation suivante, si $u\in H^2(\Omega)$ (la solution exacte):
$$
\left\\{
\begin{array}{r l}
  \normH{u-u\_h} &\leq C h\norm{u}\_{H^{2}(\Omega)},\\\\\\
  \normL{u-u\_h} &\leq C h^{2}\norm{u}\_{H^{2}(\Omega)},
\end{array}
\right.
$$
où $C>0$ est indépendante de $h$ et de $u$. 
{{% /thm %}}



## Ordre elevé 

### Pourquoi faire ?

La méthode des éléments finis $\Pun$ est une méthode **d'ordre un** : pour diviser l'erreur par 10, il faut mailler 10 fois plus finement (et donc multiplier par 10 le nombre d'éléments). Plutôt que de mailler (très) finement, il peut être intéressant d'utiliser des polynômes d'ordre supérieur à 1.

### Résultats

Nous introduisons l'espace éléments finis d'ordre k suivant :
$$
\Vhz^k = \enstq{u\in\Cscr^0(\overline{\Omega})}{\forall \tri{p}\in\Tscr\_h, u\restrict\_{\tri{p}}\in\Pk(\tri{p}) \text{ et } u\restrict\_{\partial\Omega}= 0}.
$$
L'opérateur d'interpolation reste un opérateur d'échantillonage mais sur **tous les degrés de liberté** et non uniquement les sommets du maillage (par ex. les milieux des arêtes pour $\Pdeux$) :
$$
\begin{array}{r c c l}
  \Pi\_h^k \colon  & \Cscr^0(\overline{\Omega}) & \to & \Pk(\Omega)\\\\\\
                & v & \mapsto & \dsp \Pi\_h^k(v) = \sum\_{I=1}^{N\_{\text{ddl}}} v(\mathbf{q}\_I)\Phi\_I
\end{array}
$$
Le résultat est alors le suivant pour $u\in H^{k+1}(\Omega)$ (la solution exacte) :
$$
\left\\{
  \begin{array}{r l}
  \normH{u-u\_h} &\leq C h^k\norm{u}\_{H^{k+1}(\Omega)},\\\\\\
  \normL{u-u\_h} &\leq C h^{k+1}\norm{u}\_{H^{k+1}(\Omega)},
  \end{array}
  \right.
$$
où $C>0$ est indépendante de $h$ et de $u$. 

### À retenir :

- L'erreur d'interpolation d'une fonction régulière dépend de la régularité de la fonction
- Plus k augmente, plus l'interpolation de $u$ est précise et, par suite, plus l'approximation $\uh$ l'est de $u$
- La constante $C$ dépend aussi du problème physique car elle dépend de $\frac{M}{\alpha}$ (où $\alpha$ est la constante de coercivité de $a(\cdot,\cdot)$ et $M$ de continuité de $\ell(\cdot)$)

{{% alert warning %}}
Ces estimations ne valent que pour un domaine $\Omega$ polygonal ! Autrement, l'approximation géométrique rendra les éléments finis $\Pk$ pour $k>1$ sous-optimaux.
{{% /alert %}}