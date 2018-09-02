let service = {
    getAllProducts: function () {

        return remote.get(`appdata`, `products`)
    },
    getOneProduct: function (id) {

        return remote.get(`appdata`, `products/${id}`)
    },
    createPost: function (post) {
        return remote.post('appdata', 'posts', post);
    },
    deletePost: function (post_id) {

        return remote.remove('appdata', 'posts/' + post_id)
    },
    subscribe: function (subs, target) {
        let newSubs = subs.slice(0);
        newSubs.push(target);
        return remote.update('user', localStorage.getItem('id'), {purchase: newSubs});
    },

};