# Proyecto MVP para el ramo "Informática Legal y Derecho Informático"

Para ejecutar el código se utiliza Node.js:

- Una vez clonado el repositorio, para correr el código es necesario ingresar a la carpeta principal y a través de la consola escribir "node server.js"
- Una vez hecho esto se podrá visualizar la página de manera local en http://localhost:8080

----

## I. Problemática

La situación que detectamos y que buscamos tratar en nuestro proyecto es realizar un estudio en la sociedad chilena con respecto a la perspectiva que esta tiene sobre los castigos impuestos por las leyes de hoy en día.

En conversaciones casuales se suele mencionar la existencia de una discrepancia entre las sanciones legales impuestas por las leyes, su severidad, y la percepción pública pública sobre la gravedad de los delitos, lo que trae un cierto nivel de insatisfacción social con la justicia penal, junto a dudas sobre la efectividad de las penas actuales, pero no existe una herramienta que mida sistemáticamente la percepción pública para compararla o tomarla en cuenta con las decisiones legales, ni para confirmar la presencia y magnitud de esta discrepancia. 

Es por esto que nosotros buscamos crear, a través de medios informáticos, una forma de recopilar las opiniones de las personas en diferentes escenarios de crímenes que presenten distintos niveles de gravedad, esto con el objetivo de poder crear un sistema de ranking que pueda reflejar (según la opinión pública) cuáles son los delitos que deberían ser calificados como los más graves sobre otros. Esta herramienta se inspirará de la “Moral Machine” creada por el MIT, en donde se nos presentan dilemas morales entre los cuales debemos elegir el menor de dos males.

Con estos datos podremos realizar un análisis ex post sobre el impacto real de las sanciones impuestas por las leyes actuales para evaluar si las sanciones actuales reflejan las expectativas sociales de los chilenos. El análisis permitiría identificar las posibles
discrepancias que existan entre la ley y la opinión pública. Asimismo, en caso de que los resultados no coincidan con lo esperado, podremos ser capaces de utilizar esta herramienta y su información para identificar estas diferencias, para que entidades como el Congreso Nacional puedan usarlas como base en futuras discusiones y procesos legislativos, con el fin de rectificar las discrepancias que puedan existir entre la voluntad de los chilenos y la ley del país.

## II. Solución

La idea que buscamos implementar es una página web similar a la “Moral Machine” pero enfocada en buscar el mal mayor dentro de posibles infracciones que puedan ocurrir. Esta “Law Machine” nos presentaría estas situaciones con distintos agravantes y atenuantes. Sería una plataforma web diseñada para comparar y evaluar la gravedad percibida de distintos delitos o infracciones gracias a la opinión ofrecida por los usuarios que la usen. La herramienta permitirá a los usuarios seleccionar cuál de los dos delitos presentados consideran más grave, utilizando una interfaz sencilla e intuitiva.

A través de las elecciones de los usuarios, la plataforma genera un ranking dinámico que clasifica los delitos según la percepción pública de su gravedad, y también mostraría cuál de las opciones para cada caso individual fué la más seleccionada. Este ranking puede ser comparado posteriormente con las clasificaciones legales establecidas por el sistema judicial con el fin de hacer un análisis de su efectividad.

## III. Funcionalidades

1. El sistema deberá ser capaz de crear, modificar, eliminar y expandir los diferentes escenarios de los posibles delitos a tratar. El sistema podrá expandir la situación expuesta en algún caso editando la información de este, en donde se pueden incluir posibles agravantes o atenuantes más específicos asociados al tipo de crímen.

2. El sistema presentará los distintos escenarios legales mezclados de forma aleatoria para que el usuario pueda elegir entre un par de casos. Entre estos escenarios el usuario debe elegir cuál sería la situación que necesitaría tener una mayor sanción aplicada, debido a la gravedad de esta. Con esta información, el sistema podrá indicar cuántos usuarios coinciden en la gravedad de una infracción mediante un sistema de ranking creado en base a la cantidad de opiniones de usuarios que seleccionaron la misma alternativa. El sistema también guarda cuántos usuarios favorecieron cada alternativa en cada par a comparar. Tanto el ranking general de todas las alternativas como el sesgo entre dos opciones por cada par proporcionan información valiosa y de diferentes ángulos.

3. El sistema deberá ser capaz de filtrar las opiniones recopiladas según la información demográfica/geográfica del usuario. Esta filtración es realizada como una inscripción de datos personales antes de que el usuario pueda empezar a participar en la “Law Machine”, esto para evitar situaciones culturales que podrían perjudicar en la pureza de los resultados. Se le solicita al participante ingresar su Rut y su Región, al realizar este tipo de separación, la información podrá ser estudiada de forma generalizada dentro de todo Chile, o en clasificaciones más específicas. Actualmente debido a que este proyecto es un MVP, esta función solo está expuesta visualmente y no se pueden realizar filtraciones en base a esta información.

