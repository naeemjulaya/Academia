const fs = require('fs');
const path = require('path');

function convertHtmlToJsx(html) {
  return html
    .replace(/class=/g, 'className=')
    .replace(/for=/g, 'htmlFor=')
    .replace(/<!--(.*?)-->/g, '{/* $1 */}')
    .replace(/<img(.*?)>/g, (match) => {
      if (!match.endsWith('/>')) return match.replace('>', ' />');
      return match;
    })
    .replace(/<input(.*?)>/g, (match) => {
      if (!match.endsWith('/>')) return match.replace('>', ' />');
      return match;
    })
    .replace(/<br>/g, '<br />')
    .replace(/<hr>/g, '<hr />')
    .replace(/style="([^"]*)"/g, (match, p1) => {
      const styles = p1.split(';').filter(Boolean).reduce((acc, style) => {
        const [key, value] = style.split(':').map(s => s.trim());
        if (!key || !value) return acc;
        const camelKey = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
        acc[camelKey] = value.replace(/'/g, '"');
        return acc;
      }, {});
      return `style={${JSON.stringify(styles)}}`;
    });
}

function extractMainContent(html) {
  const mainStart = html.indexOf('<div class="max-w-[1280px]');
  if (mainStart === -1) {
     const altStart = html.indexOf('<main');
     if (altStart === -1) return html;
     const altEnd = html.indexOf('</main>');
     return html.substring(altStart, altEnd + 7);
  }
  const endMarker = '<!-- Micro-interaction Script -->';
  let end = html.indexOf(endMarker);
  if (end === -1) end = html.indexOf('</main>');
  return html.substring(mainStart, end).trim();
}

const dir = path.join(__dirname, 'stitch_html');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(f => {
  const html = fs.readFileSync(path.join(dir, f), 'utf8');
  let content = extractMainContent(html);
  // Remove the </main> if it was caught and we are wrapping it
  if (content.endsWith('</main>')) content = content.substring(0, content.length - 7);
  if (content.startsWith('<main')) content = content.substring(content.indexOf('>') + 1);
  
  content = convertHtmlToJsx(content);

  const compName = f.replace('.html', '').replace(/[^a-z0-9]/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  
  const tsx = `import React from 'react'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export default async function ${compName}() {
  return (
    ${content}
  )
}
`;
  fs.writeFileSync(path.join(dir, f.replace('.html', '.tsx')), tsx);
  console.log('Converted', f);
});
