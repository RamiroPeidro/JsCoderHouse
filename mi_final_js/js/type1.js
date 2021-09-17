const typewriter = new Typewriter('.h1-writter', {
  });

  typewriter.typeString('Bienvenido a PremierWeb.')
  .start();


  const type2 = new Typewriter('.p-writter', {
  });

  type2
  .pauseFor(2500)
  .typeString('<span style="color: #fff;"></span> <strong style="color: red;">Partidos</strong> actuales')
  .pauseFor(1000)
  .deleteAll()
  .typeString('<strong style="color: red;">Estadísticas</strong> en vivo.')
  .pauseFor(2000)
  .deleteAll()
  .typeString('<strong style="color: red;">Empieza</strong> ya.')
  .start();