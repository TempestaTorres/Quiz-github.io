import config from "./config.js";
import {HttpRequest} from "./validation.utils";

export class Auth {
    static accessTokenKey = 'accessToken';
    static refreshTokenKey = 'refreshToken';
    static userInfo = {
        name: '',
        lastName: '',
        email: '',
        userId: 0,
    }

    static setTokens(accessToken, refreshToken) {

        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }
    static getAccessToken() {
        return localStorage.getItem(this.accessTokenKey);
    }
    static getRefreshToken() {
        return localStorage.getItem(this.refreshTokenKey);
    }
    static clearAccessTokens() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
    }
    static accountManager(route) {

        const userAccount = document.querySelector(".user-account-wrapper");
        const userInfo = document.querySelector(".user-name");
        const accessToken = this.getAccessToken();
        let result = false;

        if (route) {

            if (accessToken) {
                userAccount.dataset.accountState = "login";
                let madJunInfo = localStorage.getItem("madJunUserInfo");

                if (madJunInfo) {
                    let user = JSON.parse(madJunInfo);

                    this.userInfo.name = user.name;
                    this.userInfo.lastName = user.lastName;
                    this.userInfo.email = user.email;
                    this.userInfo.userId = user.userId;

                    userInfo.textContent = Auth.userInfo.name + " " + Auth.userInfo.lastName;
                }

                if (route.route === '#/signup' || route.route === '#/login') {
                    location.href = "#/select";
                }
                else if (route.route === '#/logout') {
                    route.load();
                }
                else {
                    result = true;
                }
            }
            else {
                userAccount.dataset.accountState = "logout";
                result = true;
            }
        }

        return result;
    }
    static logoutManager() {

        const token = this.getRefreshToken();

        if (token) {

            const body = {
                refreshToken: token,
            };
            try {
                const r = this.sendLogoutRequest(config.host + "/logout",body);

                if (!r.error) {
                    this.clearAccessTokens();
                    localStorage.removeItem("madJunUserInfo");
                    this.userInfo.name = "";
                    this.userInfo.lastName = "";
                    this.userInfo.email = "";
                    this.userInfo.userId = 0;
                    location.href = "#/";
                }
            }
            catch (e) {
                location.href = "#/";
            }
        }
    }
    static async sendLogoutRequest(url, body) {

        return await HttpRequest.sendRequest(url,"POST",body);
    }
}