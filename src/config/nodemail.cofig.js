const hbs = require("nodemailer-express-handlebars");
const nodemailer = require("nodemailer");
const path = require("path");

module.exports = {
  async sendNodeEmailFuc(data) {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "meesbimal@gmail.com",
        pass: "xsxkdddocxljnbxz",
      },
      port: 465,
      host: "smtp.gmail.com",
    });

    // var transporter = nodemailer.createTransport({
    //   host: commonConfig.EMAIL_HOST,
    //   port: 465,
    //   auth: {
    //     user: commonConfig.EMAIL_USERNAME,
    //     pass: commonConfig.EMAIL_PASSWORD,
    //   },
    // });

    // point to the template folder
    const handlebarOptions = {
      viewEngine: {
        partialsDir: path.resolve("./email-templates/"),
        defaultLayout: false,
      },
      viewPath: path.resolve("./email-templates/"),
    };

    // use a template file with nodemailer
    transporter.use("compile", hbs(handlebarOptions));
    var mailOptions = {
      from: "Hithot", // sender address
      to: ["jas.sihra@yahoo.com", "deepakgodhar91@gmail.com"], // list of receivers
      cc: data.cc,
      subject: data.subject,
      template: data.template, // the name of the template file i.e email.handlebars
      context: data,
    };
    const emailSetting = { mailOptions, transporter };
    return emailSetting;
  },
};
