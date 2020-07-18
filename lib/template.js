module.exports = {
    html: function (title, list, description) {
        return `
        <!doctype html>
        <html>
        <head>
            <title>${title}</title>
            <meta charset = "utf-8">
            <style>
                ul{
                    list-style: none;
                }
                li{
                    display:inline-block;
                }
            </style>
        </head>
        <body>
            ${list}
            <p>${description}</p>
        </body>
        </html>
            `
    },
    list: function (filelist) {
        var list = `<ul>`;
        for (var i = 0; i < filelist.length; i++) {
            list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        }
        list += `</ul>`;
        return list;
    }
}