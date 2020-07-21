module.exports = {
    html: function (title, list, description, control) {
        return `
        <!doctype html>
        <html>
        <head>
            <title>${title}</title>
            <meta charset = "utf-8">
            <link href="../img/fontello-283053c9/css/fontello.css">
            <link rel="stylesheet" href="/css/template_style.css" type="text/css">
            <style>
            </style>
        </head>
        <body>
            <ul>
                <li>
                    <a href="/">main</a>
                    <input type="checkbox" id="menu1" name="menu">
                    <label for="menu1">menu1</label>
                    ${list}
                </li>
            </ul>
            <div id="content_container">
            ${description}
            </div>
            ${control}
        </body>
        </html>
            `
    },
    list: function (filelist) {
        var list = `<ul>`;
        for (var i = 0; i < filelist.length; i++) {
            list += `<li><a href="/page/${filelist[i]}">${filelist[i]}</a></li>`;
        }
        list += `</ul>`;
        return list;
    }
}