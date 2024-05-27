"use strict";

const allBapiFunctions = require("../../functions/allBapi/index.js");
const videosfunction=require("../../functions/allBapi/Admin/shots.js")
const clipsfunction=require("../../functions/allBapi/Admin/clips.js")
const usersfunction=require("../../functions/allBapi/Admin/users.js")
const imagesfunction=require("../../functions/allBapi/Admin/images.js");
const Shotsfunction = require("../../functions/allBapi/Admin/shots.js");
const agencyfunction=require("../../functions/allBapi/Admin/agency.js")
const bannerfunction=require("../../functions/allBapi/Admin/banner.js")



const adminapiobj = {
  //********************************************************Admin Api   ****************************************************** */
  admin_show_allVideosExplore: async function (req, res, next) {
    const add_data = await videosfunction.admin_show_allVideosExplore(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },

  async Admin_Login(req, res, next) {
    try {
      await allBapiFunctions.Admin_Login(req.body, res, next);
    } catch (error) {
      return res.status(500).json({ status: false, message: "Error" });
    }
  },

  admin_show_allClip: async function (req, res, next) {
    const add_data = await clipsfunction.admin_show_allClip(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },
  adminUpdateUser: async function (req, res, next) {
    const add_data = await usersfunction.adminUpdateUser(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },
  admin_all_sounds: async function (req, res, next) {
    const add_data = await allBapiFunctions.admin_all_sounds(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },

  admin_show_allVideos4User: async function (req, res, next) {
    const add_data = await usersfunction.admin_show_allVideos4User(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },
  admin_show_allVideos_new: async function (req, res, next) {
    const add_data = await Shotsfunction.admin_show_allVideos_new(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },

  admin_show_allImages: async function (req, res, next) {
    const add_data = await imagesfunction.admin_show_allImages(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },

  admin_show_allVideosForYou: async function (req, res, next) {
    const add_data = await Shotsfunction.admin_show_allVideosForYou(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },

  admin_show_allVideosForYouClip: async function (req, res, next) {
    const add_data = await clipsfunction.admin_show_allVideosForYouClip(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },

  admin_show_allVideosForYouMark: async function (req, res, next) {
    const add_data = await Shotsfunction.admin_show_allVideosForYouMark(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },
  admin_show_allVideosMark: async function (req, res, next) {
    const add_data = await Shotsfunction.admin_show_allVideosMark(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },
  admin_show_allMarkedUser: async function (req, res, next) {
    const add_data = await usersfunction.admin_show_allMarkedUser(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },

  admin_show_allacceptdiamondsuser: async function (req, res, next) {
    const add_data = await usersfunction.admin_show_allacceptdiamondsuser(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },
  admin_show_creator: async function (req, res, next) {
    const add_data = await allBapiFunctions.admin_show_creator(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },
  getadminAgency: async function (req, res, next) {
    const add_data = await agencyfunction.getadminAgency(req.body, res, next);
    return res.json(add_data);
  },

  adminAllReferral: async function (req, res, next) {
    const add_data = await allBapiFunctions.adminAllReferral(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },

  admin_show_allFeedback: async function (req, res, next) {
    const add_data = await allBapiFunctions.admin_show_allFeedback(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },
  admin_show_allContest: async function (req, res, next) {
    const add_data = await allBapiFunctions.admin_show_allContest(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },

  getadminBanner: async function (req, res, next) {
    const add_data = await bannerfunction.getadminBanner(req.body, res, next);
    return res.json(add_data);
  },
  admin_all_sounds: async function (req, res, next) {
    const add_data = await allBapiFunctions.admin_all_sounds(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },
  admin_getSoundSection: async function (req, res, next) {
    const add_data = await allBapiFunctions.admin_getSoundSection(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },

  varifiedbankByAdmin: async function (req, res, next) {
    const add_data = await allBapiFunctions.varifiedbankByAdmin(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },
  AdminDeleteVideo: async function (req, res, next) {
    const add_data = await Shotsfunction.AdminDeleteVideo(
      req.body,
      res,
      next
    );
    return add_data;
  },

  admin_show_allMarkedsubscribUser: async function (req, res, next) {
    const add_data = await usersfunction.admin_show_allMarkedsubscribUser(
      req.body,
      res,
      next
    );
    return add_data;
  },
  getadminAwardWinner: async function (req, res, next) {
    const add_data = await allBapiFunctions.getadminAwardWinner(
      req.body,
      res,
      next
    );
    return add_data;
  },
  addadminAwardWinner: async function (req, res, next) {
    const add_data = await allBapiFunctions.addadminAwardWinner(
      req.body,
      res,
      next
    );
    return add_data;
  },
  deleteadminAwardWinner: async function (req, res, next) {
    const add_data = await allBapiFunctions.deleteadminAwardWinner(
      req.body,
      res,
      next
    );
    return add_data;
  },
  changeStatusadminAwardWinner: async function (req, res, next) {
    const add_data = await allBapiFunctions.changeStatusadminAwardWinner(
      req.body,
      res,
      next
    );
    return add_data;
  },
  updateadminAwardWinner_1: async function (req, res, next) {
    const add_data = await allBapiFunctions.updateadminAwardWinner_1(
      req.body,
      res,
      next
    );
    return add_data;
  },
  addadminTimeEvent: async function (req, res, next) {
    await allBapiFunctions.addadminTimeEvent(req, res, next);
  },
  getadminTimeEvent: async function (req, res, next) {
    const add_data = await allBapiFunctions.getadminTimeEvent(
      req.body,
      res,
      next
    );
    return add_data;
  },
  deleteadminTimeEvent: async function (req, res, next) {
    const add_data = await allBapiFunctions.deleteadminTimeEvent(
      req.body,
      res,
      next
    );
    return add_data;
  },

  admin_addSection: async function (req, res, next) {
    const add_data = await allBapiFunctions.admin_addSection(
      req.body,
      res,
      next
    );
    return add_data;
  },
  admin_editSection: async function (req, res, next) {
    const add_data = await allBapiFunctions.admin_editSection(
      req.body,
      res,
      next
    );
    return add_data;
  },

  sendCommentFromPanel: async function (req, res, next) {
    const add_data = await allBapiFunctions.sendCommentFromPanel(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },

  getPanelHashtagList: async function (req, res, next) {
    const add_data = await allBapiFunctions.getPanelHashtagList(
      req.body,
      res,
      next
    );
    return add_data;
  },
  getAddedPanelHashtagList: async function (req, res, next) {
    const add_data = await allBapiFunctions.getAddedPanelHashtagList(
      req.body,
      res,
      next
    );
    return add_data;
  },
  removeAddedPanelHashtagList: async function (req, res, next) {
    const add_data = await allBapiFunctions.removeAddedPanelHashtagList(
      req.body,
      res,
      next
    );
    return add_data;
  },
  sendNotificationFromPanel: async function (req, res, next) {
    await allBapiFunctions.sendNotificationFromPanel(req, res, next);
  },

  sendNotificationFromPanelToAgencyUser: async function (req, res, next) {
    await allBapiFunctions.sendNotificationFromPanelToAgencyUser(
      req,
      res,
      next
    );
  },

  ////

  changeDiscriptionOfVideo: async function (req, res, next) {
    const add_data = await allBapiFunctions.changeDiscriptionOfVideo(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },
  addVideointoDiscovery: async function (req, res, next) {
    const add_data = await Shotsfunction.addVideointoDiscovery(
      req.body,
      res,
      next
    );

    return res.json(add_data);
  },
  DeleteVideo: async function (req, res, next) {
    const add_data = await allBapiFunctions.DeleteVideo(req.body, res, next);

    return res.json(add_data);
  },

  all_discovery_sections: async function (req, res, next) {
    const add_data = await Shotsfunction.all_discovery_sections(
      req.body,
      res,
      next
    );

    return res.json(add_data);
  },

  add_discovery_Section: async function (req, res, next) {
    const add_data = await Shotsfunction.add_discovery_Section(
      req.body,
      res,
      next
    );

    return res.json(add_data);
  },

  all_list_discovery_sections: async function (req, res, next) {
    const add_data = await Shotsfunction.all_list_discovery_sections(
      req.body,
      res,
      next
    );

    return res.json(add_data);
  },
  addForYou: async function (req, res, next) {
    const add_data = await Shotsfunction.addForYou(req.body, res, next);

    return res.json(add_data);
  },

  addForYouMark: async function (req, res, next) {
    const add_data = await Shotsfunction.addForYouMark(req.body, res, next);

    return res.json(add_data);
  },

  removefromforyou: async function (req, res, next) {
    const add_data = await Shotsfunction.removefromforyou(
      req.body,
      res,
      next
    );
    return add_data;
  },
  removefromforyouMark: async function (req, res, next) {
    const add_data = await Shotsfunction.removefromforyouMark(
      req.body,
      res,
      next
    );
    return add_data;
  },

  removevideofrommarked: async function (req, res, next) {
    const add_data = await Shotsfunction.removevideofrommarked(
      req.body,
      res,
      next
    );
    return add_data;
  },
  removefrommarked: async function (req, res, next) {
    const add_data = await Shotsfunction.removefrommarked(
      req.body,
      res,
      next
    );
    return add_data;
  },

  removeVideoFromExplore: async function (req, res, next) {
    const add_data = await Shotsfunction.removeVideoFromExplore(
      req.body,
      res,
      next
    );
    return add_data;
  },

  addVideoToExplore: async function (req, res, next) {
    const add_data = await Shotsfunction.addVideoToExplore(
      req.body,
      res,
      next
    );
    return add_data;
  },

  removeSection: async function (req, res, next) {
    const add_data = await Shotsfunction.removeSection(req.body, res, next);
    return add_data;
  },

  All_Clip_Users: async function (req, res, next) {
    const add_data = await clipsfunction.All_Clip_Users(req.body, res, next);

    return res.json(add_data);
  },

  checkUserName: async function (req, res, next) {
    const add_data = await allBapiFunctions.checkUserName(req.body, res, next);
    return add_data;
  },

  getAllVerifiedDaysByMonth: async function (req, res, next) {
    const add_data = await allBapiFunctions.getAllVerifiedDaysByMonth(
      req,
      res,
      next
    );
    return res.json(add_data);
  },

  getAllVerifiedMonthsByYear: async function (req, res, next) {
    const add_data = await allBapiFunctions.getAllVerifiedMonthsByYear(
      req,
      res,
      next
    );
    return res.json(add_data);
  },

  uploadSound: async function (req, res, next) {
    await allBapiFunctions.uploadSound(req, res, next);
  },

  allowUsertoUploadClip: async function (req, res, next) {
    const add_data = await allBapiFunctions.allowUsertoUploadClip(
      req.body,
      res,
      next
    );

    return res.json(add_data);
  },

  All_Users: async function (req, res, next) {
    const add_data = await usersfunction.All_Users(req.body, res, next);

    return res.json(add_data);
  },

  All_VerifiedUsers: async function (req, res, next) {
    const add_data = await usersfunction.All_VerifiedUsers(
      req.body,
      res,
      next
    );

    return res.json(add_data);
  },

  getAllUsersVideoAudio: async function (req, res, next) {
    const add_data = await usersfunction.getAllUsersVideoAudio(
      req.body,
      res,
      next
    );
    return add_data;
  },

  getAllUsersInfo_: async function (req, res, next) {
    const add_data = await usersfunction.getAllUsersInfo_(
      req.body,
      res,
      next
    );
    return add_data;
  },

  getAllUsersByDate: async function (req, res, next) {
    const add_data = await usersfunction.getAllUsersByDate(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },

  addfollowers: async function (req, res, next) {
    const add_data = await usersfunction.addfollowers(req.body, res, next);
    return add_data;
  },

  allsubscriber: async function (req, res, next) {
    const add_data = await allBapiFunctions.allsubscriber(req.body, res, next);
    return add_data;
  },

  allfailedsubscriber: async function (req, res, next) {
    const add_data = await allBapiFunctions.allfailedsubscriber(
      req.body,
      res,
      next
    );
    return add_data;
  },

  addupisubscriber: async function (req, res, next) {
    const add_data = await allBapiFunctions.addupisubscriber(
      req.body,
      res,
      next
    );
    return add_data;
  },

  removefromsubscribmarked: async function (req, res, next) {
    const add_data = await allBapiFunctions.removefromsubscribmarked(
      req.body,
      res,
      next
    );
    return add_data;
  },
  Subscription: async function (req, res, next) {
    const add_data = await allBapiFunctions.Subscription(req.body, res, next);
    return res.json(add_data);
  },

  removefromsubscribmarked: async function (req, res, next) {
    const add_data = await allBapiFunctions.removefromsubscribmarked(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },

  allProfileVerification: async function (req, res, next) {
    const add_data = await allBapiFunctions.allProfileVerification(
      req.body,
      res,
      next
    );

    return res.json(add_data);
  },

  All_Users_Agency: async function (req, res, next) {
    const add_data = await agencyfunction.All_Users_Agency(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },

  getAgency: async function (req, res, next) {
    const add_data = await agencyfunction.getAgency(req.body, res, next);
    return add_data;
  },

  createAgency: async function (req, res, next) {
    await agencyfunction.createAgency(req, res, next);
  },

  getAllAgencyAndClipUploader: async function (req, res, next) {
    const add_data = await agencyfunction.getAllAgencyAndClipUploader(
      req,
      res,
      next
    );
    return res.json(add_data);
  },

  removeAgency: async function (req, res, next) {
    const add_data = await agencyfunction.removeAgency(req.body, res, next);
    return add_data;
  },

  getAllAgencyInfo_: async function (req, res, next) {
    const add_data = await agencyfunction.getAllAgencyInfo_(
      req.body,
      res,
      next
    );
    return add_data;
  },

  addbanner: async function (req, res, next) {
    await bannerfunction.addbanner(req, res, next);
  },

  editbanner: async function (req, res, next) {
    await bannerfunction.editbanner(req, res, next);
  },
  removebanner: async function (req, res, next) {
    const add_data = await bannerfunction.removebanner(req.body, res, next);
    return add_data;
  },
  orderBanner: async function (req, res, next) {
    const add_data = await bannerfunction.orderBanner(req.body, res, next);
    return add_data;
  },
  allTimeEvent: async function (req, res, next) {
    const add_data = await allBapiFunctions.allTimeEvent(req.body, res, next);
    return add_data;
  },
  walletHistory: async function (req, res, next) {
    const add_data = await allBapiFunctions.walletHistory(req.body, res, next);
    return res.json(add_data);
  },
  getWallet: async function (req, res, next) {
    const add_data = await allBapiFunctions.getWallet(req.body, res, next);
    return res.json(add_data);
  },
  getWithdrawRequest: async function (req, res, next) {
    const add_data = await allBapiFunctions.getWithdrawRequest(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },
  getBank: async function (req, res, next) {
    const add_data = await allBapiFunctions.getBank(req.body, res, next);
    return res.json(add_data);
  },
  getDiamond: async function (req, res, next) {
    const add_data = await allBapiFunctions.getDiamond(req.body, res, next);
    return res.json(add_data);
  },
  diamondHistory: async function (req, res, next) {
    const add_data = await allBapiFunctions.diamondHistory(req.body, res, next);
    return add_data;
  },
  removeSound: async function (req, res, next) {
    const add_data = await allBapiFunctions.removeSound(req.body, res, next);
    return add_data;
  },
  allSounds: async function (req, res, next) {
    const add_data = await allBapiFunctions.allSounds(req.body, res, next);
    return res.json(add_data);
  },
  getAllSoundGallery: async function (req, res, next) {
    const add_data = await allBapiFunctions.getAllSoundGallery(
      req.body,
      res,
      next
    );
    return add_data;
  },
  search: async function (req, res, next) {
    const add_data = await allBapiFunctions.search(req.body, res, next);
    return res.json(add_data);
  },
};

module.exports = adminapiobj;
