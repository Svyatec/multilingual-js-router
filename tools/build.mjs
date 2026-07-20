/**

 * build.mjs — RU сайт (svyatkozloff.ru/v2)

 *

 * 1. Читает _partials/header.html и _partials/footer.html

 * 2. Для каждого HTML-файла в корне и в portfolio/:

 *    - Если маркеры HEADER_START/END / FOOTER_START/END уже есть → заменяет содержимое

 *    - Если маркеров нет → автоматически вставляет их вокруг обнаруженных шапки/подвала

 *

 * Запуск: node tools/build.mjs

 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';

import { join, dirname } from 'node:path';

import { fileURLToPath } from 'node:url';



const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');



const headerPartial = readFileSync(join(ROOT, '_partials/header.html'), 'utf8').trim();

const footerPartial = readFileSync(join(ROOT, '_partials/footer.html'), 'utf8').trim();



/* ── добавляет маркеры, если их ещё нет ── */

function ensureMarkers(html, file) {

  let changed = false;



  if (!html.includes('<!-- HEADER_START -->')) {

    // Маркер до <header id="nav"

    if (html.includes('<header id="nav"')) {

      html = html.replace(/(<header\s+id="nav")/, '<!-- HEADER_START -->\n$1');

      // Маркер после закрытия #mobile-menu, перед <main

      if (html.includes('<main')) {

        html = html.replace(/(\n[ \t]*<main\b)/, '\n<!-- HEADER_END -->$1');

      } else {

        console.warn(`  ⚠  ${file}: не найден <main> для HEADER_END`);

      }

      changed = true;

    } else {

      console.warn(`  ⚠  ${file}: не найден <header id="nav"> — маркеры не добавлены`);

    }

  }



  if (!html.includes('<!-- FOOTER_START -->')) {

    if (html.includes('<footer')) {

      html = html.replace(/(<footer\b)/, '<!-- FOOTER_START -->\n$1');

      html = html.replace(/(<\/footer>)/, '$1\n<!-- FOOTER_END -->');

      changed = true;

    } else {

      console.warn(`  ⚠  ${file}: не найден <footer> — маркер не добавлен`);

    }

  }



  if (changed) console.log(`  + добавлены маркеры: ${file}`);

  return html;

}



/* ── заменяет содержимое между маркерами на парциалы ── */

function injectPartials(html) {

  html = html.replace(

    /<!-- HEADER_START -->[\s\S]*?<!-- HEADER_END -->/,

    `<!-- HEADER_START -->\n${headerPartial}\n<!-- HEADER_END -->`

  );

  html = html.replace(

    /<!-- FOOTER_START -->[\s\S]*?<!-- FOOTER_END -->/,

    `<!-- FOOTER_START -->\n${footerPartial}\n<!-- FOOTER_END -->`

  );

  return html;

}



function processFile(filePath, label) {

  let html = readFileSync(filePath, 'utf8');

  html = ensureMarkers(html, label);

  const injected = injectPartials(html);

  writeFileSync(filePath, injected, 'utf8');

  const hasH = injected.includes('<!-- HEADER_START -->');

  const hasF = injected.includes('<!-- FOOTER_START -->');

  console.log(`  ✓ ${label}${hasH ? '' : ' (без шапки)'}${hasF ? '' : ' (без подвала)'}`);

}



/* ── корневые HTML ── */

console.log('\n── Корень ──');

for (const file of readdirSync(ROOT).filter(f => f.endsWith('.html'))) {

  processFile(join(ROOT, file), file);

}



/* ── подпапки с общей шапкой/подвалом: portfolio, blog, blog/stack ── */

for (const sub of ['portfolio', 'blog', 'blog/stack']) {

  const dir = join(ROOT, sub);

  if (!existsSync(dir)) continue;

  console.log(`\n── ${sub}/ ──`);

  for (const file of readdirSync(dir).filter(f => f.endsWith('.html'))) {

    processFile(join(dir, file), `${sub}/${file}`);

  }

}



console.log('\nГотово.');

