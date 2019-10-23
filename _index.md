+++
title = "Maillage et Éléments Finis"

date = 2018-09-09T00:00:00
# lastmod = 2018-09-09T00:00:00

draft = false  # Is this a draft? true/false
toc = true  # Show table of contents? true/false
type = "docs"  # Do not modify.
weight = 1
diagram = false
#markup = "mmark"

edit_page = {repo_url = "https://github.com/Bertbk/course_fem", repo_branch = "master", submodule_dir="content/course/fem/"}

[git]
  icon = "github"
  repo = "https://github.com/Bertbk/course_fem"
  submodule_dir = "content/course/fem/"


# Add menu entry to sidebar.
[menu.fem]
  identifier = "pre_introduction"
  name = "Avant-propos"
  weight = 1

+++

## Du Pdf au Web

Afin de changer du format `.pdf`, possédant ses avantages et ses désavantages, cette année, le cours sera fourni en ligne sous forme d'une page web. Qui plus est, *responsive*, autrement dit, vous pouvez lire ce cours sur votre smartphone / tablette / ordinateur. De quoi vous occuper dans le métro ~~ou aux toilettes~~ !

## Comment lire ce cours

Comme pour un fichier pdf, avec quelques babioles en plus.

### Théorèmes et autres résultats


Les théorèmes, définitions, corollaires, lemmes et démonstrations ressemblent à ce qu'on trouve en pdf :
{{< thm/thm definition >}}
... je suis une définition ...
{{< /thm/thm >}}
{{< thm/thm theorem >}}
... je suis un théorème ...
{{< /thm/thm >}}
{{< thm/thm proposition >}}
... je suis une proposition ...
{{< /thm/thm >}}
{{< thm/thm corollary >}}
... je suis un corollaire ...
{{< /thm/thm >}}
{{< thm/thm lemma >}}
... je suis un lemme ...
{{< /thm/thm >}}
{{< thm/proof >}}
... se termine par un "point" en bas à droite...
{{< /thm/thm >}}

### Encards

{{% alert note %}}
Parfois, vous rencontrerez des remarques indiquées comme ceci...
{{% /alert %}}

{{% alert tips %}}
... Ou bien des astuces ...
{{% /alert %}}

{{% alert warning %}}
... voire même des avertissements...
{{% /alert %}}

{{% alert exercise %}}
... et enfin, parfois, des exercices.
{{% /alert %}}

## Remarques importantes

1. Une typo ? Une erreur de math ? Un lien mort ? [Faites moi remonter l'info]({{< ref "/#contact" >}}) !
2. Le cours peut être mis à jour à tout moment de ma part. N'en soyez pas étonné. C'est pratique : vous êtes sûrs de visualiser la dernière version (warning, en pied de page n'est pas indiqué la date de la dernière version).
3. Je suis preneur de toute critique / remarque de la part des utilisatrices et utilisateurs que vous êtes.

## C'est parti !

{{< video src="video/eagle.webm"  >}}