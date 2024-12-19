// Import Vue Router modules
import { createRouter, createWebHistory } from 'vue-router';

// Import components
import main from '../views/Main/00-Main.vue';
import Login from '../views/Login/00-Login.vue';
import axios from 'axios';
import { loggedinAPI, CheckStudentTableAPI } from '@/config/ApiRoutes';

// for checking authentication
const check = true;

// Define route rules
const routes = [
    {
        path: '/login', // Route for the Login page
        name: 'Login',
        component: Login,
    },
    {
        path: '/main', // Route for the Main page
        name: 'main',
        redirect: '/main/home', // Redirect to '/main/home'
        component: main,
        children: [
            // Define child routes for the 'Main' page
            {
                path: 'home',
                name: 'Home',
                component: () => import('../views/Main/01-Home.vue'),
            },

            {
                path: 'test/',
                name: 'test',
                component: () => import('../views/Main/02-Test.vue'),
                children: [
                    // Define child routes for the 'test' page
                    {
                        path: 'history',
                        name: 'history',
                        component: () => import('../views/Main/02-Test/History.vue'),
                    },
                    {
                        path: 'detail/:id/:class/:sessionRange',
                        name: 'Detail',
                        component: () => import('../views/Main/02-Test/Detail.vue'),
                    },
                    {
                        path: 'question/:id/:class/:sessionRange', // Define route parameters
                        name: 'question',
                        component: () => import('../views/Main/02-Test/Question.vue'),
                        meta: { fallback: '/main/test/history' }, // Define meta information
                        beforeEnter: (to, from, next) => {
                            // Check route parameters before entering the route
                            if (!to.params.class || !to.params.sessionRange || !to.params.id) {
                                next({ name: '403' } || to.meta.fallback || from.path); // Navigate to 403 page if parameters are missing
                            } else {
                                // Make an API request to validate the parameters
                                axios
                                    .get(CheckStudentTableAPI, {
                                        params: {
                                            class_option: to.params.class,
                                            type_option: to.params.sessionRange,
                                            student: to.params.id,
                                        },
                                        withCredentials: true,
                                    })
                                    .then((response) => {
                                        if (response.data.length === 0) {
                                            next(); // If validation passes, continue navigation
                                        } else {
                                            next({ name: 'history' } || to.meta.fallback || from.path); // Redirect to history if data exists
                                        }
                                    })
                                    .catch((error) => {
                                        next({ name: '403' } || to.meta.fallback || from.path); // Navigate to 403 page if API request fails
                                    });
                            }
                        },
                    },
                ],
            },
            {
                path: 'practice/',
                name: 'practice',
                component: () => import('../views/Main/03-Practice.vue'),
                children: [
                    {
                        path: 'record',
                        name: 'record',
                        component: () => import('../views/Main/03-Practice/History.vue'),
                    },
                    {
                        path: 'detail/:id/:practice_id',
                        name: 'Detail',
                        component: () => import('../views/Main/03-Practice/Detail.vue'),
                    },
                    {
                        path: 'question',
                        name: 'quiz',
                        component: () => import('../views/Main/03-Practice/Question.vue'),
                    },
                ],
            },
            {
                path: 'analize',
                name: 'analize',
                component: () => import('../views/Main/04-Analize.vue'),
            },
            {
                path: 'manage',
                name: 'manage',
                component: () => import('../views/Main/05-Manage.vue'),
            },
            {
                path: 'class',
                name: 'class',
                component: () => import('../views/Main/06-Class.vue'),
            },
            {
                path: 'user_dashbroad',
                name: 'UserDashbroad',
                component: () => import('../views/Main/07-0-UserDashbroad.vue'),
            },
            {
                path: 'setting',
                name: 'setting',
                component: () => import('../views/Main/07-1-Setting.vue'),
            },
        ],
    },
    {
        path: '/', // Redirect root path to the main page's home
        redirect: '/main/home',
    },
    {
        path: '/403', // Route for 403 Forbidden page
        name: '403',
        component: () => import('../components/ResultPage/403.vue'),
    },
    {
        path: '/500', // Route for 500 Server Error page
        name: 'ServerError',
        component: () => import('../components/ResultPage/500.vue'),
    },
    {
        path: '/:pathMatch(.*)', // Route for handling all unmatched paths
        name: '404',
        component: () => import('../components/ResultPage/404.vue'),
    },
];

// Create router instance
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

// for checking 500 exist
let flag = false;

// Define authentication check function before route navigation
const check_function = async (to, from, next) => {
    if (flag) {
        // Encountered 500 problems
        flag = false;
        return true;
    } else {
        if (to.path === '/500') {
            // User attempts to enter the 500 page manually
            flag = false;
            return from.path;
        } else {
            try {
                // Send a GET request to check user login status
                const response = await axios.get(loggedinAPI, { withCredentials: true });
                flag = false;
                if (response.data[4] == true) {
                    // User is logged in
                    if (to.path === '/login') {
                        // User attempts to enter the login page
                        return from.path;
                    } else {
                        // User enters a non-login page
                        return true;
                    }
                } else {
                    // User is not logged in
                    if (to.path !== '/login') {
                        // User attempts to enter the non-login page
                        return '/login';
                    } else {
                        // User enters a login page
                        return true;
                    }
                }
            } catch (error) {
                flag = true;
                return '/500'; // Redirect to 500 page if the request fails
            }
        }
    }
};

// Add navigation guard to check authentication before each route
router.beforeEach(async (to, from, next) => {
    const result = await check_function(to, from);
    if (result === true && flag == false) {
        next();
    } else {
        next(result);
    }
});

// Export router instance
export default router;
