
import axios from 'axios';

export const state = () => ({
    posts: []
})

export const mutations = {
    SET_POSTS(state, posts) {
        state.posts = posts;
    },
    UPDATE_POST(state, upDatePost) {
        for (let post of state.posts) {
            if (post.id === upDatePost.id) {
                post = upDatePost;
            }
        }
    }
}

export const actions = {
    async nuxtServerInit(vuexContext, serverContext) {
        try {
            const response = await axios.get('https://nuxt-blog-9fbb2-default-rtdb.firebaseio.com/posts.json')

            const result = []
            for (const key in response.data) {
                result.push({ ...response.data[key], id: key })
            }

            vuexContext.commit('SET_POSTS', result);
        } catch (errorObject) {
            serverContext.error(errorObject)
        }
    },
    updatePost({ commit }, post) {
        commit('UPDATE_POST', post);
    },
    setPosts({ commit }, posts) {
        commit('SET_POSTS', posts);
    }
}
