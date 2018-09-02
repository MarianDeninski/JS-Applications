const handlers = {};
$(()=> {
    let app = Sammy('#container', function () {
        this.use('Handlebars', 'hbs');

        this.get('index.html', function () {

            this.loadPartials({
                footer: './templates/common/footer.hbs'
            }).then(function () {
                this.partial('./templates/welcome.hbs');

            })
        });
        this.post(`#/loginForm`,handlers.login);
        this.post(`#/registerForm`,handlers.register);
        this.get(`#/logout`,handlers.logout);
        this.get(`#/homePage`, handlers.homePage);
        this.get(`#/remove/:id`,handlers.removed);
        this.post(`#/createForm/:id`, handlers.createEntries);
        this.get(`#/archive`, handlers.archivePage);
        this.get(`#/overview`, handlers.overview);
        this.get(`#/makeReceipt/:id`, handlers.makeReceipt);
        this.get(`#/details/:id`, handlers.details);
    }).run();
})