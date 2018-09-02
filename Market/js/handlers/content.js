handlers.register = function (ctx) {
    ctx.loadPartials({
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs',
    }).then(function () {
        this.partial('./templates/register.hbs');
    })
};
handlers.registerForm = function (ctx) {

    let username = ctx.params.username;
    let password = ctx.params.password;
    let name = ctx.params.name;

    if(name.length === 0){
        notify.showError(`please fill the name`);
        return;
    }
    console.log(ctx);


    auth.register(username, password).then((data) => {
        auth.saveSession(data);
        ctx.redirect('#/userHome');
    });
};
handlers.login = function (ctx) {
    ctx.loadPartials({
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs',
    }).then(function () {
        this.partial('./templates/login.hbs');
    })
};
handlers.loginForm = function (ctx) {
    console.log(ctx);
    let username = ctx.params.username;
    let password = ctx.params.password;
    auth.login(username, password).then((data) => {
        auth.saveSession(data);
        ctx.redirect('#/userHome');
        notify.showInfo(`Login successful`);
    }).catch((data) => {

        notify.handleError(data);
    });
};
handlers.logout = function () {

    console.log('Tuk sum');
    auth.logout().then((sda) => {
        localStorage.clear();
        this.redirect('#');
    }).catch(notify.handleError);
};
handlers.userHome = function (ctx) {

    ctx.username = localStorage.getItem(`username`);
    ctx.login = localStorage.length !== 0;
    ctx.loadPartials({
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs',
    }).then(function () {
        this.partial('./templates/userHome.hbs');
    })

};
handlers.homeShop = function (ctx) {

    ctx.username = localStorage.getItem(`username`);
    ctx.login = localStorage.length !== 0;

    ctx.loadPartials({
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs',
        tB: `./templates/common/tB.hbs`
    }).then(function () {
        ctx.partials = this.partials;
        this.partial('./templates/homeShop.hbs');

        service.getAllProducts().then(function (data) {

            for (let obj of data) {

                obj.price = obj.price.toFixed(2);
            }
            ctx.render(`./templates/common/vsp.hbs`, {data}).then(function () {
                console.log(data);

                this.replace(`#shopProducts`);

            });


        });


    });
};
handlers.purchase = function (ctx) {
    let subs = JSON.parse(localStorage.getItem('purchase')) || [];
    let target = ctx.params.id;
    console.log(ctx);

    service.subscribe(subs, target).then(res => {
        console.log(res);

        notify.showInfo('Purchase to ' + res.username);
        auth.saveSession(res);
        console.log('i am here');
    }).catch(notify.handleError);

};
handlers.cart = function (ctx) {
    ctx.username = localStorage.getItem(`username`);
    ctx.login = localStorage.length !== 0;

    ctx.loadPartials({
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs',
        tB2: `./templates/common/tB2.hbs`
    }).then(function () {
        ctx.partials = this.partials;
        this.partial('./templates/cart.hbs');


        let data = localStorage.getItem(`purchase`);

        data = JSON.parse(data);

        let names = data;
        let uniqueNames = [];
        let massive = [];
        $.each(names, function (i, el) {
            if ($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
        });

      for (let obj of uniqueNames) {
            let count = 0;


            for (let obj1 of data) {

                if (obj === obj1) {
                    count++;

                }
            }
          service.getOneProduct(obj).then((data) => {

              data.quantity = count;
              data.allprice = (count * data.price).toFixed(2);


              massive.unshift(data);
              ctx.render(`./templates/common/vsp2.hbs`, {massive}).then(function (){

                  this.replace(`#cartProducts`);
              })

          });

        }


    });

};
handlers.delete123 = function (ctx) {

    let data = localStorage.getItem(`purchase`);
    let newMasiive = JSON.parse(data);
    let useriD = localStorage.getItem(`id`);
    console.log(useriD);
   let mass =  newMasiive.filter(a=> a!==ctx.params.id);
   console.log(newMasiive);
   console.log(mass);

    remote.update('user', useriD, {purchase: mass}).then((v)=>{
        auth.saveSession(v);
        notify.showInfo(`Purchase is deleted`);
        history.go(-1);
    })






};



