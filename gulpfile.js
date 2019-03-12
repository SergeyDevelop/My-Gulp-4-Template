var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var autoprefixer  = require('gulp-autoprefixer');
var cleancss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var notify = require("gulp-notify");
var del = require('del');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var cache = require('gulp-cache');
var babel = require("gulp-babel");




gulp.task('sass',function(){
    return gulp.src(['app/sass/**/*.sass','app/scss/**/*.scss'])
    .pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
    .pipe(autoprefixer(['last 15 versions']))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({stream:true}))
});


gulp.task('browserSync',function(){
    browserSync({
        server:{
            baseDir:'app'
        },
        notify:false
    })
});


gulp.task('clean',function(){
    return del('dist')
});


gulp.task('clear',function(){
    return cache.clearAll();
});


gulp.task('img',function(){
    return gulp.src('app/img/**/*')
    .pipe(cache(imagemin({
        interlaced:true,
        progressive: true,
        svgoPlugins:[{ removeViewBox:false}],
        une:[pngquant()]
    })))
    .pipe(gulp.dest('dist/img'))
});


gulp.task('watch',function(){
    return gulp.watch(['app/sass/**/*.sass','app/scss/**/*.scss'],gulp.parallel('sass')),
    gulp.watch('app/**/*.html').on('change', browserSync.reload),
    gulp.watch('app/js/**/*.js').on('change', browserSync.reload);
    
});

////build/////
gulp.task('buildCss',function(){
   return gulp.src('app/css/**/*')
    .pipe(cleancss())
    .pipe(gulp.dest('dist/css')) ;
});
gulp.task('buildFonts',function(){
    return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
});
gulp.task('buildLibs',function(){
    return gulp.src('app/libs/**/*')
    .pipe(gulp.dest('dist/libs'));
});
gulp.task("babelJS", function () {
    return gulp.src("app/js/**/*")
      .pipe(babel({
        presets: ['@babel/preset-env']
    }))
      .pipe(gulp.dest("dist/js"));
  });
gulp.task('uglifyJs',function(){
    return gulp.src('dist/js/**/*')
    .pipe(uglify())
    .pipe(gulp.dest('dist/js')) ;
});
gulp.task('buildHtml',function(){
    return gulp.src('app/**/*.html')
    .pipe(gulp.dest('dist'));
});
    
gulp.task('build',gulp.series('clean','img','sass','buildCss','buildFonts','buildLibs','babelJS','uglifyJs','buildHtml'));

gulp.task('default',gulp.parallel('watch','browserSync'));





