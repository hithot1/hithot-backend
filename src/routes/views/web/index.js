"use strict";

var csrf = require('csurf');
var csrfProtection = csrf();

var error = require("../../error");
const views = require("./views");

module.exports = function (app) {
  
    app.get('/', views.index, error);
    app.get("*", views.pageNotFound, error);
}