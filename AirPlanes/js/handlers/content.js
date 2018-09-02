handlers.login = function (ctx) {
    console.log(ctx);
    let username = ctx.params.username;
    let password = ctx.params.pass;
    auth.login(username, password).then((data) => {
        auth.saveSession(data);
        ctx.redirect('#/home');
    }).catch((data) =>{
        notify.handleError(data);
    });
};
handlers.register = function (ctx) {


    let username = ctx.params.username;
    let password = ctx.params.pass;
    let repeat = ctx.params.checkPass;

    // Don't allow submission of empty forms
    if (username.length < 5) {
        notify.showError('Username must be at least 5 characters long');
        return;
    }
    if (password.length === 0) {
        notify.showError('Password cannot be empty');
        return;
    }
    if (password !== repeat) {
        notify.showError("Passwords don't match");
        return;
    }


    auth.register(username, password).then((data) => {
        auth.saveSession(data);
        ctx.redirect('#/home');

    });
};
handlers.logout = function () {

    auth.logout().then((res) => {
        localStorage.clear();
        this.redirect('#');
    }).catch(notify.handleError);

};
handlers.home  = function (ctx) {



    ctx.login = localStorage.getItem(`username`);

    ctx.username = localStorage.getItem(`username`);



    console.log(`i am here`);

    ctx.loadPartials({
        header: `./templates/common/header.hbs`,
        footer: `./templates/common/footer.hbs`,
        flight: `./templates/common/flight.hbs`

    }).then(function () {
        ctx.partials = this.partials;

        service.getPublishedflights().then((data)=>{
            console.log(data);


            let om = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            data.map(a=>a.date = new Date(a.departureDate).getDate() + ` ${om[new Date(a.departureDate).getMonth()]}`);

            console.log(data);
            this.partial(`templates/home.hbs`,{data});


        });



    });

};
handlers.delete = function () {
    console.log('hello');
    let id = this.params.id;
    service.deleteFlight(id).then(res => {
        notify.showInfo('Destination deleted');

        this.redirect('#/myFlights');
    }).catch(notify.handleError);
};
handlers.addFlight = function (ctx) {

    ctx.loadPartials({
        header: `./templates/common/header.hbs`,
        footer: `./templates/common/footer.hbs`

    }).then(function () {
        ctx.partials = this.partials;

        this.partial(`templates/addFlight.hbs`);
    });

};
handlers.updateFlight = function (ctx) {

    console.log(ctx);
    let destination = ctx.params.destination;
    let origin = ctx.params.origin;
    let departureDate = ctx.params.departureDate;
    let seats = ctx.params.seats;
    let cost = ctx.params.cost;
    let img = ctx.params.img;
    let public2 = ctx.params.public;
    let departureTime = ctx.params.departureTime;
    let id = ctx.params.id;

    console.log(id);



    if(public2 === `on`){
        public2 = true;
    }else{
        public2 = false
    }

    let obj =
        {
            "destination": destination,
            "origin": origin,
            "departureDate": departureDate,
            "seats": seats,
            "cost": cost,
            "img": img,
            "isPublished": public2,
            "departureTime": departureTime
        };
    service.editFlight(obj,id).then(() => {
        notify.showInfo(`flight is updated!`);
        ctx.redirect(`#/home`);
    });


};
handlers.postFlight = function (ctx) {



    let destination = ctx.params.destination;
    let origin = ctx.params.origin;
    let departureDate = ctx.params.departureDate;
    let seats = ctx.params.seats;
    let cost = ctx.params.cost;
    let img = ctx.params.img;
    let public2 = ctx.params.public;
    let departureTime = ctx.params.departureTime;

    console.log(ctx);



    if(public2 === `on`){
        public2 = true;
    }else{
        public2 = false
    }

    let obj =
        {
            "destination": destination,
            "origin": origin,
            "departureDate": departureDate,
            "seats": seats,
            "cost": cost,
            "img": img,
            "isPublished": public2,
            "departureTime": departureTime
        };
    service.createFlight(obj).then(() => {
        notify.showInfo(`flight is created!`);
        ctx.redirect(`#/home`);
    });


};
handlers.details = function (ctx) {



    service.flightDetails(ctx.params.id).then((data1)=>{

        ctx.id = data1._id;
        ctx.login = localStorage.getItem(`username`);
        ctx.username = localStorage.getItem(`username`);
        console.log(data1);
        ctx.destination = data1.destination;
        ctx.img = data1.img;
        ctx.cost = data1.cost;
        ctx.departureDate = data1.departureDate;
        ctx.origin = data1.origin;
        ctx.seats = data1.seats;

        ctx.same = localStorage.getItem(`id`)===data1._acl.creator;

        ctx.loadPartials({
            header: `./templates/common/header.hbs`,
            footer: `./templates/common/footer.hbs`,



        }).then(function () {
            ctx.partials = this.partials;


                this.partial(`templates/details.hbs`);

            });




    })

};
handlers.edit = function (ctx) {

    service.flightDetails(ctx.params.id).then((data1)=>{


        ctx.id = data1._id;
        ctx.login = localStorage.getItem(`username`);
        ctx.username = localStorage.getItem(`username`);
        ctx.destination = data1.destination;
        ctx.img = data1.img;
        ctx.cost = data1.cost;
        ctx.departureDate = data1.departureDate;
        ctx.origin = data1.origin;
        ctx.seats = data1.seats;
        ctx.departureTime = data1.departureTime;

        console.log(ctx.destination);
        console.log(ctx.cost);



        let published = data1.isPublished;

        if(published === true){
            ctx.public = `on`;
        }else{
            ctx.public = `undefined`;
        }

        ctx.loadPartials({
            header: `./templates/common/header.hbs`,
            footer: `./templates/common/footer.hbs`

        }).then(function () {
            ctx.partials = this.partials;

            this.partial(`templates/edit.hbs`);
        });

    });




};
handlers.myFlights = function (ctx) {



    ctx.login = localStorage.getItem(`username`);

    ctx.username = localStorage.getItem(`username`);



    console.log(`i am here`);

    ctx.loadPartials({
        header: `./templates/common/header.hbs`,
        footer: `./templates/common/footer.hbs`,
        myFlightTemp: `./templates/common/myFlightTemp.hbs`

    }).then(function () {
        ctx.partials = this.partials;

        service.myFlights(localStorage.getItem(`id`)).then((data)=>{
            console.log(data);

            let om = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            data.map(a=>a.date = new Date(a.departureDate).getDate() + ` ${om[new Date(a.departureDate).getMonth()]}`);

            console.log(data);

            this.partial(`templates/myFlights.hbs`,{data});


        });



    });


}


