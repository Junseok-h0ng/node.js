module.exports = {
    control: function (control) {
        if (control) {
            return `
            <p>by ${control.displayname}</p>
            <ul>
                <li><a href="/form/create">create</a></li>
                <li><a href="/form/update/${control.pageID}">update</a></li>
                <form action ="/process/delete" method="post">
                    <input type="hidden" name="id" value="${control.pageID}">
                    <input type="submit" value="delete">
                </form>
            </ul>
            `
        } else {
            return '';
        }
    },
    description: function (info) {
        if (info.title == 'createPage') {
            return `
            <form action="/process/create" method="POST">
                <input type="text" placeholder="title" name="title">
                <textarea id="editor" name="description"></textarea>
                <input type="submit">
            </form>
            <input type="button" value="back" onclick="window.history.back()"></input>`;
        } else {
            return `
            <form action="/process/update" method="POST">
                <input type="hidden" name="id"value="${info.pageID}">
                <input type="text" placeholder="title" name="title" value="${info.title}">
                <textarea id="editor" name="description">${info.data}</textarea>
                <input type="submit">
            </form>
            <input type="button" value="back" onclick="window.history.back()"></input>`;
        }

    },
    register: function (feedback) {
        return `
            <h1 style = "color:red">${feedback}</h1>
                <form action = "/process/register" method = "post">
                   <p><input type="text" placeholder="nickname" name="nickname"></p>
                   <p><input type="text" placeholder="email" name ="email"></p>
                   <p><input type="password" placeholder="password" name="pwd"></p>
                   <p><input type="password" placeholder="password" name="pwd2"></p>
                    <input type="submit" value="register">
                </form>`;
    },
    login: function (feedback) {
        return `
        <h1 style = "color:red">${feedback}</h1>
                <form action = "/login_process" method = "post">
                    <input type="text" placeholder="email" name ="email">
                    <input type="password" placeholder="password" name="pwd">
                    <input type="submit" value="login">
                </form>`;
    },
    login_control: function () {
        return `
        <a href="/form/register">Register</a> |
        <a href="/auth/google">with Google</a> |
        <a href="/auth/naver">with Naver</a>
        `;
    }
}