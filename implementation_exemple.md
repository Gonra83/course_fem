+++
title = "Exemple Détaillé"

date = 2018-09-09T00:00:00
# lastmod = 2018-09-09T00:00:00

draft = false  # Is this a draft? true/false
toc = true  # Show table of contents? true/false
type = "docs"  # Do not modify.

math = true
weight = 140
diagram = false
#markup = "mmark"

edit_page = {repo_url = "https://github.com/Bertbk/course_fem", repo_branch = "master", submodule_dir="content/course/fem/"}

[git]
  icon = "github"
  repo = "https://github.com/Bertbk/course_fem"
  submodule_dir = "content/course/fem/"


# Add menu entry to sidebar.
[menu.fem]
  parent = "menu_mise_en_oeuvre"
  identifier = "implementation_matrix_assemblage"
  name = "Exemple Détaillé"
  weight = 50

+++


Développée par [Mina Pêcheux](http://minapecheux.com), cette [application web]({{<relref "app/matrix-assembly/index.html">}}) présente l'assemblage pas à pas d'une matrice. En cliquant sur un triangle, les contributions de ce dernier seront ajoutées dans la grande matrice de masse. La matrice de masse élémentaire associée au triangle est également affichée.

[<button type="button" class="btn btn-outline-primary">Accès à l'application</button>]({{<relref "app/matrix-assembly/index.html">}}) 
