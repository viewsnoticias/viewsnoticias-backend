import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import News from 'App/Models/News'

export default class NewsSeeder extends BaseSeeder {
  public async run () {
    await News.create({
      userId:1,
      title:"un ejemplo de una noticia",
      header:"un emcabezado",
      body: `Especial).- Organizar, movilizar, votar  y ganar son la clave de estos próximos comicios electorales que se celebrarán el próximo domingo 21N, dónde escogeremos al  Gobernador, alcaldes, diputados, concejales, así lo manifestó el dirigente del PSUV Richard Navarro,  miembro de la Dirección estadal sector deporte del comando de campaña “Aristóbulo Istúriz”.
      Navarro señaló que el candidato a la reelección, juntos a los aspirantes a las 14 alcaldías, diputados y concejales tiene el respaldo absoluto del PSUV y Gran Polo  Patriótico,  con moral en alto  y la fuerza que caracteriza a los revolucionarios saldremos a votar con las consignas del amor, lealtad, alegría y la paz que distinguen a los carabobeños.
      Navarro manifestó: los ojos de Chávez nos marcaran la ruta, arriba y a la izquierda por nuestros candidatos a las alcaldías,  al concejo legislativo y concejos municipales, con la rapidez que garantiza el CNE.
      Richard Navarro enfatizó que Rafael Lacava y todos los candidatos de la revolución, será victorioso con la unidad del chavismo por sus acciones y la suma de felicidad que ha dado está gestión en estos cuatro años.
       Esta semana debemos encontrarnos con las bases para pulir los detalles finales para la victoria bonita y rotunda de las megaelecciones este 21N.
      Destacó que Lacava  tiene con qué, su gestión ha  elevado el nivel de vida de los carabobeños en materia de salud, educación, transporte, deporte, cultura,  servicios públicos, labores sociales y toda una maquinaria de acciones que hacen de su gestión una referencia en materia de gerencia pública,
      "Vamos por todos los espacios que están en juego, verán en la calle a un pueblo digno que no se rinde y que con su participación contundente le darán  un mensaje al mundo de respeto y democracia", puntualizó Navarro.`,
    })
  }
}
