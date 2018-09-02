let notify = (() => {
    $(() => {
        let loading = 0;
        $(document).on({
            ajaxStart: () => {
                if (!loading) $('#loadingBox').fadeIn();
                loading++;
            },
            ajaxStop: () => setTimeout(() => {
                loading--;
                if (!loading) $('#loadingBox').fadeOut();
            }, 500)
        });

        $('#infoBox').click((event) => $(`#app`).fadeOut());
        $('#errorBox').click((event) => $(`#app`).fadeOut());
    });

    function showInfo(message) {
        $('#infoBox').text(message);
        $('#infoBox').fadeIn();
        setTimeout(() => $('#infoBox').fadeOut(), 1500);
    }

    function showError(message) {
        $('#errorBox').text(message);
        $('#errorBox').fadeIn();
        setTimeout(() => $('#errorBox').fadeOut(), 1500);
    }

    function handleError(reason) {
        showError(reason.responseJSON.description);
    }

    return {
        showInfo, showError, handleError
    }
})();