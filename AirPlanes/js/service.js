let service = {
    getPublishedflights: function () {

        return remote.get(`appdata`,`flights?query={"isPublished":true}`)

    },
    createFlight: function (data) {

        return remote.post(`appdata`, `flights`,data);

    },

    flightDetails: function (id) {

        return remote.get(`appdata`, `flights/${id}`);

    },
    editFlight: function (data,id) {

       return remote.update(`appdata`,`flights/${id}`,data )

    },
    myFlights: function (id) {

        return remote.get(`appdata`,`flights?query={"_acl.creator":"${id}"}`);

    },
    deleteFlight: function (id) {

        return remote.remove(`appdata`, `flights/${id}`);

    }
};