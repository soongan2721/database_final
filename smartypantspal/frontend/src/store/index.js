import { createStore } from 'vuex';

export default createStore({
    state() {
        return {
            message: '',
        };
    },
    mutations: {
        setMessage(state, message) {
            state.message = message;
        },
    },
    actions: {
        updateMessage({ commit }, message) {
            commit('setMessage', message);
        },
    },
});
