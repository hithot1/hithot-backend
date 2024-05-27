
app.post("/api/manualsignin", loginsignup.manualsignin, error);
app.get("/api/deleteallfiles", loginsignup.deleteallfiles, error); //do not run this
app.post("/api/manualsignup", loginsignup.manualsignup, error);
app.post("/api/updatelocation", loginsignup.updatelocation, error);
app.post("/api/signup", loginsignup.signup, error);
app.post("/api/getAllReferral", profile.getAllReferral, error);
app.post("/api/manualReferral", profile.manualReferral, error);
app.post("/api/ifParticipateThenStartLive",allBapi.ifParticipateThenStartLive,error);
app.get("/api/appSetting", allBapi.appSetting, error);
app.post("/api/updatePhoneNumber", allBapi.updatePhoneNumber, error);
app.post("/api/forgotpassword", allBapi.forgotpassword, error);

app.post("/api/addStory", allBapi.addStory, error);
app.post("/api/getStory", allBapi.getStory, error);
app.post("/api/generateAgoraToken", allBapi.generateAgoraToken, error);

app.post("/api/getListOfBlock", allBapi.getListOfBlock, error);
app.post("/api/postComment", allBapi.postComment, error);
app.post("/api/deleteComment", allBapi.deleteComment, error);

app.post("/api/removeFromBlock", allBapi.removeFromBlock, error);
app.post("/api/showPackagesList", allBapi.showPackagesList, error);
app.post("/api/getYourReferral", allBapi.getYourReferral, error);
app.post("/api/getAwardWinner", allBapi.getAwardWinner, error);
app.post("/api/getVerifiedNew", allBapi.getVerifiedNew, error);
app.post("/api/downloadFile", allBapi.downloadFile, error);
app.post("/api/downloadFileTest", allBapi.downloadFileTest, error);

app.post("/api/cropAAC", allBapi.cropAAC, error);
app.post("/api/getHashtagList", allBapi.getHashtagList, error);
app.post("/api/maintanancMode", allBapi.maintanancMode, error)  
app.post("/api/checkTime", allBapi.checkTime, error);
app.post("/api/updateRefCode", allBapi.updateRefCode, error);
;

app.post("/api/uploadAudio", allBapi.uploadAudio, error);

app.post("/api/SubscriptionPlans", allBapi.SubscriptionPlans, error);
app.post("/api/PurchaseSubscription", allBapi.PurchaseSubscription, error);
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

app.post("/api/my_FavSound", allBapi.my_FavSound, error);
app.post("/api/fav_sound", allBapi.fav_sound, error);

app.post("/api/SearchByHashTag", allBapi.SearchByHashTag, error);



