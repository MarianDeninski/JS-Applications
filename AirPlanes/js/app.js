const handlers = {};
$(()=>{
    let app = Sammy('#container',function () {
        this.use('Handlebars','hbs');

        this.get('index.html',function () {

            this.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs'
            }).then(function () {
                this.partial('./templates/register.hbs');

            })
        });

        this.get(`#/home`, handlers.home);
        this.post(`#/login`,handlers.login);
        this.get(`#/logout`,handlers.logout);
        this.post('#/register', handlers.register);
        this.post('#/postFlight', handlers.postFlight);
        this.post('#/updateFlight/:id', handlers.updateFlight);
        this.get(`#/register`,function(ctx){
            ctx.loadPartials({
                header: `./templates/common/header.hbs`,
                footer: `./templates/common/footer.hbs`,
            }).then(function () {
                this.partial(`templates/register.hbs`);
            })
        });
        this.get(`#/login`,function(ctx){
            ctx.loadPartials({
                header: `./templates/common/header.hbs`,
                footer: `./templates/common/footer.hbs`,
            }).then(function () {
                this.partial(`templates/login.hbs`);
            })
        });
        this.get(`#/delete/:id`,handlers.delete);
        this.get(`#/details/:id`,handlers.details);
        this.get(`#/edit/:id`,handlers.edit);
        this.get(`#/addFlight`, handlers.addFlight);
        this.get(`#/myFlights`,handlers.myFlights);




    }).run();
});
