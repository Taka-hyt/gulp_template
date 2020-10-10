const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const mozjpeg = require('imagemin-mozjpeg');
const pngquant = require('imagemin-pngquant');
const imageminGif = require('imagemin-gifsicle');
const imageminSvg = require('imagemin-svgo');

var paths = {
    srcDir: './src',
    dstDir: './dist'
}

// 画像を格納しているフォルダのパス
var srcGlob = paths.srcDir + '/image';
var dstGlob = paths.dstDir + '/image';

// jpg,png,gif,svg画像の圧縮タスク
function imageMin() {
    return (
        // 参照するフォルダのパスを記述する
        gulp.src(srcGlob + '/**/*.+(jpg|jpeg|png|gif|svg)')
            .pipe(imagemin([
                // pngの圧縮
                pngquant({
                    quality: [0.6, 0.8]
                }),
                // jpgの圧縮
                mozjpeg({
                    quality: 85,
                    progressive: true
                }),
                // gifの圧縮
                imageminGif({
                    interlaced: false,
                    optimizationLevel: 3,
                    colors: 180
                }),
                // SVGの圧縮
                imageminSvg()
            ]
            ))
            // 圧縮したファイルの吐き出し先のパス
            .pipe(gulp.dest(dstGlob))
    );
}

// imageフォルダ配下に変更があれば自動でコンパイルしてくれる
function watchFile(done) {
    gulp.watch(srcGlob + '/**/*.+(jpg|jpeg|png|gif|svg)', imageMin);
    done();
}

// タスクの実行
exports.default = gulp.series(imageMin, watchFile);