"use strict"

const cutomerFunctions = require('../../functions/customer/customer');

const customerObj = {

    showAllVideosClip_1: async function (req, res, next) {
        let result={}
        const add_data = await cutomerFunctions.showAllVideosClip_1(req.body, res, next);
        //  console.log("add_data req",add_data)
         return res.json(add_data);
    },

}

module.exports = customerObj