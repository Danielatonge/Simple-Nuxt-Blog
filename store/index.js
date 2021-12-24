
import axios from 'axios';
import Cookie from 'js-cookie'

export const state = () => ({
    posts: [],
    token: ""
})

export const mutations = {
    SET_POSTS(state, posts) {
        state.posts = posts;
    },
    ADD_POST(state, post) {
        state.posts.push(post);
    },
    UPDATE_POST(state, upDatePost) {
        // const postIndex = state.posts.findIndex(post => post.id === upDatePost.id);
        // state.posts[postIndex] = upDatePost;

        for (let post of state.posts) {
            if (post.id === upDatePost.id) {
                post = upDatePost;
            }
        }
    },
    SET_TOKEN(state, token) {
        state.token = token;
    },
    CLEAR_TOKEN(state) {
        state.token = null;
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
    async updatePost({ commit, state }, { postId, post }) {
        try {
            let token = state.token
            if (token || process.client) {
                token = localStorage.getItem('jwtToken')
            }
            const response = await axios.put(
                `https://nuxt-blog-9fbb2-default-rtdb.firebaseio.com/posts/${postId}.json?auth=${token}`,
                post
            )
            console.log(response.data)
            commit('UPDATE_POST', { ...response.data, id: postId });

        } catch (e) {
            console.error(e)

        }

    },
    setPosts({ commit }, posts) {
        console.log(posts)
        commit('SET_POSTS', posts);
    },
    async addPost({ commit, state }, post) {
        let token = state.token
        if (token || process.client) {
            token = localStorage.getItem('jwtToken')
        }
        try {
            const response = await axios.post(
                `https://nuxt-blog-9fbb2-default-rtdb.firebaseio.com/posts.json?auth=${token}`,
                { ...post, updatedDate: new Date() }
            )
            console.log(response.data.name)
            commit('ADD_POST', response.data.name)
        } catch (e) {
            console.error(e)
        }
    },
    async logIn({ commit, dispatch }, userInfo) {
        const key = process.env.fbAPIKey
        try {
            const response = await axios.post(
                `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${key}`,
                userInfo
            )
            const result = response.data
            commit('SET_TOKEN', result.idToken)
            localStorage.setItem('jwtToken', result.idToken)
            localStorage.setItem('tokenTimeout', new Date().getTime() + (result.expiresIn * 1000))

            Cookie.set('jwtToken', result.idToken)
            Cookie.set('tokenTimeout', new Date().getTime() + (result.expiresIn * 1000))

            dispatch('setLogoutTimer', result.expiresIn * 1000)
        } catch (e) {
            console.error(e)
        }
    },
    async registerUser({ commit }, userInfo) {
        const key = process.env.fbAPIKey
        try {
            return await axios.post(
                `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${key}`,
                userInfo
            )
        } catch (e) {
            console.error(e)
        }
    },
    setLogoutTimer({ commit }, duration) {
        setTimeout(() => {
            commit('CLEAR_TOKEN')
        }, duration)
    },
    initAuth({ commit, dispatch }, req) {
        let token, expireTime
        if (req) {
            if (!req.headers.cookie) {
                return;
            }
            const jwtToken = req.headers.cookie.split(';')
                .find(c => c.trim().startsWith('jwtToken'))
            if (!jwtToken) {
                return;
            }
            token = jwtToken.split('=')[1];
            expireTime = req.headers.cookie.split(';')
                .find(c => c.trim().startsWith('tokenTimeout')).split('=')[1]

            dispatch('setLogoutTimer', expireTime - new Date().getTime())
            commit('SET_TOKEN', token)
        } else {
            token = localStorage.getItem('jwtToken');
            expireTime = new Date(localStorage.getItem('tokenTimeout'))

            if (new Date().getTime() > expireTime || !token) {
                return;
            }
        }
        dispatch('setLogoutTimer', expireTime - new Date().getTime())
        commit('SET_TOKEN', token)
    }
}

export const getters = {
    isAuthenticated(state) {
        return state.token
    }
}
