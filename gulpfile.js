const { src, dest, watch, series } = require('gulp');

//CSS y SASS
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');

//Imagenes
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');


function css(done) {
    //compilar sass
    //paso 1: indentificar archivo, 2: compilarla, 3: guardar l .css
    src('src/scss/app.scss')
        // .pipe(sass({ outputStyle: 'compressed'}))   Con esto se comprime el archivo css saliente
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))    //cssnano comprime y mejora nuestro css
        .pipe(sourcemaps.write('.'))   //al ponerle un punto se guardará junto al build
        .pipe(dest('build/css'))

    done();    
}

function versionWebp() {    //Para crear imagenes en version webp....
    const opciones = {      //opcional pero ayuda a que las imagenes sean mas ligeras
        quality: 50
    }
    return src('src/img/**/*.{png,jpg}')
    .pipe(webp(opciones))
    .pipe(dest('build/img'))
}

function versionAvif() {   //Para crear imagenes en version avif....
    const opciones = {     //opcional pero ayuda a que las imagenes sean mas ligeras
        quality: 50
    }
    return src('src/img/**/*.{png,jpg}')
    .pipe(avif(opciones))  
    .pipe(dest('build/img'))
}

function imagenes() {
    return src('src/img/**/*')   //Con el return evito utilizar el done()
    .pipe(imagemin({optimizationLevel: 3}))  //Esta sintaxis es para la version 7.1.0 de gulp-imagenmin... Pero ya esxite la 8.0.0 revisar documentacion
    .pipe(dest('build/img'))

}

function dev() {
    watch('src/scss/**/*.scss', css);   //Los ** indica que busque todos los archivos; *.scss indica que solo utilice los archivos con esa terminación.
    //watch('src/scss/app.scss', css )   // con la ruta de arriba esta linea ya no es necesaria

    watch('src/img/**/*', imagenes);
}


exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.default = series(imagenes, versionWebp, versionAvif, css, dev);

// series -  Se inicia una tarea y hasta que finaliza inicia la siguiente
// parallel - Todas inican al mismo tiempo (simepre dejar a las que tengan el "watch" al final... ya que estas tienen continuacion de ejecución)
