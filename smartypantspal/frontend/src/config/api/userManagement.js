// const BaseRoute   = "//smartypantspal.com" //for product version
// const BaseRoute   = "//127.0.0.1:8000" //for dev and docker version

const API_BASE = `${BaseRoute}/api`;

const AuthAPI = {
    loginAPI: `${API_BASE}/loginn`,
    loggedinAPI: `${API_BASE}/login_check`,
    logoutAPI: `${API_BASE}/logout`,
    signupAPI: `${API_BASE}/signup`,
    CheckNameAPI: `${API_BASE}/check_username`,
    getPermissionAPI: `${API_BASE}/get_permission`,
    ChangePasswordAPI: `${API_BASE}/ChangePassword`,
    CheckPasswordAPI: `${API_BASE}/CheckPassword`
};