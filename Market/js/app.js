let handlers = {};

$(() => {
    let pp = Sammy(`#app`, function () {
        this.use(`Handlebars`, `hbs`);

        this.get(`market.html`, function () {
            this.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs'
            }).then(function () {
                this.partial('./templates/welcome.hbs');
            });
        });
        this.get(`#/login`, handlers.login);
        this.post(`#/loginForm`, handlers.loginForm);
        this.get(`#/register`, handlers.register);
        this.post(`#/registerForm`, handlers.registerForm);
        this.get(`#/logout`, handlers.logout);
        this.get(`#/userHome`, handlers.userHome);
        this.get(`#/shop`, handlers.homeShop);
        this.get(`#/home`, function (ctx) {
            ctx.redirect(`#`)
        });
        this.get(`#/homeUser`, function (ctx) {
            ctx.redirect(`#/userHome`)
        });
        this.post(`#/shop123/:id`, handlers.purchase);
        this.get(`cart`,handlers.cart);
        this.get(`#/cart123/:id`,handlers.delete123);


    }).run();
});


