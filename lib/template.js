const data_template = require('./data_template');

module.exports = {
    html: function (title, list, description, control, loginStatus) {
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
                    ${loginStatus}
                    <a href="/">main</a>
                    <input type="checkbox" id="menu1" name="menu">
                    <label for="menu1">menu1</label>
                    ${list}
                </li>
            </ul>
            <div id="content_container">
            ${description}
            </div>
            ${data_template.control(control)}
        </body>
        </html>
            `
    },
    create: function (info) {
        return `        
                <!doctype html>
                <html lang="en">
                    <meta charset="utf-8">
                    <head>
                        <title>${info.title}</title>
                        <script src="https://cdn.ckeditor.com/ckeditor5/20.0.0/classic/ckeditor.js"></script>
                        <style>
                            p{
                                height:1000px;
                            }
                        </style>
                    </head>
                    <body>
                            ${data_template.description(info)}
                    <script>
                        ClassicEditor
                            .create( document.querySelector( '#editor' ) )
                            .catch( error => {
                            console.error(error);
                                    } );
                    </script>
                    </body>
                </html>`
    },
    list: function (filelist) {
        // var list = `<ul>`;
        // for (var i = 0; i < filelist.length; i++) {
        //     list += `<li><a href="/page/${filelist[i].id}">${filelist[i].title}</a></li>`;
        // }
        // list += `</ul>`;
        // return list;
        var list = [];
        for (var i = 0; i < filelist.length; i++) {
            list.push({ id: filelist[i].id, title: filelist[i].title });
        }
        console.log(list.length);
        return list;
    }
}