var gulp = require("gulp");
var sass = require("gulp-sass");
const plumber = require("gulp-plumber");
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const gcmq = require("gulp-group-css-media-queries");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const notify = require("gulp-notify");
const mode = require("gulp-mode")({
    modes: ["production", "development"],
    default: "development",
    verbose: false,
});

var paths = {
    srcDir: "./src",
    dstDir: "./dist",
};

// SassをCSSにコンパイルしてdistに吐き出す
// タスクの名前
function sassCompile() {
    return (
        gulp
            // 参照するSassファイルのパスを記述する
            .src(paths.srcDir + "/sass/**/*.{scss,sass}")
            // 強制停止を防止、デスクトップにエラーを通知する
            .pipe(plumber(notify.onError("Error: <%= error.message %>")))
            // ソースマップを初期化
            .pipe(sourcemaps.init())
            // Sassをコンパイルする
            .pipe(sass({ outputStyle: "expanded" }))
            .on("error", sass.logError)
            // プレフィックスを自動で付けてくれる
            .pipe(
                autoprefixer({
                    cascade: false,
                })
            )
            // ソースマップの作成
            .pipe(sourcemaps.write())
            // メディアクエリごとにコードを整えてくれる
            .pipe(gcmq())
            // productionモード（buildコマンド）の時のみCSSをMinify化
            // コメントアウトも削除してくれる
            .pipe(mode.production(cleanCSS()))
            // ファイル名を変更する
            .pipe(
                rename({
                    extname: ".min.css",
                })
            )
            // コンパイルしたファイルを吐き出すパスを記述する
            .pipe(gulp.dest(paths.dstDir + "/css"))
    );
}

// src配下のファイルに変更があれば自動でコンパイルしてくれる
function watchFile(done) {
    gulp.watch(paths.srcDir + "/sass/**/*.{scss,sass}", sassCompile);
    done();
}

// タスクの実行！
exports.default = gulp.series(sassCompile, watchFile);
