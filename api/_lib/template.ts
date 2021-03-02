
import { readFileSync } from 'fs';
import marked from 'marked';
import { sanitizeHtml } from './sanitizer';
import { ParsedRequest } from './types';
const twemoji = require('twemoji');
const twOptions = { folder: 'svg', ext: '.svg' };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const font = readFileSync(`${__dirname}/../_fonts/name_sans-variable.woff2`).toString('base64');

function getCss(theme: string, fontSize: string) {
    let background = '#0d0a54';
    let foreground = '#faf8ed';
    let radial = '#1a2cb7';

    if (theme === 'aqp') {
        background = '#055343';
        foreground = '#faf8ed';
        radial = '#0e4755';
    }

    if (theme === 'light') {
        background = '#faf8ed';
        foreground = '#1a2cb7';
        radial = 'transparent';
    }
    return `
    @font-face {
        font-family: 'Name Sans';
        src: url(data:font/woff2;charset=utf-8;base64,${font}) format('woff2');
    }

    body {
        background: ${background};
        background-image: radial-gradient(circle at left bottom, ${radial} 2%, transparent 80%);
        background-repeat: no-repeat;
        height: 100vh;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        font-family: 'Name Sans';
        font-weight: 400;
    }

    .logo-wrapper {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;
        justify-items: center;
    }

    .logo {
        margin: 0 75px;
    }

    .plus {
        color: #BBB;
        font-family: 'Name Sans', Times New Roman, Verdana;
        font-weight: 200;
        font-size: 150px;
    }

    .spacer {
        margin: 150px;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }
    
    .heading {
        font-family: 'Name Sans', sans-serif;
        font-size: ${sanitizeHtml(fontSize)};
        font-style: normal;
        color: ${foreground};
        line-height: 1.8;
    }
    
    code {
        color: #4294ed;
        font-family: 'Name Sans';
        font-optical-sizing: 12;
        font-weight: 300;
        white-space: pre-wrap;
    }

    code:before, code:after {
        content: '\`';
    }

    strong {
        font-weight: 700;
    }
    `;
}

export function getHtml(parsedReq: ParsedRequest) {
    const { text, theme, md, fontSize, images, widths, heights } = parsedReq;
    return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize)}
    </style>
    <body>
        <div>
            <div class="spacer">
            <div class="logo-wrapper">
                ${images.map((img, i) =>
                    getPlusSign(i) + getImage(img, widths[i], heights[i])
                ).join('')}
            </div>
            <div class="spacer">
            <div class="heading">${emojify(
                md ? marked(text) : sanitizeHtml(text)
            )}
            </div>
        </div>
    </body>
</html>`;
}

function getImage(src: string, width ='auto', height = '225') {
    return `<img
        class="logo"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />`
}

function getPlusSign(i: number) {
    return i === 0 ? '' : '<div class="plus">+</div>';
}
