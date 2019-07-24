+++
title = "Maillage de Delaunay"

date = 2018-09-09T00:00:00
# lastmod = 2018-09-09T00:00:00

draft = false  # Is this a draft? true/false
toc = true  # Show table of contents? true/false
type = "docs"  # Do not modify.

math = true

[git]
  icon = "github"
  repo = "https://github.com/Bertbk/course_fem"
  submodule_dir = "content/course/fem/"


# Add menu entry to sidebar.
[menu.fem]
  name = "Maillage de Delaunay"
  weight = 70

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

