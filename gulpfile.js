const { src, dest, watch, parallel, series } = require('gulp');
const del = require('del');
const groupCssMediaQueries = require('gulp-group-css-media-queries');
const autoprefixer = require('gulp-autoprefixer');
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const replace = require('gulp-replace');
const gap = require('gulp-append-prepend');
const browserSync = require('browser-sync').create();
const fileinclude = require('gulp-file-include');
const fs = require('fs');
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');
let webp;
async function loadWebp() {
	webp = (await import('gulp-webp')).default;
}

const htmlBeautifyOptions = { indentSize: 1 };

// --- Очистка ---

function reset() {
	return del('./release');
}

function cleanImages() {
	return del('release/images');
}

function cleanBuild() {
	return del('build');
}

// --- Изображения ---

// Копирование SVG без изменений
function copySvg() {
	return src('dev/images/**/*.svg')
		.pipe(dest('release/images'));
}

// Конвертация в WebP (только jpg, jpeg, png)
async function imageToWebpOnly() {
	await loadWebp();
	return src('dev/images/**/*.{jpg,jpeg,png}')
		.pipe(webp({ quality: 85 }))
		.pipe(dest('release/images'));
}

// --- Копирование ---

function libraries() {
	return src('dev/libraries/**/*')
		.pipe(dest('release/libraries'))
		.pipe(browserSync.stream());
}

function copyfonts() {
	return src('dev/fonts/*.{woff,woff2}')
		.pipe(dest('release/fonts'));
}

// --- Стили ---

