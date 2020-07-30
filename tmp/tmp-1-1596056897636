//const argv = require('yargs').argv
const {argv} = require('./config/yargs')
const colors = require('colors')

const porHacer = require('./por-hacer/por-hacer');

console.log(argv);

let comando = argv._[0];

switch(comando){
    case 'crear':
        let tarea = porHacer.crear(argv.descripcion);
        console.log(tarea)
        break
    case 'listar':
        let listado = porHacer.getListado();
        for (let tarea = 0; tarea < listado.length; tarea++) {
            console.log('========== Por Hacer ==============='.green);
            console.log(listado[tarea].descripcion);
            console.log('Estado: ', listado[tarea].completado);
            console.log('===================================='.green);
            
        }

        break
    case 'actualizar':
        let actualizado = porHacer.actualizar(argv.descripcion, argv.completado);
        console.log(actualizado)
        break

    case 'borrar':
        porHacer.borrar(argv.descripcion)
        break
    default:
        console.log('comando no reconocido')
        break
}