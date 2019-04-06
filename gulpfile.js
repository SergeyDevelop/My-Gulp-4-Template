const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const autoprefixer  = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const notify = require("gulp-notify");
const del = require('del');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const cache = require('gulp-cache');
const babel = require("gulp-babel");



//Sass or Scss
gulp.task('sass',()=>{
    return gulp.src(['app/sass/**/*.sass','app/scss/**/*.scss'])
    .pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
    .pipe(autoprefixer(['last 15 versions']))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({stream:true}))
});


gulp.task('browserSync',()=>{
    browserSync({
        server:{
            baseDir:'app'
        },
        notify:false
    })
});

//Clear directory
gulp.task('clean',()=>{
    return del('dist')
});

//Clear cache
gulp.task('clear',()=>{
    return cache.clearAll();
});

//Image min
gulp.task('img',()=>{
    return gulp.src('app/img/**/*')
    .pipe(cache(imagemin({
        interlaced:true,
        progressive: true,
        svgoPlugins:[{ removeViewBox:false}],
        une:[pngquant()]
    })))
    .pipe(gulp.dest('dist/img'))
});

//Watch
gulp.task('watch',()=>{
    return gulp.watch(['app/sass/**/*.sass','app/scss/**/*.scss','app/**/*.html','app/js/**/*.js'],gulp.parallel('sass'))
    .on('change', browserSync.reload)
});


//Build
gulp.task('buildCss',()=>{
   return gulp.src('app/css/**/*')
    .pipe(cleancss())
    .pipe(gulp.dest('dist/css')) ;
});
gulp.task('buildFonts',()=>{
    return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
});
gulp.task('buildLibs',()=>{
    return gulp.src('app/libs/**/*')
    .pipe(gulp.dest('dist/libs'));
});
gulp.task("babelJS", ()=>{
    return gulp.src("app/js/**/*")
      .pipe(babel({
        presets: ['@babel/preset-env']
    }))
      .pipe(gulp.dest("dist/js"));
  });
gulp.task('uglifyJs',()=>{
    return gulp.src('dist/js/**/*')
    .pipe(uglify())
    .pipe(gulp.dest('dist/js')) ;
});
gulp.task('buildHtml',()=>{
    return gulp.src('app/**/*.html')
    .pipe(gulp.dest('dist'));
});
    
gulp.task('build',gulp.series('clean','img','sass','buildCss','buildFonts','buildLibs','babelJS','uglifyJs','buildHtml'));

gulp.task('default',gulp.parallel('watch','browserSync'));