function styleConcat() {
	return src([
		'dev/style/scss/common.scss',
		'dev/components/elements/**/*.scss',
		'dev/components/**/**/*.scss',
	])
		.pipe(scss())
		.pipe(autoprefixer({ grid: true, overrideBrowserslist: ['last 10 versions'], cascade: true }))
		.pipe(concat('all-style.css'))
		.pipe(groupCssMediaQueries())
		.pipe(replace(/[^-_"'][(./)\w]*\/images/g, '../images'))
		.pipe(replace(/\.(jpg|jpeg|png)/g, '.webp'))
		.pipe(dest('release/css'))
		.pipe(browserSync.stream());
}

function styleConcatCommon() {
	return src([
		'dev/style/scss/common.scss',
		'dev/components/header/*.scss',
		'dev/components/footer/*.scss',
	])
		.pipe(scss())
		.pipe(autoprefixer({ grid: true, overrideBrowserslist: ['last 10 versions'], cascade: true }))
		.pipe(concat('common.css'))
		.pipe(groupCssMediaQueries())
		.pipe(replace(/[^-_"'][(./)\w]*\/images/g, '../images'))
		.pipe(replace(/\.(jpg|jpeg|png)/g, '.webp'))
		.pipe(dest('release/css'))
		.pipe(browserSync.stream());
}

function scss2cssComponent() {
	return src(['dev/components/**/*.scss', '!dev/components/{header,footer}/*.scss'])
		.pipe(scss())
		.pipe(autoprefixer({ grid: true, overrideBrowserslist: ['last 10 versions'], cascade: true }))
		.pipe(replace(/[./A-Z0-9]*\/images/g, '../images'))
		.pipe(replace(/\.(jpg|jpeg|png)/g, '.webp'))
		.pipe(dest('release/components/'))
		.pipe(browserSync.stream());
}

function scss2cssMain() {
	return src(['dev/style/scss/*[!common].scss'])
		.pipe(scss())
		.pipe(autoprefixer({ grid: true, overrideBrowserslist: ['last 10 versions'], cascade: true }))
		.pipe(replace(/[./A-Z0-9]*\/images/g, '../images'))
		.pipe(replace(/\.(jpg|jpeg|png)/g, '.webp'))
		.pipe(groupCssMediaQueries())
		.pipe(dest('release/css'))
		.pipe(browserSync.stream());
}

function cssCopy() {
	return src('dev/style/**/*.css')
		.pipe(dest('release/css'))
		.pipe(browserSync.stream());
}

// --- Скрипты ---

function scriptsConcat() {
	return src([
		'dev/js/*.js',
		'dev/components/elements/*.js',
		'dev/components/**/*.js',
	])
		.pipe(concat('all-scripts.js'))
		.pipe(gap.prependText('$(document).ready(function () {'))
		.pipe(gap.appendText('});'))
		.pipe(dest('release/js'))
		.pipe(browserSync.stream());
}

function scriptsConcatCommon() {
	return src([
		'dev/js/common.js',
		'dev/components/header/*.js',
		'dev/components/footer/*.js',
	])
		.pipe(concat('common.js'))
		.pipe(gap.prependText('$(document).ready(function () {'))
		.pipe(gap.appendText('});'))
		.pipe(dest('release/js'))
		.pipe(browserSync.stream());
}

function scriptsCopy() {
	return src(['dev/js/**/*[!common, all-scripts].js'])
		.pipe(gap.prependText('$(document).ready(function () {'))
		.pipe(gap.appendText('});'))
		.pipe(dest('release/js'))
		.pipe(browserSync.stream());
}

function scriptsComponent() {
	return src(['dev/components/**/*.js', '!dev/components/{header,footer}/*.js'])
		.pipe(dest('release/components/'))
		.pipe(browserSync.stream());
}

// --- HTML ---

function fileincludeDev() {
	return src('dev/*.html')
		.pipe(fileinclude())
		.pipe(replace(/[./A-Z0-9]*\/images/g, 'images'))
		.pipe(replace(/\.(jpg|jpeg|png)/g, '.webp'))
		.pipe(dest('release/'));
}

function fileincludeBuild() {
	return src('dev/*.html')
		.pipe(fileinclude())
		.pipe(replace(/[./A-Z0-9]*\/images/g, 'images'))
		.pipe(replace(/\.(jpg|jpeg|png)/g, '.webp'))
		.pipe(replace(/[./A-Z0-9]*\/all-style/g, '/common'))
		.pipe(replace(/[./A-Z0-9]*\/all-scripts/g, '/common'))
		.pipe(htmlbeautify(htmlBeautifyOptions))
		.pipe(dest('release/'));
}

// --- Шрифты ---

function outToTtf() {
	return src('dev/fonts/*.{eot,otf}')
		.pipe(fonter({ formats: ['ttf'] }))
		.pipe(dest('dev/fonts/'))
		.pipe(src('dev/fonts/*.ttf'))
		.pipe(fonter({ formats: ['woff'] }))
		.pipe(dest('dev/fonts/'))
		.pipe(src('dev/fonts/*.ttf'))
		.pipe(ttf2woff2())
		.pipe(dest('dev/fonts/'))
		.pipe(src('dev/fonts/*.{woff,woff2}'))
		.pipe(dest('dev/fonts/'));
}

function fontsStyle() {
	const fontsFile = 'dev/style/scss/fonts.scss';
	fs.readdir('dev/fonts/', function (err, fontsFiles) {
		if (fontsFiles && !fs.existsSync(fontsFile)) {
			fs.writeFile(fontsFile, '', () => {});
			let newFileOnly;
			for (let i = 0; i < fontsFiles.length; i++) {
				const fontFileName = fontsFiles[i].split('.')[0];
				if (newFileOnly !== fontFileName) {
					const fontName = fontFileName.split('-')[0] || fontFileName;
					let fontWeight = fontFileName.split('-')[1] || fontFileName;
					fontWeight = mapWeight(fontWeight);
					fs.appendFile(
						fontsFile,
						`@font-face {\n\tfont-family: ${fontName};\n\tfont-display: swap;\n\tsrc: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff");\n\tfont-weight: ${fontWeight};\n\tfont-style: normal;\n}\r\n`,
						() => {}
					);
					newFileOnly = fontFileName;
				}
			}
		}
	});
	return src('./dev');

	function mapWeight(w) {
		switch (w.toLowerCase()) {
			case 'thin':
				return 100;
			case 'extralight':
				return 200;
			case 'light':
				return 300;
			case 'medium':
				return 500;
			case 'semibold':
				return 600;
			case 'bold':
				return 700;
			case 'extrabold':
			case 'heavy':
				return 800;
			case 'black':
				return 900;
			default:
				return 400;
		}
	}
}

// --- BrowserSync и watching ---

function browserSyncFunction() {
	browserSync.init({ server: { baseDir: 'release/' } });
}

function watching() {
	watch(['dev/style/**/*.scss'], series(styleConcat, scss2cssMain));
	watch(['dev/components/**/*.scss'], styleConcat);
	watch(['dev/style/**/*.css'], cssCopy);
	watch(['dev/components/**/*.js'], scriptsConcat);
	watch(['dev/js/**/*.js'], scriptsConcat);
	watch(
		['dev/images/**/*.{jpg,jpeg,png,gif,webp,mp4,svg}'],
		series(cleanImages, parallel(copySvg, imageToWebpOnly), browserSync.reload)
	);
	watch(['dev/**/*.html'], fileincludeDev);
	watch(['dev/**/*.html']).on('change', browserSync.reload);
}

// --- Основные таски ---

const mainTasks = series(
	reset,
	copyfonts,
	cleanImages,
	parallel(copySvg, imageToWebpOnly),
	parallel(scriptsCopy, cssCopy, scss2cssMain, libraries)
);

function copyWebpToBuild() {
	return src('release/images/**/*.webp').pipe(dest('build/images'));
}

function copyOtherToBuild() {
	return src(['release/**/*', '!release/images/**']).pipe(dest('build'));
}

const addfonts = series(outToTtf, fontsStyle);

const dev = series(
	mainTasks,
	fileincludeDev,
	scriptsConcat,
	styleConcat,
	parallel(watching, browserSyncFunction)
);

const build = series(
	mainTasks,
	cleanBuild,
	copyWebpToBuild,
	copyOtherToBuild,
	fileincludeBuild,
	parallel(scriptsComponent, scss2cssComponent, styleConcatCommon, scriptsConcatCommon)
);

// --- Экспорт ---

exports.reset = reset;
exports.cleanImages = cleanImages;
exports.imageToWebpOnly = imageToWebpOnly;
exports.copySvg = copySvg;
exports.libraries = libraries;
exports.styleConcat = styleConcat;
exports.styleConcatCommon = styleConcatCommon;
exports.scss2cssComponent = scss2cssComponent;
exports.scss2cssMain = scss2cssMain;
exports.cssCopy = cssCopy;
exports.scriptsConcat = scriptsConcat;
exports.scriptsConcatCommon = scriptsConcatCommon;
exports.scriptsCopy = scriptsCopy;
exports.scriptsComponent = scriptsComponent;
exports.fileincludeDev = fileincludeDev;
exports.fileincludeBuild = fileincludeBuild;
exports.outToTtf = outToTtf;
exports.fontsStyle = fontsStyle;
exports.copyfonts = copyfonts;
exports.browserSyncFunction = browserSyncFunction;
exports.watching = watching;
exports.mainTasks = mainTasks;
exports.addfonts = addfonts;
exports.dev = dev;
exports.build = build;
exports.default = dev;
