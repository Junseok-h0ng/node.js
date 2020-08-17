module.exports = {
    //로그인 여부확인
    authIsOwner: function (req) {
        if (req.user) {
            return true;
        } else {
            return false;
        }
    },
    //로그인 상태
    loginStatus: function (req) {
        var authStatusUI = `
        <li><a href="/login">Login</a></li>
        <li><a href="/register" onclick="window.open(this.href, '_blank'
            , 'width=500px,height=700px,toolbars=no,scrollbars=no' ); return false;">Register</a></li>`;
        if (this.authIsOwner(req)) {
            authStatusUI = `
            <li><a href="/user/${req.user.id}">${req.user.displayname}</a></li>
            <li><a href="/logout">Logout</a></li>
            `
        }
        return authStatusUI;
    }
}