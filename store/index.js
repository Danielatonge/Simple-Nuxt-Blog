
import axios from 'axios';

export const state = () => ({
    posts: []
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
    async updatePost({ commit }, { postId, post }) {
        try {
            const response = await axios.put(
                `https://nuxt-blog-9fbb2-default-rtdb.firebaseio.com/posts/${postId}.json`,
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
    async addPost({ commit }, post) {
        try {
            const response = await axios.post(
                'https://nuxt-blog-9fbb2-default-rtdb.firebaseio.com/posts.json',
                { ...post, updatedDate: new Date() }
            )
            console.log(response.data.name)
            commit('ADD_POST', response.data.name)
        } catch (e) {
            console.error(e)
        }
    }
}
