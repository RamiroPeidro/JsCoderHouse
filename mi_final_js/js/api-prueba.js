


//mapping que funciona como un hash, obtiene los datos en complejidad O(1) y los guarda N veces en O(1) = O(N) (N la cantidad de equipos)
//Guarda en el map la ruta hacia la imagen, segun el equipo. Es una mejor implementacion que un array, ya que para bucar al equipo tardariamos O(N), en cambio, con esta implementacion lo realiza en O(1)
let mapFotos = new Map(); 

$.ajax({
    async: false,
    headers: { 'X-Auth-Token': 'bfaaa1592fa244dda6a0391eb056a576' },
    url: 'https://api.football-data.org/v2/teams',
    dataType: 'json',
    type: 'GET',
}).done(function(response) {
    for (team of response.teams){
        let nombre = parsearNombres(team.shortName)
        console.log(nombre)
        mapFotos.set(nombre, `images/${nombre}.png`);
    }
});

//parsea los nombres para evitar espacios y en caso de los manchester, borra el espacio
function parsearNombres(team){
    if(team.split(' ').length > 1){
        if (team.split(' ')[0] === "Man"){
            team = team.split(' ')[0] + team.split(' ')[1];
        } else{
            team = team.split(' ')[0];
        }
    }
    return team
}


//--VARIABLES GLOBALES y CONSTRUCTOR--

let equipoElegido = ""
let yaSeObtuvo = false;

class Equipo {
    constructor (nombre, direccion, fundacion, website, id){
        this.nombre = nombre;
        this.direccion = direccion;
        this.fundacion = fundacion;
        this.website = website;
        this.id = id;
    }
}


//--FUNCIONES--

//Parsea la fecha del partido al formato querido
function parsearFecha(string){
    return string.slice(0, 10);
}

function crearCardResultados(equipo1, equipo2, goles1, goles2, ubicacion, fecha){

    let accordionItem = document.querySelector(".accordion1");

    let infoPartidos = `
            <div class="card-body">
                <h5 class="card-title">${equipo1} vs ${equipo2}</h5>
                <p class="card-text">${equipo1}: ${goles1} --  ${equipo2}: ${goles2}</p>
                <p class="card-text">${fecha}</p> 
            </div>
    `
    accordionItem.innerHTML += `${infoPartidos}`
    $(".accordionButton1").html(`Ultimos resultados de ${equipoElegido}`);
    $("#informacion_equipo_2").css("display","block");
}

function crearCardProximos(equipo1, equipo2, fecha) {
    let accordionItem = document.querySelector(".accordion2");

    let infoPartidos = `
            <div class="card-body">
                <h5 class="card-title">${equipo1} vs ${equipo2}</h5>
                <p class="card-text">${fecha}</p> 
            </div>
    `

    accordionItem.innerHTML += `${infoPartidos}`
    $(".accordionButton2").html(`Proximos partidos de ${equipoElegido}`);
    $("#informacion_equipo_3").css("display","block");
}

function crear_card(nombreUsuario, team_name, direccion, fundacion, website, ubicacion_card){

    const card = document.createElement('div')
        card.className = 'card cardEquipo m-2 pl-3'

        let informacion_li = ` 
        <div class="bg-image hover-overlay ripple" data-mdb-ripple-color="light">
        <img
          src=${mapFotos.get(parsearNombres(team_name))}
          class="img-fluid" width="354" height="354"
        />
        <a href="#!">
          <div class="mask" style="background-color: rgba(251, 251, 251, 0.15);"></div>
        </a>
      </div>
      <div class="card-body">
        <h5 class="card-title">${team_name}</h5>
        <p class="card-text">
          ${website}
        </p>
        <p class="card-text">
          ${direccion}
        </p>
        <p class="card-text">
          ${fundacion}
        </p>
        <button id="button-card" class="btn btn-primary button-card"> Saber mas </button>
      </div>
        `
        
        card.innerHTML = `${informacion_li}`
        
        ubicacion_card.append(card);
}


function mostrarInfo(equipo){

    $(".button-card").on("click", function(event){
    event.preventDefault();
    $("#modalMasInfo").modal('show');
    })
    $("#enviar-adicional").click(function(event){
        var select = document.getElementById('select-opciones');
        var value = select.options[select.selectedIndex].value;
        procesarMiEquipo(equipo, value);
    })
    
}


//LLAMADOS AJAX-----


function obtenerEquipos(nombre){
    const contenedorGeneral = document.querySelector("#informacion_equipo")
    $.ajax({
        async: false,
        headers: { 'X-Auth-Token': 'bfaaa1592fa244dda6a0391eb056a576' },
        url: 'https://api.football-data.org/v2/teams',
        dataType: 'json',
        type: 'GET',
    }).done(function(response) {
        const equipo_filtrado = response.teams.filter(equipo => equipo.shortName === nombre);
        if(equipo_filtrado.length == 0){
            $("#input-general").css({
                "border": "4px solid red"
            });
            return
        }

        $("#input-general").css({
            "border": "4px solid green"
        });
        let info_equipo = equipo_filtrado[0]
        let team_name = info_equipo.shortName
        let direccion = info_equipo.address
        let fundacion = info_equipo.founded
        let website = info_equipo.website
        let id_equipo = info_equipo.id
        let nombreUsuario = JSON.parse(localStorage.getItem("user"));

        crear_card(nombreUsuario, team_name, direccion, fundacion, website, contenedorGeneral)
        const MiEquipo = new Equipo(nombre, direccion, fundacion, website, id_equipo);
        mostrarInfo(MiEquipo)
        yaSeObtuvo = true;
        equipoElegido = nombre;
    });
}


function procesarMiEquipo(equipo, seleccion){
    const contenedorGeneral = document.querySelector(".accordion-item")
        $.ajax({
            headers: { 'X-Auth-Token': 'bfaaa1592fa244dda6a0391eb056a576' },
            url: `http://api.football-data.org/v2/teams/${equipo.id}/matches`,
            dataType: 'json',
            type: 'GET',
        }).done(function(response) {
            if(seleccion == 1){
                let ultimos_partidos = response.matches.filter(partido => partido.status == 'FINISHED');
                for (partido of ultimos_partidos){
                    let equipo1 = partido.homeTeam.name;
                    let equipo2 = partido.awayTeam.name;
                    let goles1 = partido.score.fullTime.homeTeam;
                    let goles2 = partido.score.fullTime.awayTeam;
                    let fecha = parsearFecha(partido.utcDate);                  
                    crearCardResultados(equipo1, equipo2, goles1, goles2, contenedorGeneral, fecha)
                }   
                $("#modalMasInfo").modal('hide');
            }
            
            if(seleccion == 2){
                let ultimos_partidos = response.matches.filter(partido => partido.status == 'SCHEDULED');
                for(let i = 0; i< 5; i++){
                    let equipo1 = ultimos_partidos[i].homeTeam.name;
                    let equipo2 = ultimos_partidos[i].awayTeam.name;
                    let fecha = parsearFecha(ultimos_partidos[i].utcDate);
                    crearCardProximos(equipo1, equipo2, fecha);
                }
                $("#modalMasInfo").modal('hide');
                
            }
        });
}

//LLAMADA PRINCIPAL

let inputEquipo = document.getElementById("input-general");

$("#obtener-equipo").on("click",function(event){
    event.preventDefault(); 
    const inputEquipoValue = inputEquipo.value;
    if(!yaSeObtuvo){
        obtenerEquipos(inputEquipoValue);
    } else {
        $("#modalError").modal('show')
    }
 });

 
 $("#reiniciar").on("click", (e) => {
    e.preventDefault();
    location.reload();
 });


