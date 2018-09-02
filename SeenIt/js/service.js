let service = {
    getAllPost: function () {

        return remote.get(`appdata`, `posts?query={}&sort={"_kmd.ect": -1}`)

    },
    createPost: function (post) {
        return remote.post('appdata', 'posts', post);
    },
    editPost: function (post_id,data) {

        return remote.update(`appdata`,`posts/${post_id}`,data)

    },
    deletePost: function (post_id) {

        return remote.remove('appdata', 'posts/' + post_id)

    },
    viewOnePost: function (post_id) {

        return remote.get('appdata', 'posts/' + post_id)

    },
    viewPostComments: function (post_id) {

        return remote.get(`appdata`, `comments?query={"postId":"${post_id}"}&sort={"_kmd.ect": -1}`,);
    },
    createComments: function (data) {

        return remote.post(`appdata`, `comments`,data)
        
    },
    deleteComment: function (commentId) {

        return remote.remove(`appdata`, `comments/`+commentId )
        
    }
};