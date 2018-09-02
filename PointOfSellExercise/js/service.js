let service = {
    getActiveReceipt: function (userId, active) {

      return remote.get(`appdata`,`receipts?query={"_acl.creator":"${userId}","active":${active}}`)
        
    },
    getEntriesByReceiptID: function (receiptId) {

        return remote.get(`appdata`, `entries?query={"receiptId":"${receiptId}"}`)
        
    },
    createReceipt: function (data) {

        return remote.post(`appdata`, `receipts`,data);
        
    },
    addEntry: function (data) {

        return remote.post(`appdata`, `entries`,data);
    },
    deleteEntry: function (entryId) {

        return remote.remove('appdata', 'entries/' + entryId)

    },
    getMyReceipts: function (userId, active) {

        return remote.get(`appdata`, `receipts?query={"_acl.creator":${userId},"active":${active}`)
    },
    receiptDetails: function (receiptId) {

        return remote.get(`appdata`, `receipts/${receiptId}`)
        
    },
    commitReceipt:function (receiptId,data) {

       return remote.update(`appdata`, `receipts/${receiptId}`,data)
    }

};