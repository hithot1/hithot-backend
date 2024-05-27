const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { forEach } = require('p-iteration');

const slugify = require("slugify");

// const myusersModel = require('../../model/users');
const ec = require('../../lib/error_consts');
const utils = require('../../lib/utils');

const uploadFiles = require('../upload_files');
const generator = require('generate-password');
const bcrypt = require("bcrypt")

const usersFunctions = {
// create users 
// generateHash: async function (password) {
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
// },
//  createPassword: async function (password) {
//     shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
//     const id = shortid.generate();
//     return id;
  
//   },
create: async function (params) {

    let result = {};

    try {
       

        let users_id = uuidv4();
        let generated_password = generator.generate({
            length: 10,
            numbers: true
        });

       

        let password_hash = await bcrypt.hash(generated_password, 10);

       let permissionvalue="";
       if(params.role=="CMS_USER"){
        permissionvalue= params.permission;
       }
       

        let myusers_data = {
            //_id: users_id,
            name: params.name,
            role: params.role,
            permissions: permissionvalue,
            local_password:generated_password,
            password:password_hash,
            email:params.email
        };

        const createUsers = myusersModel.createAsync(myusers_data);

        const createUsersResp = await createUsers;

        result = {
            success: true
        };

    } catch (err) {
        result = {
            success: false,
            message: err.message
        };
    }

    return result;

},

// edit Users
fetchUsers: async function (params) {

    let result = {};

    try {

        let query = {};

        if (params && params.id) {
            query["_id"] = params.id;
        }

        let users_data = await myusersModel.fetchUsers(query);

        result["success"] = true;
        result["data"] = [];

        await forEach(users_data, async (current) => {
            
            let t_data = {};
            t_data = current;

            result["data"].push(t_data);
        });


    } catch(err) {

        result = {
            success: false,
            message: err.message
        };
    }

    return result;
},

edit: async function (params) {

    let result = {};

    try {

        let users_id = params._id;

        let update_data = {};

        let permissionvalue="";
       if(params.role=="CMS_USER"){
        permissionvalue= params.permission;
       }

         update_data = {
            name: params.name,
            role: params.role,
            permissions: permissionvalue,
            email:params.email
           
           
        };

        // if (params.thumbnail_image_file) {

        //     const uploadRes = await uploadFiles.upload(params.thumbnail_image_file);
        //     update_data["thumbnail_image_file"] = uploadRes.download_link;
        // }
        const createGallery = await myusersModel.updateUsers(params._id, update_data);
        
        // const createGallery = myusersModel.updateOne(query, {$set: update_data});

        // const createGalleryResp = await createGallery;

        result = {
            success: true
        };

    } catch (err) {
        result = {
            success: false,
            message: err.message
        };
    }

    return result;

},


// manage users

fetchManageMyUsers: async function () {

    let result = {};

    try {

        //let myusers_data = await myusersModel.find({}).lean();
        let myusers_data = await myusersModel.findAllUser({});

        result["success"] = true;
        result["data"] = [];

        await forEach(myusers_data, async (current) => {
            
            let t_data = {};
            t_data = current;
            result["data"].push(t_data);
        });


    } catch(err) {

        console.log(err);

        result = {
            success: false,
            message: err.message
        };
    }

    return result;

},

// delete users

delete: async function (params) {

    let result = {};

    try {

        if (!params || !params.id) {
            return {
                success: false,
                message: 'Invalid params'
            }
        }

        let query = {_id: params.id};

        const deletePost = await myusersModel.deleteOneUser(query);

        result = {
            success: true
        };

    } catch (err) {
        result = {
            success: false,
            message: err.message
        };
    }

    return result;

},
fetchAllUsers: async function (params) {

    let result = {};

    try {
        let users_data = [];

        if (params.limit) {
            users_data = await myusersModel.find({}).sort({updated_at: -1}).skip((params.skip - 1) * params.limit).limit(parseInt(params.limit)).lean();
        } else {
            users_data = await myusersModel.find({}).sort({updated_at: -1}).lean();
        }

        result["success"] = true;
        result["data"] = users_data;

    } catch(err) {

        console.log(err);
        result = {
            success: false,
            data: []
        };
    }

    return  result;
}

}

module.exports = usersFunctions 
