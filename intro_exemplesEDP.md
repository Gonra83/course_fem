+++
title = "Quelques EDP elliptiques du second ordre"

date = 2018-09-09T00:00:00
# lastmod = 2018-09-09T00:00:00

draft = false  # Is this a draft? true/false
toc = true  # Show table of contents? true/false
type = "docs"  # Do not modify.

math = true
weight = 20
diagram = false
#markup = "mmark"

edit_page = {repo_url = "https://github.com/Bertbk/course_fem", repo_branch = "master", submodule_dir="content/course/fem/"}

[git]
  icon = "github"
  repo = "https://github.com/Bertbk/course_fem"
  submodule_dir = "content/course/fem/"


# Add menu entry to sidebar.
[menu.fem]
  parent = "introduction"
  name = "Quelques EDP"
  weight = 10


+++

$\newcommand{\dn}{\partial\_{\mathbf{n}}}$
$\newcommand{\xx}{\mathbf{x}}$
$\newcommand{\Escr}{\mathscr{E}}$
$\newcommand{\Omegaa}{\Omega\_a}$
$\newcommand{\Omegamur}{\Omega\_{\text{mur}}}$


## Thermique

Prenons un domaine borné et connexe $\Omega$, par exemple le carré unité, qui représente un studio. En supposant le milieu homogène, la température $T$ au sein du studio vérifie *l'équation de Laplace*:
$$
- \Delta T = 0, \qquad \text{ dans }\Omega,
$$
où l'opérateur $\Delta := \sum\_{i=1}^d\frac{\partial^2}{\partial x\_i^2}$ est le *Laplacien* ou *Opérateur de Laplace*.

Supposons maintenant que le studio comporte une source de chaleur, par exemple un radiateur. Nous le modélisons par une fonction $q$, continue, valant $0$ partout sauf sur un petit domaine $\Omega_R$. En notant la conductivité $K$(=constante) du milieu alors $T$ vérifie *l'équation de Poisson*:
$$
- \Delta T = \frac{q}{K}, \qquad \text{ dans }\Omega.
$$

Ce problème reste pour l'instant incomplet car il manque des conditions. Contrairement aux problèmes de Cauchy, il n'y a pas de condition initiale, car le régime est stationnaire, mais nous avons besoin de conditions sur le bord $\partial\Omega$ du domaine $\Omega$. Nous parlons alors de *conditions aux limites* et par suite de *problème aux limites*. 

Ajoutons une fenêtre à notre studio portée à la douce température de $T_0 = 10^\circ C$ grâce à l'automne frisquet. Le reste des murs est supposé parfaitement isolants, autrement dit le flux à travers les parois est nul. Le flux d'une quantité sur une interface étant donné par
$$
 \text{flux }:= \nabla T \cdot \mathbf{n} = \partial\_\mathbf{n} T,
$$
où $\mathbf{n}$ est le vecteur unitaire normale sortant au domaine.  Le bord de notre appartement, noté $\Gamma :=\partial\Omega$, est alors divisé en deux parties :

- $\Gamma\_D$ : la fenêtre sur laquelle la température est imposée : **condition de Dirichlet**.
- $\Gamma\_N$ : les murs supposés isolants sur lesquels le flux est imposé : **condition de Neumann**.

