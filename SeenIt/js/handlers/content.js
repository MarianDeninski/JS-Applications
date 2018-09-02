handlers.register = function (ctx) {

    let username = ctx.params.username;
    let password = ctx.params.password;
    let repeat = ctx.params.repeatPass;

    if (password !== repeat) {
        notify.showError("Passwords don't match");
        return;
    }
    auth.register(username, password).then((data) => {
        auth.saveSession(data);
        ctx.redirect('#/catalog');
    });
};

handlers.login = function (ctx) {
    let username = ctx.params.username;
    let password = ctx.params.password;
    auth.login(username, password).then((data) => {
        auth.saveSession(data);
        ctx.redirect('#/catalog');
        notify.showInfo(`Login successful`);
    }).catch((data) => {
        notify.handleError(data);
    });
};

handlers.catalog = function (ctx) {

    ctx.username = localStorage.getItem(`username`);
    ctx.loadPartials({
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs',
        post: `./templates/common/post.hbs`
    }).then(function () {
        ctx.partials = this.partials;
        this.partial('./templates/catalog.hbs');
        let num = 1;
        service.getAllPost().then((data) => {

            data.map(c => {
                c.number = num++;
                c.time = calcTime(c._kmd.ect);
                c.isAuthor = c._acl.creator === localStorage.getItem(`id`);
            });
            ctx.render(`./templates/listPosts.hbs`, {data}).then(function () {
                this.replace(`#viewCatalog`);
            })
        })
    });
};

handlers.logout = function (ctx) {

    auth.logout().then((sadx) => {
        localStorage.clear();
        this.redirect('#');
    }).catch(notify.handleError);
};





handlers.submit = function (ctx) {
    ctx.username = localStorage.getItem(`username`);

    ctx.loadPartials({
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs'
    }).then(function () {
        this.partial('./templates/submit.hbs');
    });
};





handlers.myPost = function (ctx) {
    ctx.username = localStorage.getItem(`username`);

    ctx.isPost = true;
    ctx.loadPartials({

        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs',
        post: `./templates/common/post.hbs`
    }).then(function () {
        ctx.partials = this.partials;
        this.partial('./templates/catalog.hbs');
        let num = 1;
        service.getAllPost().then((data) => {

            data.map(c => {
                c.number = num++;
                c.time = calcTime(c._kmd.ect);
                c.isAuthor = c._acl.creator === localStorage.getItem(`id`);
            });
            data = data.filter(a => a.isAuthor === true);

            ctx.render(`./templates/listPosts.hbs`, {data}).then(function () {
                this.replace(`#viewCatalog`);
            })
        })
    });
};






handlers.submitButton = function (ctx) {

    let data = {
        author: localStorage.getItem(`username`),
        comment: ctx.params.comment,
        imageUrl: ctx.params.image,
        title: ctx.params.title,
        url: ctx.params.url
    };
    if (ctx.params.url.length === 0 || ctx.params.comment.length === 0 || ctx.params.image.length === 0
        || ctx.params.title.length === 0) {
        notify.showInfo(`Please fill the blank field`);
        return;
    }
    if (ctx.params.url.slice(0, 4) !== `http`) {
        notify.showError(`Url form is not correct`);
        return;
    }
    service.createPost(data).then(() => {
        notify.showInfo(`Post created!`);
        ctx.redirect(`#/catalog`)
    })
};





handlers.edit = function (ctx) {
    ctx.username = localStorage.getItem(`username`);
    service.getAllPost().then((data) => {
        let here = data.filter(e => {
            if (e._id === ctx.params.id) {
                return e
            }
        });
        $(`#editPostForm`).find(`input[name="url"]`).val(here[0].url);
        $(`#editPostForm`).find(`input[name="title"]`).val(here[0].title);
        $(`#editPostForm`).find(`input[name="image"]`).val(`${here[0].imageUrl}`);
        $(`#editPostForm`).find(`textarea[name="description"]`).text(`${here[0].description}`);
    });
    ctx.myId = ctx.params.id;

    ctx.loadPartials({
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs'
    }).then(function () {
        ctx.partials = this.partials;
        this.partial('./templates/edit.hbs');
    });
};





handlers.update1 = function (ctx) {

    let data = {
        "url": ctx.params.url,
        "title": ctx.params.title,
        "imageUrl": ctx.params.image,
        "description": ctx.params.description
    };
    service.editPost(ctx.params.id, data).then(() => {
        ctx.redirect(`#/catalog`);
        notify.showInfo(`Edit successful`)
    })
};





handlers.commentss = function (ctx) {
    ctx.username = localStorage.getItem(`username`);
    service.viewOnePost(ctx.params.id).then((data) => {

        ctx.times = calcTime(data._kmd.ect);
        ctx.url = data.url;
        ctx.title = data.title;
        ctx.imageUrl = data.imageUrl;
        ctx.description = data.description;
        ctx.time = data.time;
        ctx.isAuthor = data._acl.creator === localStorage.getItem(`id`);
        ctx.commentId = ctx.params.id;

        ctx.loadPartials({

            header: './templates/common/header.hbs',
            footer: './templates/common/footer.hbs',
            comments: `./templates/common/comments.hbs`

        }).then(function () {
            ctx.partials = this.partials;

            this.partial('./templates/comments.hbs');

            service.viewPostComments(ctx.params.id).then((data) => {

                data.map(c => {
                    c.time = calcTime(c._kmd.ect);
                    c.isAuthor = c._acl.creator === localStorage.getItem(`id`);
                });
                ctx.render(`./templates/listComments.hbs`, {data}).then(function () {
                    this.replace(`#comments`)
                })
            })
        });
    });
};





handlers.createComment = function (ctx) {

    let data = {
        'postId': ctx.params.id,
        'content': ctx.params.content,
        'author': localStorage.getItem(`username`),
    };
    service.createComments(data).then(() => {
        ctx.redirect(`#/comments/` + ctx.params.id)
    })
};


