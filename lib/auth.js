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
        var authStatusUI = `<a href="/page/login">login</a> | <a href="/page/register">Register</a>`;
        if (this.authIsOwner(req)) {
            authStatusUI = `${req.user.nickname} |
            <a href="/logout">logout</a>`;
        }
        return authStatusUI;
    }
}