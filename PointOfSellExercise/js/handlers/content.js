handlers.login = function (ctx) {

    auth.login(ctx.params.username, ctx.params.password).then(function (data) {

        auth.saveSession(data);
        ctx.redirect(`#/homePage`)

    }).catch((data) => {
        notify.handleError(data);
    });
};
handlers.register = function (ctx) {

    if(ctx.params.password !==ctx.params.password2 ){
        notify.showError(`The passwords are not the same`);

        return;
    }

    auth.register(ctx.params.username, ctx.params.password).then(function (data) {


        auth.saveSession(data);
        ctx.redirect(`#/homePage`)

    }).catch((data) => {
        notify.handleError(data);
    });
};
handlers.logout = function (ctx) {

    auth.logout();
    localStorage.clear();

    ctx.redirect(`#`);

};
handlers.homePage = function (ctx) {

    ctx.username = localStorage.getItem(`username`);
    ctx.loadPartials({
        footer: `templates/common/footer.hbs`,
        header: `templates/common/header.hbs`,
        table: `templates/common/table.hbs`

    }).then(function () {
        ctx.partials = this.partials;

        let id = localStorage.getItem(`id`).toString();
        let bool = true;
        service.getActiveReceipt(id, bool).then((data) => {

            if (data.length === 0) {

                let object =
                    {
                        "active": true,
                        "productCount": 0,
                        "total": 0
                    };

                service.createReceipt(object).then((data1) => {

                    service.getEntriesByReceiptID(data1._id).then((data2) => {

                        ctx.receipt = data1._id;

                        this.partial(`templates/homePage.hbs`, {data2});
                    })
                })
            } else {
                service.getEntriesByReceiptID(data[0]._id).then((data1) => {


                    ctx.receipt = data[0]._id;

                    let sum = 0;
                    for (let obj of data1) {
                        sum += +obj.sum;
                    }
                    ctx.sum = sum.toFixed(2);

                    this.partial(`templates/homePage.hbs`, {data1});

                })
            }
        })
    })
};
handlers.removed = function (ctx) {

    service.deleteEntry(ctx.params.id).then(() => {
        notify.showInfo(`Entry removed`);
        ctx.redirect(`#/homePage`);
    })

};
handlers.createEntries = function (ctx) {

    console.log(ctx);

    let name = ctx.params.type;
    let quantity = +ctx.params.qty;
    let price = +ctx.params.price;
    let id = ctx.params.id;

    if (name === `` || quantity === `` || price === '') {
        notify.showError(`There are empty fields`);
        return;
    }
    let total = (quantity * price).toFixed(2);

    let obj =
        {
            "type": name,
            "qty": quantity,
            "price": price,
            "sum": total,
            "receiptId": id,
        };
    service.addEntry(obj).then(() => {
        notify.showInfo(`Entry is created!`);
        ctx.redirect(`#/homePage`);
    });
};
handlers.archivePage = function (ctx) {

    ctx.archive = true;
ctx.username = localStorage.getItem(`username`);
        service.getActiveReceipt(localStorage.getItem(`id`), false).then((data1) => {
            ctx.absoluteTotal = 0;
            for (let obj1 of data1) {
                console.log(obj1);
                obj1.data = obj1._kmd.ect;
                ctx.absoluteTotal += obj1.total;
            }
            ctx.archive = true;
            ctx.loadPartials({
                header: `templates/common/header.hbs`,
                footer: `templates/common/footer.hbs`,
                receipts: `templates/common/receipts.hbs`
            }).then(function () {
                ctx.partials = this.partials;

                this.partial(`templates/archive.hbs`,{data1});
            })
        })
};
handlers.overview = function (ctx) {

    ctx.redirect(`#/homePage`);

};
handlers.makeReceipt = function (ctx) {

    service.getEntriesByReceiptID(ctx.params.id).then((data) => {

        ctx.quantity = 0;
        ctx.total = 0;
        console.log(data);
        for (let obj of data) {
            console.log(obj);

            ctx.quantity += +obj.qty;
            ctx.total += +obj.sum;
        }
        let obj = {

            "active": false,
            "productCount": ctx.quantity,
            "total": ctx.total,

        };
        service.commitReceipt(ctx.params.id, obj).then(() => {

            ctx.redirect(`#/archive`);
        });
    })
};
handlers.details = function (ctx) {

    ctx.username = localStorage.getItem(`username`);
    ctx.detail = true;
    service.getEntriesByReceiptID(ctx.params.id).then((data)=>{
    ctx.loadPartials({
        header:`templates/common/header.hbs`,
        footer: `templates/common/footer.hbs`,
        receiptDetail:`templates/common/receiptDetail.hbs`
    }).then(function () {
        ctx.partials = this.partials;



            console.log(data);

            this.partial(`templates/details.hbs`,{data});

        })





    })



};
