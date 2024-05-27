"use strict";

const error = require("../error.js");
const cache = require("express-redis-cache")({
  expire: {
    200: 180,
    "4xx": 10,
    "5xx": 10,
    xxx: 1,
  },
});

const customer = require("./customer.js");
const loginsignup = require("./loginsignup.js");
const profile = require("./profile.js");
const allBapi = require("./allBapi.js");
const cronjob = require("./cronjob.js");
const allBapi=require("./admin_api.js")

module.exports = function (app) {
  // app.post("/api/showAllVideosClip_1", customer.showAllVideosClip_1, error);
 
  // app.post("/api/allProfileVerification", profile.allProfileVerification, error);
 

 


// ***************** ADMIN ROUTES *************************//

  //Login
  app.post("/api/Admin_Login", allBapi.Admin_Login, error);

  // Sounds
  app.post("/api/admin_all_sounds", allBapi.admin_all_sounds, error);zz
  app.post("/api/admin_getSoundSection", allBapi.admin_getSoundSection, error);

  // Creator
  app.post("/api/admin_show_creator", allBapi.admin_show_creator, error);
  app.post("/api/getAllCreatorMonthsByYear",allBapi.getAllCreatorMonthsByYear,error);
  app.post("/api/getAllCreatorDaysByMonth",allBapi.getAllCreatorDaysByMonth,error);

  // Agency     --file done 
  app.post("/api/getadminAgency", allBapi.getadminAgency, error);

  //Banner  --file done 
  app.post("/api/getadminBanner", allBapi.getadminBanner, error);

  // Utilities
  app.post("/api/admin_show_allFeedback",allBapi.admin_show_allFeedback,error);
  app.post("/api/admin_show_allContest", allBapi.admin_show_allContest, error);
  app.post("/api/varifiedbankByAdmin", allBapi.varifiedbankByAdmin, error);
  app.post("/api/getadminAwardWinner", allBapi.getadminAwardWinner, error);
  app.post("/api/addadminAwardWinner", allBapi.addadminAwardWinner, error);
  app.post("/api/deleteadminAwardWinner",allBapi.deleteadminAwardWinner,error);
  app.post("/api/changeStatusadminAwardWinner",allBapi.changeStatusadminAwardWinner,error);
  app.post("/api/updateadminAwardWinner_1",allBapi.updateadminAwardWinner_1,error);
  app.post("/api/addadminTimeEvent", allBapi.addadminTimeEvent, error);
  app.post("/api/getadminTimeEvent", allBapi.getadminTimeEvent, error);
  app.post("/api/deleteadminTimeEvent", allBapi.deleteadminTimeEvent, error);
  app.post("/api/admin_addSection", allBapi.admin_addSection, error);
  app.post("/api/admin_editSection", allBapi.admin_editSection, error);

  // Shots API   ----file done
  app.post("/api/admin_show_allVideos_new",allBapi.admin_show_allVideos_new,error);
  // app.post("/api/admin_show_allVideos", allBapi.admin_show_allVideos, error);
  app.post("/api/admin_show_allVideosExplore",allBapi.admin_show_allVideosExplore,error);
  app.post("/api/admin_show_allVideosForYouMark",allBapi.admin_show_allVideosForYouMark,error);
  app.post("/api/admin_show_allVideosMark",allBapi.admin_show_allVideosMark,error);
  app.post("/api/admin_show_allVideosForYou",allBapi.admin_show_allVideosForYou,error);
  app.post("/api/AdminDeleteVideo", allBapi.AdminDeleteVideo, error);

  // Clips API    ----file done
  // app.post("/api/admin_show_allClip", allBapi.admin_show_allClip_new, error);
  app.post("/api/admin_show_allVideosForYouClip",allBapi.admin_show_allVideosForYouClip,error);

  // Images API   ---------file done 
  // app.post("/api/admin_show_allImages",allBapi.admin_show_allImages_new,error);

  // Users API    -----file  done
  app.post("/api/adminUpdateUser", allBapi.adminUpdateUser, error);
  app.post("/api/admin_show_allMarkedUser",allBapi.admin_show_allMarkedUser,error);
  app.post("/api/admin_show_allacceptdiamondsuser",allBapi.admin_show_allacceptdiamondsuser,error);
  app.post("/api/admin_show_allVideos4User",allBapi.admin_show_allVideos4User,error);
  app.post("/api/getDiamondUserDashboard",allBapi.getDiamondUserDashboard,error);


  //Notification 
  app.post("/api/sendNotificationFromPanel",allBapi.sendNotificationFromPanel,error);
  app.post("/api/sendNotificationFromPanelToAgencyUser",allBapi.sendNotificationFromPanelToAgencyUser,error);

// Miscellaneous//

app.post("/api/adminAllReferral", allBapi.adminAllReferral, error);
app.post("/api/refresh-token", allBapi.refreshToken, error);
app.post("/api/addRewardAmount", allBapi.addRewardAmount, error);
app.post("/api/updateVerificationStatus",allBapi.updateVerificationStatus,error);
app.post("/api/addFakeViewLike", allBapi.addFakeViewLike, error);
app.post("/api/getAllDaysByMonth", allBapi.getAllDaysByMonth, error);
app.post("/api/getAllMonthsByYear", allBapi.getAllMonthsByYear, error);
app.post("/api/getAllShotsAndClipByYear",allBapi.getAllShotsAndClipByYear,error);
app.post("/api/sendCommentFromPanel", allBapi.sendCommentFromPanel, error);
app.post("/api/All_Reported", allBapi.All_Reported, error);
app.post("/api/All_ Reported_user", allBapi.All_Reported_user, error);
app.post("/api/varifiedWithdrawRequest",allBapi.varifiedWithdrawRequest,error);
app.post("/api/getAllState", allBapi.getAllState, error);
app.post("/api/getCitiesbyState", allBapi.getCitiesbyState, error);
app.post("/api/allowDownload", allBapi.allowDownload, error);
app.post("/api/addVidAmount", allBapi.addVidAmount, error);
app.post("/api/setOrderVideosExplore", allBapi.setOrderVideosExplore, error);

app.post("/api/getPanelHashtagList", allBapi.getPanelHashtagList, error);
app.post("/api/getAddedPanelHashtagList",allBapi.getAddedPanelHashtagList,error);
app.post( "/api/setOrderVideosExploreHashtag", allBapi.setOrderVideosExploreHashtag, error);
app.post("/api/removeAddedPanelHashtagList",allBapi.removeAddedPanelHashtagList,error);
app.post("/api/addhashtag2explore", allBapi.addhashtag2explore, error);
app.post("/api/getKycDashboard", allBapi.getKycDashboard, error);

app.post("/api/getWithdrawlUserDashboard",allBapi.getWithdrawlUserDashboard,error);
app.post("/api/getAllReferralDaysByMonth",allBapi.getAllReferralDaysByMonth,error);
app.post("/api/getAllReffralMonthsByYear",allBapi.getAllReffralMonthsByYear,error);
app.post("/api/reportAction", allBapi.reportAction, error);
app.post("/api/reportActionUser", allBapi.reportActionUser, error);
app.post("/api/changePassword", allBapi.changePassword, error);




  // ***************** API ROUTES *************************//
  // Homefeed
  app.post("/api/showHomeFeed", allBapi.showHomeFeed, error);

  // Shots API    ----file done

  app.post("/api/addVideoAsMark", allBapi.addVideoAsMark, error);
  app.post("/api/changeDiscriptionOfVideo",allBapi.changeDiscriptionOfVideo,error);
  app.post("/api/addVideointoDiscovery", allBapi.addVideointoDiscovery, error);
  app.post("/api/all_discovery_sections",allBapi.all_discovery_sections,error);
  app.post("/api/add_discovery_Section", allBapi.add_discovery_Section, error);
  app.post("/api/all_list_discovery_sections",allBapi.all_list_discovery_sections,error);
  app.post("/api/addForYou", allBapi.addForYou, error);
  app.post("/api/addForYouMark", allBapi.addForYouMark, error);
  app.post("/api/removefromforyou", allBapi.removefromforyou, error);
  app.post("/api/removefromforyouMark", allBapi.removefromforyouMark, error);
  app.post("/api/removevideofrommarked", allBapi.removevideofrommarked, error);
  app.post("/api/removefrommarked", allBapi.removefrommarked, error);
  app.post("/api/removeVideoFromExplore",allBapi.removeVideoFromExplore,error);
  app.post("/api/addVideoToExplore", allBapi.addVideoToExplore, error);
  app.post("/api/removeSection", allBapi.removeSection, error);

  // Clip API        ----file done
  app.post("/api/All_Clip_Users", allBapi.All_Clip_Users, error);

  // Images API   ---file donr
  app.post("/api/checkUserName", allBapi.checkUserName, error);

  // Upload API
  app.post("/api/uploadSound", allBapi.uploadSound, error); 
  app.post("/api/allowUsertoUploadClip", allBapi.allowUsertoUploadClip, error);

  // Users API   ---file done 
  app.post("/api/All_Users", allBapi.All_Users_new, error);
  app.post("/api/getAllVerifiedDaysByMonth",allBapi.getAllVerifiedDaysByMonth,error);
  app.post("/api/getAllVerifiedMonthsByYear",allBapi.getAllVerifiedMonthsByYear,error);
  app.post("/api/All_VerifiedUsers", allBapi.All_VerifiedUsers, error);
  app.post("/api/getAllUsersVideoAudio", allBapi.getAllUsersVideoAudio, error);
  app.post("/api/getAllUsersInfo_", allBapi.getAllUsersInfo_, error);
  app.post("/api/getAllUsersByDate", allBapi.getAllUsersByDate, error);
  app.post("/api/addfollowers", allBapi.addfollowers, error);

  // Subscribers
  app.post("/api/allsubscriber", allBapi.allsubscriber_new, error);
  app.post("/api/allsubscriber", allBapi.allsubscriber, error);
  app.post("/api/allfailedsubscriber", allBapi.allfailedsubscriber, error);
  app.post("/api/addupisubscriber", allBapi.addupisubscriber, error)
  app.post("/api/removefromsubscribmarked",allBapi.removefromsubscribmarked,error);
  app.post("/api/Subscription", allBapi.Subscription, error);
  app.post("/api/removefromsubscribmarked",allBapi.removefromsubscribmarked,error);


  // Profile
  app.post("/api/allProfileVerification",allBapi.allProfileVerification,error);

  // Agency    ----file done 
  app.post("/api/All_Users_Agency", allBapi.All_Users_Agency, error);
  app.post("/api/getAgency", allBapi.getAgency, error);
  app.post("/api/createAgency", allBapi.createAgency, error);
  app.post("/api/getAllAgencyAndClipUploader",allBapi.getAllAgencyAndClipUploader,error);
  app.post("/api/removeAgency", allBapi.removeAgency, error);
  app.post("/api/getAllAgencyInfo_", allBapi.getAllAgencyInfo_, error); 

  //Banner  ----file done 
  app.post("/api/addbanner", allBapi.addbanner, error);
  app.post("/api/editbanner", allBapi.editbanner, error);
  app.post("/api/removebanner", allBapi.removebanner, error);
  app.post("/api/orderBanner", allBapi.orderBanner, error);


  //Events
  app.post("/api/allTimeEvent", allBapi.allTimeEvent, error);

  //Bank

  app.post("/api/walletHistory", allBapi.walletHistory, error);
  app.post("/api/getWallet", allBapi.getWallet, error);
  app.post("/api/getWithdrawRequest", allBapi.getWithdrawRequest, error);
  app.post("/api/getBank", allBapi.getBank, error);
  
  
//Diamond


app.post("/api/getDiamond", allBapi.getDiamond, error);
app.post("/api/diamondHistory", allBapi.diamondHistory, error);

//Sounds
app.post("/api/removeSound", allBapi.removeSound, error);
app.post("/api/allSounds", allBapi.allSounds, error);
app.post("/api/getAllSoundGallery", allBapi.getAllSoundGallery, error);

//Search
app.post("/api/search", allBapi.search, error);


//=================APP API==========================//
// Miscellaneous//
app.post("/api/manualsignin", loginsignup.manualsignin, error);
app.get("/api/deleteallfiles", loginsignup.deleteallfiles, error); //do not run this
app.post("/api/manualsignup", loginsignup.manualsignup, error);
app.post("/api/updatelocation", loginsignup.updatelocation, error);
app.post("/api/signup", loginsignup.signup, error);
app.post("/api/showUserInfo", profile.showUserInfo, error);
app.post("/api/getAllReferral", profile.getAllReferral, error);
app.post("/api/manualReferral", profile.manualReferral, error);
app.post("/api/ifParticipateThenStartLive",allBapi.ifParticipateThenStartLive,error);
app.get("/api/appSetting", allBapi.appSetting, error);
app.post("/api/updatePhoneNumber", allBapi.updatePhoneNumber, error);
app.post("/api/forgotpassword", allBapi.forgotpassword, error);
app.post("/api/userViewUpdateStory", allBapi.userViewUpdateStory, error);
app.post("/api/addStory", allBapi.addStory, error);
app.post("/api/getStory", allBapi.getStory, error);
app.post("/api/generateAgoraToken", allBapi.generateAgoraToken, error);
app.post("/api/get_followings_user_s_user",allBapi.get_followings_user_s_user,error);
app.post("/api/get_user_data", allBapi.get_user_data, error);
app.post("/api/getListOfBlock", allBapi.getListOfBlock, error);
app.post("/api/postComment", allBapi.postComment, error);
app.post("/api/deleteComment", allBapi.deleteComment, error);
app.post("/api/block_user", allBapi.block_user, error);
app.post("/api/removeFromBlock", allBapi.removeFromBlock, error);
app.post("/api/showPackagesList", allBapi.showPackagesList, error);
app.post("/api/getYourReferral", allBapi.getYourReferral, error);
app.post("/api/getAwardWinner", allBapi.getAwardWinner, error);
app.post("/api/getVerifiedNew", allBapi.getVerifiedNew, error);
app.post("/api/downloadFile", allBapi.downloadFile, error);
app.post("/api/downloadFileTest", allBapi.downloadFileTest, error);
app.post("/api/follow_multiple_user", allBapi.follow_multiple_user, error);
app.post("/api/cropAAC", allBapi.cropAAC, error);
app.post("/api/getHashtagList", allBapi.getHashtagList, error);
app.post("/api/maintanancMode", allBapi.maintanancMode, error)  
app.get("/api/autoLike", cronjob.autoLike, error);
app.post("/api/checkTime", allBapi.checkTime, error);
app.post("/api/updateRefCode", allBapi.updateRefCode, error);
app.post("/api/showAllVideosClip_1", allBapi.showAllVideosClip_1, error);
app.post("/api/showMyAllVideosClip", allBapi.showMyAllVideosClip, error);
app.post("/api/allVideosExploreNew", allBapi.allVideosExploreNew, error);
app.post("/api/showAllVideos_1", allBapi.showAllVideos_1, error);
app.post("/api/showMyAllVideos", allBapi.showMyAllVideos, error);
app.post("/api/updateVideoView", allBapi.updateVideoView, error);
app.post("/api/my_liked_video", allBapi.my_liked_video, error);
app.post("/api/likeDislikeVideo", allBapi.likeDislikeVideo, error);
app.post("/api/showVideoComments", allBapi.showVideoComments, error);
app.post("/api/reportVideo", allBapi.reportVideo, error)
app.get("/api/deleteSaveVideo", cronjob.deleteSaveVideo, error);
app.post("/api/showAllImage_1", allBapi.showAllImage_1, error);
app.post("/api/showMyAllImage", allBapi.showMyAllImage, error);
app.post("/api/uploads3Video", allBapi.uploads3Video, error);
app.post("/api/uploadVideoNew", allBapi.uploadVideo, error);
app.post("/api/uploadVideoClip", allBapi.uploadVideoClip, error);
app.post("/api/webUploadImage", allBapi.webUploadImage, error);
app.post("/api/uploadImage", allBapi.uploadImage, error);
app.post("/api/uploadImage_", allBapi.uploadImage_, error);
app.post("/api/uploadAudio", allBapi.uploadAudio, error);
app.post("/api/follow_users", allBapi.follow_users, error);
app.post("/api/get_followers_user_s_user",allBapi.get_followers_user_s_user,error);
app.post("/api/addUserAsMark", allBapi.addUserAsMark, error);
app.post("/api/SubscriptionPlans", allBapi.SubscriptionPlans, error);
app.post("/api/PurchaseSubscription", allBapi.PurchaseSubscription, error);
app.post("/api/showUserProfile", allBapi.showUserProfile, error);
app.post("/api/getMarkUserProfile", allBapi.getMarkUserProfile, error);
app.post("/api/edit_profile", allBapi.edit_profile, error);
app.post("/api/updateUserCategory", allBapi.updateUserCategory, error);
app.post("/api/userCategory", allBapi.userCategory, error);
app.post("/api/getUserCategory", allBapi.getUserCategory, error);
app.post("/api/getNotifications_1", allBapi.getNotifications_1, error);
app.post("/api/sendPushNotification", allBapi.sendPushNotification, error);
app.post("/api/getNotifications", allBapi.getNotifications, error);
app.post("/api/getBanner1", allBapi.getBanner1, error);
app.post("/api/archivedLiveEventTime", allBapi.archivedLiveEventTime, error);
app.post("/api/updateLiveEventTime", allBapi.updateLiveEventTime, error);
app.post("/api/participateEvent", allBapi.participateEvent, error);
app.post("/api/cronTimeEvent1", allBapi.cronTimeEvent1, error);
app.post("/api/getYourBank", allBapi.getYourBank, error);
app.post("/api/addBank", allBapi.addBank, error);
app.post("/api/addWithdrawRequest", allBapi.addWithdrawRequest, error);
app.post("/api/getYourWallet", allBapi.getYourWallet, error);
app.post("/api/upipaymentstatusupdate",allBapi.upipaymentstatusupdate,error);
app.post("/api/checkatomtechpaymentstatus",allBapi.checkatomtechpaymentstatus,error);
app.post("/api/getYourDiamond", allBapi.getYourDiamond, error);
app.post("/api/diamondExchange", allBapi.diamondExchange, error);
app.post("/api/diamondExchangeToINR", allBapi.diamondExchangeToINR, error);
app.post("/api/SendDiamonds", allBapi.SendDiamonds, error);
app.post("/api/PurchaseDiamonds", allBapi.PurchaseDiamonds, error);
app.post("/api/addUserAsMarkacceptdiamond",allBapi.addUserAsMarkacceptdiamond,error);
app.post("/api/removefrommarkedacceptdiamondsuser",allBapi.removefrommarkedacceptdiamondsuser,error);
app.post("/api/addDiamondsToUserWallet",allBapi.addDiamondsToUserWallet,error);
app.post("/api/my_FavSound", allBapi.my_FavSound, error);
app.post("/api/fav_sound", allBapi.fav_sound, error);
app.post("/api/SearchByHashTagClip", allBapi.SearchByHashTagClip, error);
app.post("/api/SearchByHashTagImage", allBapi.SearchByHashTagImage, error);
app.post("/api/SearchByHashTag", allBapi.SearchByHashTag, error);

app.post("/api/DeleteVideo", allBapi.DeleteVideo, error);
app.post("/api/admin_show_allMarkedsubscribUser",allBapi.admin_show_allMarkedsubscribUser,error);



//=================shots ========================//  -----file done

app.post("/api/allVideosExploreNew", allBapi.allVideosExploreNew, error);
app.post("/api/showAllVideos_1", allBapi.showAllVideos_1, error);
app.post("/api/showMyAllVideos", allBapi.showMyAllVideos, error);
app.post("/api/DeleteVideo", allBapi.DeleteVideo, error);
app.post("/api/updateVideoView", allBapi.updateVideoView, error);
app.post("/api/showVideoComments", allBapi.showVideoComments, error);
app.post("/api/reportVideo", allBapi.reportVideo, error)
app.get("/api/deleteSaveVideo", cronjob.deleteSaveVideo, error);   
app.post("/api/uploads3Video", allBapi.uploads3Video, error);
app.post("/api/uploadVideoNew", allBapi.uploadVideo, error)  //Not there 


//======================clips=========================//    ---file done 
app.post("/api/showAllVideosClip_1", allBapi.showAllVideosClip_1, error);
app.post("/api/showMyAllVideosClip", allBapi.showMyAllVideosClip, error);
app.post("/api/uploadVideoClip", allBapi.uploadVideoClip, error);
app.post("/api/SearchByHashTagClip", allBapi.SearchByHashTagClip, error);
//=============================Banner================//
app.post("/api/getBanner1", allBapi.getBanner1, error);

//===========================Users==========================//  ---file done
app.post("/api/admin_show_allMarkedsubscribUser",allBapi.admin_show_allMarkedsubscribUser,error);
app.post("/api/showUserInfo", profile.showUserInfo, error);  //----Not Found====//
app.post("/api/userViewUpdateStory", allBapi.userViewUpdateStory, error);
app.post("/api/get_followings_user_s_user",allBapi.get_followings_user_s_user,error);
app.post("/api/get_user_data", allBapi.get_user_data, error);
app.post("/api/block_user", allBapi.block_user, error);
app.post("/api/follow_multiple_user", allBapi.follow_multiple_user, error);
app.post("/api/follow_users", allBapi.follow_users, error);
app.post("/api/get_followers_user_s_user",allBapi.get_followers_user_s_user,error);
app.post("/api/addUserAsMark", allBapi.addUserAsMark, error);
app.post("/api/showUserProfile", allBapi.showUserProfile, error);
app.post("/api/getMarkUserProfile", allBapi.getMarkUserProfile, error);
app.post("/api/edit_profile", allBapi.edit_profile, error);
app.post("/api/updateUserCategory", allBapi.updateUserCategory, error);
app.post("/api/userCategory", allBapi.userCategory, error);
app.post("/api/getUserCategory", allBapi.getUserCategory, error);
app.post("/api/addUserAsMarkacceptdiamond",allBapi.addUserAsMarkacceptdiamond,error);//===not found
app.post("/api/removefrommarkedacceptdiamondsuser",allBapi.removefrommarkedacceptdiamondsuser,error);
app.post("/api/addDiamondsToUserWallet",allBapi.addDiamondsToUserWallet,error);

//===============================Images===================================//
app.post("/api/webUploadImage", allBapi.webUploadImage, error);
app.post("/api/showAllImage_1", allBapi.showAllImage_1, error);
app.post("/api/showMyAllImage", allBapi.showMyAllImage, error);
app.post("/api/uploadImage", allBapi.uploadImage, error);
app.post("/api/uploadImage_", allBapi.uploadImage_, error);
app.post("/api/SearchByHashTagImage", allBapi.SearchByHashTagImage, error);

//================================Notification====================//
app.post("/api/getNotifications_1", allBapi.getNotifications_1, error);
app.post("/api/sendPushNotification", allBapi.sendPushNotification, error);
app.post("/api/getNotifications", allBapi.getNotifications, error);

//============================Likes======================//
app.post("/api/my_liked_video", allBapi.my_liked_video, error);
app.get("/api/autoLike", cronjob.autoLike, error);
app.post("/api/likeDislikeVideo", allBapi.likeDislikeVideo, error);

//===========================Events=====================//
app.post("/api/archivedLiveEventTime", allBapi.archivedLiveEventTime, error);
app.post("/api/updateLiveEventTime", allBapi.updateLiveEventTime, error);
app.post("/api/participateEvent", allBapi.participateEvent, error);
app.post("/api/cronTimeEvent1", allBapi.cronTimeEvent1, error);
};
