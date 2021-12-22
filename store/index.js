
import axios from 'axios';

export const state = () => ({
    posts: []
})

export const mutations = {
    SET_POSTS(state, posts) {
        state.posts = posts;
    }
}

export const actions = {
    nuxtServerInit(vuexContext, serverContext) {
        return axios.get('https://nuxt-blog-9fbb2-default-rtdb.firebaseio.com/posts.json')
    },
    setPosts({ commit }, posts) {
        commit('SET_POSTS', posts);
    }
}
