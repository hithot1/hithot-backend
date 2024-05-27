"use strict";

const CLipsApiFunctions = require("../../functions/allBapi/clips.js");
const ImagesApiFunctions = require("../../functions/allBapi/images.js");
const allBapiFunctions = require("../../functions/allBapi/index.js");
const shotsApiFunctions = require("../../functions/allBapi/shots.js");
const SubscriptionApiFunctions = require("../../functions/allBapi/subscription.js");
const usersApiFunctions = require("../../functions/allBapi/users.js");

const allBapiObj = {
  
  //============================New Api ========================//
  getYourDiamond: async function (req, res, next) {
    const add_data = await allBapiFunctions.getYourDiamond(req.body, res, next);
    return res.json(add_data);
  },

  allVideosExploreNew: async function (req, res, next) {
    const add_data = await allBapiFunctions.allVideosExploreNew(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },

  archivedLiveEventTime: async function (req, res, next) {
    const add_data = await allBapiFunctions.archivedLiveEventTime(
      req.body,
      res,
      next
    );

    return res.json(add_data);
  },

  updateUserCategory: async function (req, res, next) {
    const add_data = await allBapiFunctions.updateUserCategory(req, res, next);

    return res.json(add_data);
  },

  diamondExchange: async function (req, res, next) {
    const add_data = await allBapiFunctions.diamondExchange(
      req.body,
      res,
      next
    );
    return add_data;
  },
  ifParticipateThenStartLive: async function (req, res, next) {
    const add_data = await allBapiFunctions.ifParticipateThenStartLive(
      req.body,
      res,
      next
    );

    return res.json(add_data);
  },

  updateLiveEventTime: async function (req, res, next) {
    const add_data = await allBapiFunctions.updateLiveEventTime(
      req.body,
      res,
      next
    );

    return res.json(add_data);
  },

  participateEvent: async function (req, res, next) {
    const add_data = await allBapiFunctions.participateEvent(
      req.body,
      res,
      next
    );

    return res.json(add_data);
  },
 

  addWithdrawRequest: async function (req, res, next) {
    const add_data = await allBapiFunctions.addWithdrawRequest(
      req.body,
      res,
      next
    );

    return res.json(add_data);
  },

  cronTimeEvent1: async function (req, res, next) {
    const add_data = await allBapiFunctions.cronTimeEvent1(req.body, res, next);

    return res.json(add_data);
  },

  getYourBank: async function (req, res, next) {
    const add_data = await allBapiFunctions.getYourBank(req.body, res, next);

    return res.json(add_data);
  },

  uploadVideo: async function (req, res, next) {
    const add_data = await allBapiFunctions.uploadVideo(req, res, next);
    return add_data;
  },

  uploadVideoClip: async function (req, res, next) {
    const add_data = await allBapiFunctions.uploadVideoClip(req, res, next);
    return add_data;
  },

  addBank: async function (req, res, next) {
    const add_data = await allBapiFunctions.addBank(req, res, next);
    return res.json(add_data);
  },

  getYourWallet: async function (req, res, next) {
    const add_data = await allBapiFunctions.getYourWallet(req.body, res, next);

    return res.json(add_data);
  },
  appSetting: async function (req, res, next) {
    const add_data = await allBapiFunctions.appSetting(req.body, res, next);

    return res.json(add_data);
  },

  updatePhoneNumber: async function (req, res, next) {
    const add_data = await allBapiFunctions.updatePhoneNumber(
      req.body,
      res,
      next
    );

    return res.json(add_data);
  },

  forgotpassword: async function (req, res, next) {
    const add_data = await allBapiFunctions.forgotpassword(req.body, res, next);

    return res.json(add_data);
  },
 
  userViewUpdateStory: async function (req, res, next) {
    const add_data = await allBapiFunctions.userViewUpdateStory(
      req.body,
      res,
      next
    );

    return res.json(add_data);
  },
  addStory: async function (req, res, next) {
    const add_data = await allBapiFunctions.addStory(req, res, next);

    return res.json(add_data);
  },
  getStory: async function (req, res, next) {
    const add_data = await allBapiFunctions.getStory(req.body, res, next);

    return res.json(add_data);
  },

 

  generateAgoraToken: async function (req, res, next) {
    const add_data = await allBapiFunctions.generateAgoraToken(
      req.body,
      res,
      next
    );

    return res.json(add_data);
  },

  get_followers_user_s_user: async function (req, res, next) {
    const add_data = await allBapiFunctions.get_followers_user_s_user(
      req.body,
      res,
      next
    );

    return res.json(add_data);
  },



  refreshToken: async function (req, res, next) {
    const add_data = await allBapiFunctions.refreshToken(req, res, next);

    return res.json(add_data);
  },


 

  addRewardAmount: async function (req, res, next) {
    const add_data = await allBapiFunctions.addRewardAmount(
      req.body,
      res,
      next
    );

    return res.json(add_data);
  },



 
  updateVerificationStatus: async function (req, res, next) {
    const add_data = await allBapiFunctions.updateVerificationStatus(
      req.body,
      res,
      next
    );

    return res.json(add_data);
  },



  addFakeViewLike: async function (req, res, next) {
    const add_data = await allBapiFunctions.addFakeViewLike(
      req.body,
      res,
      next
    );

    return res.json(add_data);
  },



  
 
  getAllDaysByMonth: async function (req, res, next) {
    const add_data = await allBapiFunctions.getAllDaysByMonth(req, res, next);
    return res.json(add_data);
  },
  getAllMonthsByYear: async function (req, res, next) {
    const add_data = await allBapiFunctions.getAllMonthsByYear(req, res, next);
    return res.json(add_data);
  },

 
 
 
  getAllShotsAndClipByYear: async function (req, res, next) {
    const add_data = await allBapiFunctions.getAllShotsAndClipByYear(
      req,
      res,
      next
    );
    return res.json(add_data);
  },

 
  webUploadImage: async function (req, res, next) {
    const add_data = await allBapiFunctions.webUploadImage(req.body, res, next);
    return res.json(add_data);
  },

  uploadImage: async function (req, res, next) {
    const add_data = await allBapiFunctions.uploadImage(req, res, next);
    return res.json(add_data);
  },

  
 
  showAllVideosClip_1: async function (req, res, next) {
    const add_data = await allBapiFunctions.showAllVideosClip_1(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },

  All_Reported: async function (req, res, next) {
    const add_data = await allBapiFunctions.All_Reported(req.body, res, next);
    return res.json(add_data);
  },

  All_Reported_user: async function (req, res, next) {
    const add_data = await allBapiFunctions.All_Reported_user(
      req.body,
      res,
      nextz
    );
    return res.json(add_data);
  },

  showAllVideos_1: async function (req, res, next) {
    const add_data = await allBapiFunctions.showAllVideos_1(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },

  showMyAllVideos: async function (req, res, next) {
    const add_data = await allBapiFunctions.showMyAllVideos(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },

  updateVideoView: async function (req, res, next) {
    const add_data = await allBapiFunctions.updateVideoView(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },

  showAllImage_1: async function (req, res, next) {
    const add_data = await allBapiFunctions.showAllImage_1(req.body, res, next);
    return res.json(add_data);
  },

  getMarkUserProfile: async function (req, res, next) {
    const add_data = await allBapiFunctions.getMarkUserProfile(
      req.body,
      res,
      next
    );
    return add_data;
  },



  showMyAllImage: async function (req, res, next) {
    const add_data = await allBapiFunctions.showMyAllImage(req.body, res, next);
    return res.json(add_data);
  },

  showMyAllVideosClip: async function (req, res, next) {
    const add_data = await allBapiFunctions.showMyAllVideosClip(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },

  get_followings_user_s_user: async function (req, res, next) {
    const add_data = await allBapiFunctions.get_followings_user_s_user(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },
  my_liked_video: async function (req, res, next) {
    const add_data = await allBapiFunctions.my_liked_video(req.body, res, next);
    return res.json(add_data);
  },
  get_user_data: async function (req, res, next) {
    const add_data = await allBapiFunctions.get_user_data(req.body, res, next);
    return res.json(add_data);
  },
  getListOfBlock: async function (req, res, next) {
    const add_data = await allBapiFunctions.getListOfBlock(req.body, res, next);
    return res.json(add_data);
  },
  getNotifications_1: async function (req, res, next) {
    const add_data = await allBapiFunctions.getNotifications_1(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },

  getBanner1: async function (req, res, next) {
    const add_data = await allBapiFunctions.getBanner1(req.body, res, next);
    return res.json(add_data);
  },

  userCategory: async function (req, res, next) {
    const add_data = await allBapiFunctions.userCategory(req.body, res, next);
    return res.json(add_data);
  },

  getUserCategory: async function (req, res, next) {
    const add_data = await allBapiFunctions.getUserCategory(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },

  edit_profile: async function (req, res, next) {
    const add_data = await allBapiFunctions.edit_profile(req.body, res, next);
    return add_data;
  },

  likeDislikeVideo: async function (req, res, next) {
    const add_data = await allBapiFunctions.likeDislikeVideo(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },

  postComment: async function (req, res, next) {
    const add_data = await allBapiFunctions.postComment(req.body, res, next);
    return res.json(add_data);
  },

  showVideoComments: async function (req, res, next) {
    const add_data = await allBapiFunctions.showVideoComments(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },
  deleteComment: async function (req, res, next) {
    const add_data = await allBapiFunctions.deleteComment(req.body, res, next);
    return res.json(add_data);
  },

  reportVideo: async function (req, res, next) {
    const add_data = await allBapiFunctions.reportVideo(req.body, res, next);
    return res.json(add_data);
  },

  block_user: async function (req, res, next) {
    const add_data = await allBapiFunctions.block_user(req.body, res, next);
    return res.json(add_data);
  },

  removeFromBlock: async function (req, res, next) {
    const add_data = await allBapiFunctions.removeFromBlock(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },

  follow_users: async function (req, res, next) {
    const add_data = await allBapiFunctions.follow_users(req.body, res, next);
    return res.json(add_data);
  },

 

  my_FavSound: async function (req, res, next) {
    const add_data = await allBapiFunctions.my_FavSound(req.body, res, next);
    return res.json(add_data);
  },

  uploadImage_: async function (req, res, next) {
    const add_data = await allBapiFunctions.uploadImage_(req, res, next);
    return add_data;
  },

  fav_sound: async function (req, res, next) {
    const add_data = await allBapiFunctions.fav_sound(req.body, res, next);
    return res.json(add_data);
  },
  showPackagesList: async function (req, res, next) {
    const add_data = await allBapiFunctions.showPackagesList(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },

  SubscriptionPlans: async function (req, res, next) {
    const add_data = await allBapiFunctions.SubscriptionPlans(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },

  getYourReferral: async function (req, res, next) {
    const add_data = await allBapiFunctions.getYourReferral(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },

  diamondExchangeToINR: async function (req, res, next) {
    const add_data = await allBapiFunctions.diamondExchangeToINR(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },

  getAwardWinner: async function (req, res, next) {
    const add_data = await allBapiFunctions.getAwardWinner(req.body, res, next);
    return res.json(add_data);
  },
  SearchByHashTag: async function (req, res, next) {
    const add_data = await allBapiFunctions.SearchByHashTag(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },
  SearchByHashTagImage: async function (req, res, next) {
    const add_data = await allBapiFunctions.SearchByHashTagImage(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },
  SearchByHashTagClip: async function (req, res, next) {
    const add_data = await allBapiFunctions.SearchByHashTagClip(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },
  sendPushNotification: async function (req, res, next) {
    const add_data = await allBapiFunctions.sendPushNotification(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },
  

  varifiedWithdrawRequest: async function (req, res, next) {
    const add_data = await allBapiFunctions.varifiedWithdrawRequest(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },

  SendDiamonds: async function (req, res, next) {
    const add_data = await allBapiFunctions.SendDiamonds(req.body, res, next);
    return res.json(add_data);
  },
 
  PurchaseSubscription: async function (req, res, next) {
    const add_data = await allBapiFunctions.PurchaseSubscription(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },

  PurchaseDiamonds: async function (req, res, next) {
    const add_data = await allBapiFunctions.PurchaseDiamonds(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },

  addUserAsMarkacceptdiamond: async function (req, res, next) {
    const add_data = await allBapiFunctions.addUserAsMarkacceptdiamond(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },

  removefrommarkedacceptdiamondsuser: async function (req, res, next) {
    const add_data = await allBapiFunctions.removefrommarkedacceptdiamondsuser(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },

  upipaymentstatusupdate: async function (req, res, next) {
    const add_data = await allBapiFunctions.upipaymentstatusupdate(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },

  addDiamondsToUserWallet: async function (req, res, next) {
    const add_data = await allBapiFunctions.addDiamondsToUserWallet(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },

 
  getVerifiedNew: async function (req, res, next) {
    const add_data = await allBapiFunctions.getVerifiedNew(req, res, next);
    return res.json(add_data);
  },

  downloadFile: async function (req, res, next) {
    const add_data = await allBapiFunctions.downloadFile(req.body, res, next);
    return add_data;
  },

  downloadFileTest: async function (req, res, next) {
    const add_data = await allBapiFunctions.downloadFileTest(
      req.body,
      res,
      next
    );
    return add_data;
  },

  follow_multiple_user: async function (req, res, next) {
    const add_data = await allBapiFunctions.follow_multiple_user(
      req.body,
      res,
      next
    );
    return add_data;
  },

  uploadAudio: async function (req, res, next) {
    const add_data = await allBapiFunctions.uploadAudio(req, res, next);
    return add_data;
  },

  checkatomtechpaymentstatus: async function (req, res, next) {
    const add_data = await allBapiFunctions.checkatomtechpaymentstatus(
      req.body,
      res,
      next
    );
    return add_data;
  },

  cropAAC: async function (req, res, next) {
    const add_data = await allBapiFunctions.cropAAC(req.body, res, next);
    return add_data;
  },

  getHashtagList: async function (req, res, next) {
    const add_data = await allBapiFunctions.getHashtagList(req.body, res, next);
    return add_data;
  },

  uploads3Video: async function (req, res, next) {
    const add_data = await allBapiFunctions.uploads3Video(req, res, next);
    return add_data;
  },
  maintanancMode: async function (req, res, next) {
    const add_data = await allBapiFunctions.maintanancMode(req.body, res, next);
    return add_data;
  },

  getNotifications: async function (req, res, next) {
    const add_data = await allBapiFunctions.getNotifications(
      req.body,
      res,
      next
    );
    return add_data;
  },
  getAllState: async function (req, res, next) {
    const add_data = await allBapiFunctions.getAllState(req.body, res, next);
    return add_data;
  },
  getCitiesbyState: async function (req, res, next) {
    const add_data = await allBapiFunctions.getCitiesbyState(
      req.body,
      res,
      next
    );
    return add_data;
  },

  allowDownload: async function (req, res, next) {
    const add_data = await allBapiFunctions.allowDownload(req.body, res, next);
    return add_data;
  },

 
 
  addUserAsMark: async function (req, res, next) {
    const add_data = await allBapiFunctions.addUserAsMark(req.body, res, next);
    return add_data;
  },
  addVidAmount: async function (req, res, next) {
    const add_data = await allBapiFunctions.addVidAmount(req.body, res, next);
    return add_data;
  },
  setOrderVideosExplore: async function (req, res, next) {
    const add_data = await allBapiFunctions.setOrderVideosExplore(
      req.body,
      res,
      next
    );
    return add_data;
  },
 
 
  setOrderVideosExploreHashtag: async function (req, res, next) {
    const add_data = await allBapiFunctions.setOrderVideosExploreHashtag(
      req.body,
      res,
      next
    );
    return add_data;
  },

  addhashtag2explore: async function (req, res, next) {
    const add_data = await allBapiFunctions.addhashtag2explore(
      req.body,
      res,
      next
    );
    return add_data;
  },
 

  getKycDashboard: async function (req, res, next) {
    const add_data = await allBapiFunctions.getKycDashboard(
      req.body,
      res,
      next
    );
    return add_data;
  },
  getDiamondUserDashboard: async function (req, res, next) {
    const add_data = await allBapiFunctions.getDiamondUserDashboard(
      req.body,
      res,
      next
    );
    return add_data;
  },
  getAllCreatorMonthsByYear: async function (req, res, next) {
    const add_data = await allBapiFunctions.getAllCreatorMonthsByYear(
      req.body,
      res,
      next
    );
    return add_data;
  },
  getAllCreatorDaysByMonth: async function (req, res, next) {
    const add_data = await allBapiFunctions.getAllCreatorDaysByMonth(
      req.body,
      res,
      next
    );
    return add_data;
  },
  getWithdrawlUserDashboard: async function (req, res, next) {
    const add_data = await allBapiFunctions.getWithdrawlUserDashboard(
      req.body,
      res,
      next
    );
    return add_data;
  },
  getAllReferralDaysByMonth: async function (req, res, next) {
    const add_data = await allBapiFunctions.getAllReferralDaysByMonth(
      req.body,
      res,
      next
    );
    return add_data;
  },
  getAllReffralMonthsByYear: async function (req, res, next) {
    const add_data = await allBapiFunctions.getAllReffralMonthsByYear(
      req.body,
      res,
      next
    );
    return add_data;
  },
 
 

  checkTime: async function (req, res, next) {
    const add_data = await allBapiFunctions.checkTime(req.body, res, next);
    return add_data;
  },
 
  updateRefCode: async function (req, res, next) {
    const add_data = await allBapiFunctions.updateRefCode(req.body, res, next);
    return add_data;
  },
  changePassword: async function (req, res, next) {
    const add_data = await allBapiFunctions.changePassword(req, res, next);
    return add_data;
  },
  reportAction: async function (req, res, next) {
    const add_data = await allBapiFunctions.reportAction(req.body, res, next);
    return add_data;
  },
  reportActionUser: async function (req, res, next) {
    const add_data = await allBapiFunctions.reportActionUser(
      req.body,
      res,
      next
    );
    return add_data;
  },

  showHomeFeed: async function (req, res, next) {
    const add_data = await allBapiFunctions.showHomeFeed(req.body, res, next);
    return res.json(add_data);
  },

  showUserProfile: async function (req, res, next) {
    const add_data = await allBapiFunctions.showUserProfile(
      req.body,
      res,
      next
    );
    return res.json(add_data);
  },
}

module.exports = allBapiObj;
