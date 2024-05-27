// const path = require('path');
// const fs = require('fs');
// const { v4: uuidv4 } = require('uuid');
// const { forEach } = require('p-iteration');

// const slugify = require("slugify");
// const ec = require('../../lib/error_consts');
// const utils = require('../../lib/utils');
// const generator = require('generate-password');
// const bcrypt = require("bcrypt")
// const passport = require('passport')

// const uploadFiles = require('../upload_files');
// const axios = require('axios');
// const customerDealerModel = require('../../model/customerDealer/customerDealer');
const mysql = require('mysql2/promise');

//const mysql = require('mysql');



const customerFunctions = {
   
    connection: async function () {
        const connection = await mysql.createConnection({
            host     : process.env.MYSQL_HOST,
            user     : process.env.MYSQL_USER,
            port: Number(process.env.MYSQL_PORT),
            password : process.env.MYSQL_PWD,
            database : process.env.MYSQL_DB,
            multipleStatements:true,
            queryTimeout: 6000,
            connectTimeout: 60000,
        });
        return connection;
    },
     startsWiths: async function (string, startString) {
        
            let len = startString.length;
            return (substr(string, 0, len) === startString);
        },
     checkProfileURL: async function(url)
	{
	   
	    
	    
	    $checkImageURL=indexOf(url,'.com');
	    if($checkImageURL==true)
	    {
	        return url;
	    }
	    else
	    if(url=="null")
	    {
	        return "null";
	    }
	    else
	    {
	       // return API_path."/".$url;
	       // return API_path.$url;
		   if(startsWiths(url,"upload"))
            {
	        	//return API_path."/".$url;
	        	return API_path+"UpLoad/"+url;
            }
          	else if(startsWiths(url,"UpLoad/Vidz"))
            {
              return API_path+"UpLoad/"+url;
            }
          	else
        	{
              return API_path+url;
            }
	    }
	},
    getHeart: async function(ids)
	{
	    
	    $s=0;
	    foreach(ids as id){
	    $res=mysqli_query($conn, "SELECT fake_like FROM videos WHERE id='$id'");
	    while($r=mysqli_fetch_assoc($res))
	    {
	        $s+=$r["fake_like"];
	    }}
	    return $s;
	},
    
    showAllVideosClip_1: async function (req, res, next) {

        let result = {};
        const connected = await customerFunctions.connection();

        // try {

           // let conditions =filters.post_name;
           let BLK_USR1=await customerFunctions.getBlockUsers(req);
           
          if(BLK_USR1!=''){ let BLK_USR=" AND fb_id NOT IN ("+BLK_USR1+") ";  }

          let REPET_VID1=""; let REPET_VID="";
          if(req.device_id) {
	        if(req.device_id!=""){
	            let devc_id=req.device_id;
	            REPET_VID1=await customerFunctions.blockRepeatVideo(devc_id);
	            //if($REPET_VID1!='') { $REPET_VID=" AND id NOT IN ($REPET_VID1) "; }
	        }
        }
        let VidID=[];
        //console.log("BLK_USR1 req",req)
        if(req.fb_id){
            console.log("BLK_USR1 req",req)
            let fb_id= req.fb_id.trim();
            let token=req.token;
			let device_id=req.device_id;
			let category=req.category;
			let type=req.type;
			let qq="";
			if(category!="")
			{
			    qq=" AND category='"+category+"' ";
			}
            let update=await connected.execute("update users set tokon='"+token+"' where fb_id='"+fb_id+"' ");
            let QStatus=await connected.execute("select * from users where fb_id='"+fb_id+"' ");

            let array_for_you=[];
            let query=''
            if(req.video_id)
            {
                //$query=mysqli_query($conn,"select * from videos where types='$types' AND id='".$event_json['video_id']."' ");
                query=await connected.execute("select * from videos where  ids='"+req.video_id+"' ");
            }
            else
            if(type=="related")
            {
                query=await connected.execute("select * from videos where  AND for_you='1' and vtype='Clip' "+qq+" "+REPET_VID+"  order by rand() limit 50");
            }
            else
            if(type=="following")
            {
                let query123=await connected.execute("select * from follow_users where fb_id='"+fb_id+"' ");
                let array_out_count_heart ="";
                query123[0].forEach(row123 => {
                    array_out_count_heart +=row123.followed_fb_id+',';
                 });
                array_out_count_heart= array_out_count_heart+'0';
                query=await connected.execute("select * from videos where  for_you='1' and vtype='Clip' "+qq+" "+REPET_VID+"  fb_id IN("+array_out_count_heart+") order by rand() limit 50");
            }
            else
            {
                //console.log("last condition ", "select * from videos where for_you='1' and vtype='Short' "+qq+" "+REPET_VID+" order by rand() limit 50")
                query=await connected.execute("select * from videos where for_you='1' and vtype='Short' "+qq+" "+REPET_VID+" order by rand() limit 50");
            }
            for(i=0; i < query[0].length; i++){
                let row=query[0][i]
          //  console.log("query query query",query[0])
           // await forEach(query[0], async (row) => {
            
        //   await query[0].forEach(async (row) => {
              //  console.log("row row row",row)
           // query[0].forEach(row => {
               
                let query1=await connected.execute("select * from users where fb_id='"+row.fb_id+"' ");
                console.log("queesti query1",query1[0][0])

                let query112=await connected.execute("select * from sound where id='"+row.sound_id+"' ");

                let countLikes = "SELECT count(1) as count_like from video_like_dislike where video_id='"+row.id+"'"; // ADD BY SANGAT SHAH
                let countLikes_count=await connected.execute(countLikes);

                let AR=array(row.id);
                let countLikes_count_=getHeart(AR);
                let array_for_you_value={
                    tag:"trending",
                    id:row.id,
                    fb_id:row.fb_id,
                    user_info:{
                        fb_id:query1[0][0].fb_id,
                        first_name:query1[0][0].first_name,
                        last_name:query1[0][0].last_name,
                        profile_pic:checkProfileURL(query1[0][0].profile_pic),
                        username: "@"+query1[0][0].username,
                        verified:query1[0][0].verified,
                        bio:query1[0][0].bio,
                        gender:query1[0][0].gender,
                        category:query1[0][0].category,
    					marked:query1[0][0].marked
                    },
                    count:{
                		like_count:(countLikes_count['count']+$countLikes_count_,
                        video_comment_count:"$countcomment_count['count']",
                        view:"($row['view']+$row[fake_view])"
                    },
                    followStatus:"checkFollowStatus($fb_id,$row['fb_id'])",
                	liked:"$liked_count['count']",
                	video:"checkVideoUrl($row['video'])",
            		thum:"checkVideoUrl($row['thum'])",
            		gif:"checkVideoUrl($row['gif'])",
            		category:query1[0].category,
            		description:query1[0].description,
            		type:query1[0].type,
            		marked:query1[0].marked,
                    allowDownload:query1[0].allowDownload,
                }
                array_for_you.push(array_for_you_value)
            
             }
             console.log("row row array_for_you",array_for_you)
             return array_for_you

            

           
        }
        else {
            let array_out = [];
					
			 array_out ={
                response: "Json Parem are missing4"
            } 
			
			let output={
                code:"201",
                userStatus:"-",
                msg:array_out,
                timeEvent:[]                
            }
            return output

        }

           
          

        //     let query = `SELECT * FROM videos limit 10`;
        //     const authorised =  await connected.execute(query);
        //     console.log("result fun tes",authorised)
           
        //    return authorised;
            //console.log("result",checkEmail)

            // Check if email is already registered

           // let checkDup = await customerDealerModel.find({email: params.email.toLowerCase()}).lean();

            // if(checkDup.length) {
            //     return {
            //         success: false,
            //         message: "This Email already exists"
            //     }
            // }

            // let customerDealer_id = uuidv4();

            // let password_hash = await bcrypt.hash(params.password, 10);

            // let dealer_data = {
            //     _id: customerDealer_id,
            //     firstName: params.firstName,
            //     lastName: params.lastName,
            //     email: params.email.toLowerCase(),
            //     phone: params.phone,
            //     state: params.state,
            //     city: params.city,
            //     password: password_hash,
            //     newsletterCheck: (params.newsletterCheck === 'true' || params.newsletterCheck === true) ? true : false
            // }

            // let register = await customerDealerModel.create(dealer_data)

            // result["success"] = true;
            // result["message"] = "Dealer is successfully registered";

        // } catch (err) {
        //     result = {
        //         success: false,
        //         message: err.message
        //     }
        // }
        //console.log("result final",result)
        
    },
    blockRepeatVideo: async function (deviceID) {
    
        const connected = await customerFunctions.connection();          

            let query = `SELECT video_id  from view_view_block where device_id='`+deviceID+`'`;
            const authorised =  await connected.execute(query);
            // var resultsData = JSON.parse(JSON.stringify(authorised));
            // console.log("resultsData",resultsData)
            let NOTINV="";
            if (authorised[0].length > 0) {
                let i=1;
			    let XX="";
                authorised[0].forEach(value => {
                   // console.log("value",value)
					if(i<authorised.length)
				    {
				        XX +="'"+value.video_id+"',";
				    }
				    else
				    {
				        XX +="'"+value.video_id+"'";
				    }
				    i++;
				 });
                 NOTINV=XX;
            }
            console.log("NOTINV",NOTINV)
           
           return NOTINV;

        // require("config.php");
        // $NOTINV="";
		// 	$query399=mysqli_query($conn,"SELECT video_id  from view_view_block where device_id='$deviceID'");
		// 	$cntNotIn=mysqli_num_rows($query399);
		// 	if($cntNotIn>0)
		// 	{
		// 	    $i=1;
		// 	    $XX="";
    	// 	    while($q=mysqli_fetch_assoc($query399))
    	// 	    {
    	// 	        if($i<$cntNotIn)
		// 		    {
		// 		        $XX.="'".$q["video_id"]."',";
		// 		    }
		// 		    else
		// 		    {
		// 		        $XX.="'".$q["video_id"]."'";
		// 		    }
		// 		    $i++;
    	// 	    }
    		   
    	// 	    $NOTINV=$XX;
		// 	}
		// 	return $NOTINV;
    },
    getBlockUsers: async function (params) {
        const connected = await customerFunctions.connection();
          

            let query = `SELECT fb_id  from users where block='1'`;
            const authorised =  await connected.execute(query);
            // var resultsData = JSON.parse(JSON.stringify(authorised));
            // console.log("resultsData",resultsData)
            let NOTIN="";
            if (authorised[0].length > 0) {
                let i=1;
			    let XX="";
                authorised[0].forEach(value => {
                   // console.log("value",value)
					if(i<authorised.length)
				    {
				        XX +="'"+value.fb_id+"',";
				    }
				    else
				    {
				        XX +="'"+value.fb_id+"'";
				    }
				    i++;
				 });
                 NOTIN=XX;
            }
            console.log("NOTIN",NOTIN)
           
           return NOTIN;
    }

}

module.exports = customerFunctions;