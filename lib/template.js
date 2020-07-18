module.exports = {
    html: function (title, list, description) {
        return `
        <!doctype html>
        <html>
        <head>
            <title>${title}</title>
            <meta charset = "utf-8">
            <link href="../img/fontello-283053c9/css/fontello.css">
            <style>
                input[type="checkbox"]{
                    display:none;
                }
                input[type="checkbox"]~ul{
                    visibility:hidden;
                }
                input[type="checkbox"]:checked~ul{
                    visibility:visible;
                }
                ul{
                    list-style:none;
                }
            </style>
        </head>
        <body>
            <ul>
                <li>
                    <input type="checkbox" id="menu1">
                    <label for="menu1">menu1</label>
                    ${list}
                </li>
            </ul>
            
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