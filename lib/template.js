module.exports = {
    html: function (title, list, description, control) {
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
                label{
                    cursor: pointer;
                }
                body>ul{
                    list-style:none;
                    padding:0;
                }
                li{
                    display:inline-block;
                    margin-left:5px;
                }
                #content_container{
                    width:100%;
                    height:500px;
                }
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
            list += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        }
        list += `</ul>`;
        return list;
    }
}