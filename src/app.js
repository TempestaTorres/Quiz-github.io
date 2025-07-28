import {Router} from './router.js';

(function () {

    const newRouter = new Router();

    window.addEventListener('DOMContentLoaded', routerHandler);
    window.addEventListener('popstate', routerHandler);

    function routerHandler() {

        "use strict";

        newRouter.openRoute();
    }

})();