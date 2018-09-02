let handlers = {};

$(()=>{
    let pp = Sammy(`#container`, function () {
        this.use(`Handlebars`, `hbs`);

        this.get(`index.html`, function () {
            this.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs'
            }).then(function () {
                this.partial('./templates/welcome.hbs');
                notify.showInfo(`WELCOME MY FRIEND ;)`);
            });
        });
        this.get(`#/catalog`,handlers.catalog);
        this.post(`#/register`,handlers.register);
        this.post(`#/login`,handlers.login);
        this.get(`#/logout`, handlers.logout);
        this.get(`#/submit`, handlers.submit);
        this.get(`#/myPost`, handlers.myPost);
        this.get(`#/catal`, function (ctx) {
            ctx.redirect(`#/catalog`)
        });
        this.post(`#/submitButton`,handlers.submitButton);
        this.get(`#/delete/:id`,function (data) {

            service.deletePost(this.params.id).then(()=>{
                data.redirect(`#/catalog`);
                notify.showInfo(`The post is deleted`);
            })
        });
        this.get(`#/delete1/:id`,function () {

            service.deleteComment(this.params.id).then(()=>{

                history.go(-1);
                console.log('hey i am here');
                notify.showInfo(`Your comment is deleted`)
            })
        });
        this.get(`#/edit/:id`,handlers.edit);
        this.post(`#/update1/:id`,handlers.update1);
        this.post(`#/createComment/:id`,handlers.createComment);
        this.get(`#/comments/:id`,handlers.commentss);
    }).run();
});
function calcTime(dateIsoFormat) {
    let diff = new Date - (new Date(dateIsoFormat));
    diff = Math.floor(diff / 60000);
    if (diff < 1) return 'less than a minute';
    if (diff < 60) return diff + ' minute' + pluralize(diff);
    diff = Math.floor(diff / 60);
    if (diff < 24) return diff + ' hour' + pluralize(diff);
    diff = Math.floor(diff / 24);
    if (diff < 30) return diff + ' day' + pluralize(diff);
    diff = Math.floor(diff / 30);
    if (diff < 12) return diff + ' month' + pluralize(diff);
    diff = Math.floor(diff / 12);
    return diff + ' year' + pluralize(diff);
    function pluralize(value) {
        if (value !== 1) return 's';
        else return '';
    }
}