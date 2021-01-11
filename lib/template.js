const template = {
  List: (list) => {
    let i = 0;
    let content = "<ul>";
    for (i = 0; i < list.length; i++) {
      content = content + `<li><a href="?id=${list[i]}">${list[i]}</a></li>`;
    }
    content = content + "</ul>";
    return content;
  },
  HTML: (title, content, body, control) => {
    return `<!doctype html>
      <html>
      <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">WEB</a></h1>
        ${content}
        ${control} 
        ${body}
      </body>
      </html>
      `;
  },
};

module.exports = template;