Notre problème s'écrit alors :
$$
\left\\{
  \begin{array}{ r c l l}
    - \Delta T &= &\displaystyle\frac{q}{K}, & \text{ dans }\Omega,\\\\\\
    T  &=  &T\_0, & \text{ sur } \Gamma\_D,\\\\\\
  \partial\_\mathbf{n} T  &= & 0, & \text{ sur } \Gamma\_N.
  \end{array}
\right.
$$

Nous verrons dans ce cours que ce problème admet une solution (ouf) et qui est, de plus, unique (re-ouf). Résoudre le problème analytiquement (*i.e.* "à la main") peut s'avérérer délicat, notamment si la géométrie est complexe : c'est ici que la simulation numérique rentre en jeu et notamment les éléments finis. 



## Diffusion d'une onde Wifi dans un appartement (Projet 2017-2018)

### Modèle 

La définition [Wikipédia](https://fr.wikipedia.org/wiki/Onde) d'une onde est la suivante :

> Une onde est la propagation d'une perturbation produisant sur son passage une variation réversible des propriétés physiques locales du milieu. Elle se déplace avec une vitesse déterminée qui dépend des caractéristiques du milieu de propagation. Une onde transporte de l'énergie sans transporter de matière.

Mathématiquement, une onde $\Escr(\xx,t)$ dépend du temps $t$ et de l'espace $\xx$, et vérifie l'équation des ondes :
$$
\Delta \Escr(\xx,t) = \frac{1}{c^2}\frac{\partial^2 \Escr}{\partial t^2}(\xx,t),
$$
où $c$ est la célérité de l'onde dans le milieu (qui peut dépendre de la position $\xx$ !). Par exemple, dans le cas d'une onde électromagnétique et dans le vide, $c$ est la célérité de la lumière, soit $299792458\mathrm{m.s}^{-1}$. La quantité $\xx$ est un vecteur de dimension $d=2$ ou $d=3$ selon le problème considéré : dans notre cas $d=2$. 

Lors d'une excitation périodique, c'est-à-dire lorsque la pulsation $\omega$ (en $\mathrm{rad.s}^{-1}$) de l'onde est fixée, l'onde s'écrit alors $\Escr(\xx,t) = \Re\left(u(\xx)e^{-\imath \omega t}\right)$ où $\imath=\sqrt{-1}$ et $E$ est une onde *spatiale* satisfaisant l'équation de Helmholtz :
$$
\Delta E + \frac{\omega^2}{c^2}E = f.
$$
Cette équation s'obtient en remplaçant $\Escr(\xx,t)$ par $E(\xx)e^{-\imath \omega t}$ dans l'équation des ondes. Nous notons en général $k = \frac{\omega}{c}$ (en $\mathrm{rad.m}^{-1}$) le nombre d'onde et $\lambda = \frac{2\pi}{k}$ (en $\mathrm{m}$) la longueur d'onde, autrement dit, la distance entre deux amplitudes, de sorte que l'équation de Helmholtz s'écrit
$$
\Delta E + k^2E = f.
$$
La source $f$ est ici spatiale, dans le cas d'une source ponctuelle de centre $\mathbf{s}$ la source est alors un Dirac:
$$
\Delta E + k^2E = -\delta\_{\mathbf{s}}.
$$

Les ondes Wi-Fi  qui suivent la [norme IEEE 802.11g](https://fr.wikipedia.org/wiki/IEEE_802.11) sont émises à une fréquence variant de 2.4GHz à 2.5GHz. 
L'appartement tout entier dans lequel est situé notre routeur est noté $\Omega$. Les murs sont supposés être du même matériau : du placo-plâtre. Le domaine $\Omega = \Omegaa\cup\Omegamur$ est décomposé en deux domaines, $\Omegaa$ pour l'air et $\Omegamur$ pour les murs.

Une modélisation possible de ce problème est le système d'équations suivant :

En supposant que l'air a les mêmes propriétés électromagnétiques que le vide
$$
\left\\{
  \begin{array}{r c l l}
    \Delta E(\xx) + k^2n(\xx)^2E(\xx)  &= & -\delta\_{\text{routeur}}(\xx) & \text{ dans } \Omega,\\\\\\
    \dn E(\xx) - \imath k n(\xx) E(\xx) & = & 0 & \text{ sur }\partial\Omega,
  \end{array}
\right.
$$
où nous avons :

- $\delta\_{\text{routeur}}$ : position du routeur. Nous l'avons placé dans le salon.
- $n$ : *fonction de contraste* qui prend en compte les caractéristiques électromagnétiques du mur et de l'air :
$$
n(\xx) =
\left\\{
  \begin{array}{l l l}
    1 & \text{ si } \xx\in\Omegaa & (\textit{i.e. } \xx \text{ est dans l'air}),\\\\\\
    2.4 & \text{ si } \xx\in\Omegamur & (\textit{i.e. } \xx \text{ est dans le mur}).
  \end{array}
\right.
$$
Notez que ces valeurs sont des valeurs physiques et ne sont pas une lubie mathématique.
- La dernière équation, $\dn E - \imath k n E = 0$ est une **condition de Fourier-Robin** (ou *de Fourier* ou *de Robin* ou même *d'impédance*). Elle a pour but *d'absorber* (avec un succès mitigé) les ondes sortantes, mimant un mur "transparent" (sans réflexion d'ondes). 

### Résolution numérique

La résolution d'un tel problème dans un appartement deux pièces avec cuisine séparée (grand luxe Parisien) avec la méthode des éléments finis donne alors ce résultat :

{{< figure src="../wifi.jpg" title="Propagation d'une onde Wi-Fi dans un appartement. Après avoir traversé 2 murs, l'onde Wi-Fi semble très amortie. Sous le résultat est affiché le plan de l'appartement et la position du routeur (petit disque à gauche)">}}



### Vous voulez tester ?

Aucun problème :

- Téléchargez le bundle [Onelab](https://onelab.info). Il contient [GMSH](https://gmsh.info) et [GetDP](https://getdp.info) (un solveur éléments finis) 
- Téléchargez [le code](https://github.com/Bertbk/wifi), soit directement soit via `Git` :

    ```bash
    git clone https://github.com/Bertbk/wifi.git wifi
    ```
- Dans le dossier et dans un terminal, lancer

    ```bash
    gmsh wifi.pro
    ```
- Vous pouvez modifier un peu la géométrie et la fréquence de l'onde, mise à 1GHZ. Attention, cette simulation est très gourmande : testez d'aborg avec 1GHz avant de lancer la simulation pour 2.5GHz (au risque de faire crasher votre ordinateur) !

## Objectifs du cours

Vous serez capable de résoudre ce genre de problème (et bien d'autres) et, ainsi, d'épater votre famille lors de ces interminables dîners.