import fs from 'fs';
import woff2base64 from 'woff2base64';

const font = {
  src: 'static/font/Badd-Mono-Regular.woff2',
  dest: 'assets/css/baddmono.css',
  family: 'Badd Mono'
}

const fonts = {
  [font.src.split(/[\s/]+/)]: fs.readFileSync(font.src)
};

const options = {
  fontFamily: font.family,
  fontFaceTemplate: '@font-face{ font-family:"<%=family%>";font-display:swap;src:url(<%=uri%>) format("<%=format%>");font-weight:<%=weight%>;font-style:<%=style%>;}'
};

const css = woff2base64(fonts, options);

fs.writeFileSync(font.dest, css.woff2);