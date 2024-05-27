module.exports = {
    
    thumb_image: {
        data: 'mime:jpg,jpeg,png,gif|size:5mb,5kb|dimensions:minWidth=250,minHeight=250,maxWidth=250,maxHeight=250'
    },
    thumb_imagee:{
        data: 'mime:jpg,jpeg,png,gif|dimensions:minWidth=30,minHeight=30,maxWidth=50,maxHeight=50'
    },
    thumb_image_con: {
        data: 'mime:jpg,jpeg,png,gif|size:5mb,5kb|dimensions:minWidth=250,minHeight=350,maxWidth=250,maxHeight=350'
    },
    mybook_thumb_image: {
        data: 'mime:jpg,jpeg,png,gif|size:5mb,5kb|dimensions:minWidth=230,minHeight=340,maxWidth=270,maxHeight=360'
    },
    mysong_thumb_image: {
        data: 'mime:jpg,jpeg,png,gif|size:5mb,5kb|dimensions:minWidth=230,minHeight=340,maxWidth=270,maxHeight=360'
    },
    myfilm_thumb_image: {
        data: 'mime:jpg,jpeg,png,gif|size:5mb,5kb|dimensions:minWidth=230,minHeight=340,maxWidth=270,maxHeight=360'
    },
    image: {
        data: 'mime:jpg,jpeg,png,gif|size:5mb,1kb'
    },
    image_daughter: {
        data: 'mime:jpg,jpeg,png,gif|size:5mb,10kb|dimensions:minWidth=650,minHeight=450,maxWidth=1000,maxHeight=1400'
    },
    post_image: {
        data: 'mime:jpg,jpeg,png,gif|size:5mb,10kb|dimensions:minWidth=600,minHeight=400,maxWidth=700,maxHeight=500'
    },
    mobile_image: {
        data: 'mime:jpg,jpeg,png,gif|size:5mb,10kb|dimensions:minWidth=600,minHeight=400,maxWidth=2000,maxHeight=1400'
    },
    home_main_image: {
        data: 'mime:jpg,jpeg,png,gif|size:5mb,5kb|dimensions:minWidth=400,minHeight=600,maxWidth=550,maxHeight=870'
    },
    home_side_image: {
        data: 'mime:jpg,jpeg,png,gif|size:5mb,5kb|dimensions:minWidth=470,minHeight=480,maxWidth=520,maxHeight=550'
    },
    ad_banner_image: {
        data: 'mime:jpg,jpeg,png,gif|size:5mb,5kb|dimensions:minWidth=500,minHeight=200,maxWidth=700,maxHeight=500'
    },
    image: {
        data: 'mime:jpg,jpeg,png,gif|size:5mb,1kb'
    },
    logoImage: {
        data: 'mime:jpg,jpeg,png,gif|size:5mb,1kb'
    },
    partnershipss: {
        data: 'mime:jpg,jpeg,png,gif|dimensions:minWidth=150,minHeight=40,maxWidth=300,maxHeight=60'
    },
    whychoose_usImage: {
        data: 'mime:jpg,jpeg,png,gif|size:5mb,1kb'
    },
    home_gallery: {
        title: 'required|string|minLength:3|maxLength:255',
        thumbnail_alt: 'required|string|maxLength:255',
        // slug: 'required|string|minLength:3|maxLength:255',
        // meta_description: 'required|string|minLength:3|maxLength:255',
        // meta_keywords: 'required|string|minLength:3|maxLength:255',
    },


    speciality: {
        title: 'required|string|minLength:3|maxLength:255',
        thumbnail_alt: 'required|string|maxLength:255',
        // slug: 'required|string|minLength:3|maxLength:255',
        // meta_description: 'required|string|minLength:3|maxLength:255',
        // meta_keywords: 'required|string|minLength:3|maxLength:255',
    },
    home_general: {

        _id: 'required|string',
        title: 'required|string|minLength:3|maxLength:255',
        main_image_alt: 'required|string|maxLength:255',
        side_image_alt: 'required|string|maxLength:255',
        about_me: 'required|string|minLength:3|maxLength:500',
        meta_description: 'required|string|minLength:3|maxLength:255',
        meta_keywords: 'required|string|minLength:3|maxLength:255',
        external_url: 'required|url|maxLength:400'        
    },

    mybooks_general: {
        _id: 'required|string',
        title: 'required|string|minLength:3|maxLength:255',
        main_image_alt: 'required|string|maxLength:255',
        about_me: 'required|string|minLength:3|maxLength:500',
        about: 'required|string|minLength:3|maxLength:500',
        meta_description: 'required|string|minLength:3|maxLength:255',
        meta_keywords: 'required|string|minLength:3|maxLength:255',
        press_release_subheading: 'required|string|minLength:3|maxLength:255',
        testimonial_subheading: 'required|string|minLength:3|maxLength:255',
        review_subheading: 'required|string|minLength:3|maxLength:255',
    },

    myjournalisms_general: {
        _id: 'required|string',
        title: 'required|string|minLength:3|maxLength:255',
        main_image_alt: 'required|string|maxLength:255',
        about_me: 'required|string|minLength:3|maxLength:500',
        about: 'required|string|minLength:3|maxLength:500',
        meta_description: 'required|string|minLength:3|maxLength:255',
        meta_keywords: 'required|string|minLength:3|maxLength:255',
        press_release_subheading: 'required|string|minLength:3|maxLength:255',
        testimonial_subheading: 'required|string|minLength:3|maxLength:255',
        review_subheading: 'required|string|minLength:3|maxLength:255',
    },
   

    home_feed_category: {
        name: 'required|string|minLength:2|maxLength:255',
        ad_banner_alt: 'required|string|maxLength:255',
        ad_banner_external_url: 'required|string|minLength:3|maxLength:255',
        meta_description: 'required|string|minLength:3|maxLength:255',
        meta_keywords: 'required|string|minLength:3|maxLength:255',
    },
    books: {
        title: 'required|string|minLength:3|maxLength:255',
        hindititle: 'required|string|minLength:3|maxLength:255',
        buynowurl: 'required|string|minLength:3|maxLength:255',
        bookdescription: 'required|string|minLength:3',
        page1content: 'required|string|minLength:3',
        page2content: 'required|string|minLength:3',
        thumbnail_alt: 'required|string|maxLength:255',
        slug: 'required|string|minLength:3|maxLength:255',
        meta_description: 'required|string|minLength:3|maxLength:255',
        meta_keywords: 'required|string|minLength:3|maxLength:255',
    },
    faqs: {
        title: 'required|string|minLength:3|maxLength:255',
        
        description:'required|string|minLength:3',
        
    },
    partnership: {
        heading: 'required|string|minLength:3|maxLength:255',
        bg_alt: 'required|string|maxLength:255',
        link: 'required|string|minLength:3|maxLength:255',

    },
    patientreviews: {
        patient_name: 'required|string|minLength:3|maxLength:255',
        
        description: 'required|string|minLength:3|maxLength:255',
        treatment: 'required|string|minLength:3|maxLength:255',
      
       
      

    },
    partners: {
        url: 'required|string|minLength:3|maxLength:255',
        
        //main_image: "required|string|minLength:3|maxLength:255",
        mainimage_alt: 'required|string|maxLength:255',
        
    },
    testimonials: {
        url: 'required|string|minLength:3|maxLength:255',
        
        //main_image: "required|string|minLength:3|maxLength:255",
        mainimage_alt: 'required|string|maxLength:255',
        patient_name: 'required|string|minLength:3|maxLength:255',
        doctor_name: 'required|string|minLength:3|maxLength:255',
        hospital_name: 'required|string|minLength:3|maxLength:255',
        //image: String,
       // video: String,
       
        
        
        address: 'required|string|minLength:3|maxLength:255',
        
    },
    gettreatments: {
        title: 'required|string|minLength:3|maxLength:255',
      button_name: 'required|string|minLength:3|maxLength:255',
      button_url:'required|string|minLength:3|maxLength:255',
      
      description: 'required|string|minLength:3|maxLength:255',
    },
    diseasemanagement: {
        title: 'required|string|minLength:3|maxLength:255',
    
        url:  'required|string|minLength:3|maxLength:255',
   
        description:  'required|string|minLength:3|maxLength:255',
    },

    journalisms:{
        title: 'required|string|minLength:3|maxLength:255',
        thumbnail_alt: 'required|string|maxLength:255',
        meta_description: 'required|string|minLength:3|maxLength:255',
        meta_keywords: 'required|string|minLength:3|maxLength:255',
        journalismdescription: 'required|string|minLength:3',
        slug: 'required|string|minLength:3|maxLength:255',

    
    },


    films: {
        title: 'required|string|minLength:3|maxLength:255',
        hindititle: 'required|string|minLength:3|maxLength:255',
        filmdescription: 'required|string|minLength:3',
        thumbnail_alt: 'required|string|maxLength:255',
        slug: 'required|string|minLength:3|maxLength:255',
        meta_description: 'required|string|minLength:3|maxLength:255',
        meta_keywords: 'required|string|minLength:3|maxLength:255',
    },

    songs: {
        songname: 'required|string|minLength:3|maxLength:255',
        songby: 'required|string|minLength:3|maxLength:255',
        spotifyurl: 'required|string|minLength:3|maxLength:255',
        songdescription: 'required|string|minLength:3',
        thumbnail_alt: 'required|string|maxLength:255',
        meta_description: 'required|string|minLength:3|maxLength:255',
        meta_keywords: 'required|string|minLength:3|maxLength:255',
    },

    feed_category: {
        name: 'required|string|minLength:2|maxLength:255',
        ad_banner_alt: 'required|string|maxLength:255',
        ad_banner_external_url: 'required|string|minLength:3|maxLength:255',
        meta_description: 'required|string|minLength:3|maxLength:255',
        meta_keywords: 'required|string|minLength:3|maxLength:255',
    },

    reviews: {
        title: 'required|string|minLength:2|maxLength:255',
        name: 'required|string|maxLength:255',
        designation: 'required|string|maxLength:255',
        rating: 'required|string|maxLength:10',
        description: 'required|string|minLength:3|maxLength:255',
    },

    home_post: {
        title: 'required|string|minLength:2|maxLength:255',
        type: 'required|string|in:audio,video,external,image',
    },

    post: {
        title: 'required|string|minLength:2|maxLength:255',
        type: 'required|string|in:audio,video,external,image',
    },

    checkUrl: {
        url: 'required|url'
    } ,

    videos: {
        title: 'required|string|minLength:2|maxLength:255',
        meta_description: 'required|string|minLength:3|maxLength:255',
        meta_keywords: 'required|string|minLength:3|maxLength:255',
        video_description: 'required|string|minLength:3|maxLength:255',
        thumbnail_alt: 'required|string|maxLength:255',
       // slug: 'required|string|minLength:3|maxLength:255',
       
    },

    privacy: {
        title: 'required|string|minLength:2|maxLength:255',
        meta_description: 'required|string|minLength:3|maxLength:255',
        meta_keywords: 'required|string|minLength:3|maxLength:255',
        policy_description: 'required|string|minLength:3|maxLength:255',
        // thumbnail_alt: 'required|string|maxLength:255',
        slug: 'required|string|minLength:3|maxLength:255',
       
    },


    myconversation_general: {
        _id: 'required|string',
        title: 'required|string|minLength:3|maxLength:255',
        main_image_alt: 'required|string|maxLength:255',
        about: 'required|string|minLength:3|maxLength:500',
        meta_description: 'required|string|minLength:3|maxLength:255',
        meta_keywords: 'required|string|minLength:3|maxLength:255',
        press_release_subheading: 'required|string|minLength:3|maxLength:255',
        testimonial_subheading: 'required|string|minLength:3|maxLength:255',
        review_subheading: 'required|string|minLength:3|maxLength:255',
    },


    mystory_general: {
        title: 'required|string|minLength:3|maxLength:255',
        main_image_alt: 'required|string|maxLength:255',
        about: 'required|string|minLength:3|maxLength:500',
        meta_description: 'required|string|minLength:3|maxLength:255',
        meta_keywords: 'required|string|minLength:3|maxLength:255',
        press_release_subheading: 'required|string|minLength:3|maxLength:255',
        // testimonial_subheading: 'required|string|minLength:3|maxLength:255',
        // review_subheading: 'required|string|minLength:3|maxLength:255',
    },

    myhomepage : {
        _id: 'required|string',
        title: 'required|string|minLength:3|maxLength:255',
        // main_image_alt: 'required|string|maxLength:255',
        // awards_description: 'required|string|minLength:3|maxLength:255',

    },

    chatWithMe: {
        name: 'required|string|minLength:2|maxLength:255',
        mobile_no: 'string|minLength:3|maxLength:15',
        email_id: 'required|email|minLength:5|maxLength:50',
        message: 'required|string|minLength:3|maxLength:500'
    },

    talkToMe: {
        file: 'required|mime:mp3|size:10mb,5kb'
    },
    talkToMeReply: {
        // file: 'required|mime:audio/wav|size:10mb,1kb'
        file: 'required|size:10mb,1kb'
    },

    mydaughter: {
        videoPost: {
            title: 'required|string|minLength:3|maxLength:255',
            description: 'required|string|minLength:3',
            image_alt: 'required|string|maxLength:255',
            slug: 'required|string|minLength:3|maxLength:255',
            meta_description: 'required|string|minLength:3|maxLength:255',
            meta_keywords: 'required|string|minLength:3|maxLength:255',
            external_video_url: 'url|maxLength:400'

        },

        image: {
            data: 'mime:jpg,jpeg,png,gif|size:5mb,5kb|dimensions:minWidth=580,minHeight=360,maxWidth=800,maxHeight=500'
        },

        video: {
            file: 'required|size:100mb,1kb'
        }
    },

    commentData: {
        text: 'required|string|maxLength:500',
        post_id: 'required|string|maxLength:30',
        post_type: 'required|string|maxLength:20',
        is_reply: 'required|boolean',
    },
    blogCommentData: {
        text: 'required|string|maxLength:500',
        post_id: 'required|string|maxLength:30',
        email_id: 'required|email|maxLength:50',
        name: 'required|string|maxLength:50',
        is_reply: 'required|boolean'
    },
    locationsData: {
        city: 'required|string|maxLength:200',
        checked: 'required|boolean'
    },
    centerOfExcellenceData: {
        excellenceTitle: 'required|string|minLength:2|maxLength:255',
        excellenceImageAlt: 'required|string|maxLength:255',
        excellenceIconAlt: 'required|string|maxLength:255',
        excellenceDescription: 'required|string|minLength:3|maxLength:255',
    },
    excellenceImage: {
        data: 'mime:jpg,jpeg,png|size:2mb|dimensions:minWidth=500,minHeight=300,maxWidth=650,maxHeight=400'
    },
    excellenceIcon: {
        data: 'mime:jpg,jpeg,png|dimensions:minWidth=80,minHeight=80,maxWidth=150,maxHeight=150'
    },
    services: {
        title: "required|string|minLength:2|maxLength:255",
        description: "required|string|minLength:3|maxLength:255",
        serviceImageAlt: "required|string|maxLength:255"
    },
    serviceImage: {
        data: 'mime:jpg,jpeg,png|size:5mb,1kb|dimensions:minWidth=59,minHeight=63,maxWidth=59,maxHeight=63'
    },
    healthPackagesData: {
        title: "required|string|minLength:2|maxLength:255",
        description: "required|string|minLength:3",
        price: "required|string|min:1|max:9999|minLength:1|maxLength:4",
        noOfDays: "required|string|min:1|max:99|minLength:1|maxLength:2",
        age: "required|string|minLength:1|maxLength:255",
        gender: "required|string|minLength:1|maxLength:255",
        callImageAlt: "required|string|minLength:1|maxLength:255",
    },
    callImage: {
        data: 'mime:jpg,jpeg,png|size:5mb,1kb'
    },
    healthPackagesGeneralData: {
        title: "required|string|minLength:2|maxLength:255",
        imageAlt: "required|string|minLength:2|maxLength:255",
        metaTitle: "string|minLength:2|maxLength:255",
        metaDescription: "string|minLength:3|maxLength:255",
        slug: 'required|string|minLength:3|maxLength:255',
        description: 'required|string|minLength:3',
    },
    healthPackageImage1: {
        data: 'mime:jpg,jpeg,png|size:5mb,1kb|dimensions:minWidth=1170,minHeight=270,maxWidth=1170,maxHeight=270'
    },
    healthPackageImage2: {
        data: 'mime:jpg,jpeg,png|size:5mb,1kb|dimensions:minWidth=1170,minHeight=270,maxWidth=1170,maxHeight=270'
    },
    bannerImage: {
        data: 'mime:jpg,jpeg,png|size:5mb,1kb'
    },
    awardsIcon: {
        data: 'mime:jpg,jpeg,png|size:5mb,2kb'
    },
    mobileImage: {
        data: 'mime:jpg,jpeg,png|size:5mb,1kb'
    },
    image_file1: {
        data: 'mime:jpg,jpeg,png|size:2mb,5kb|dimensions:minWidth=1450,minHeight=400,maxWidth=1700,maxHeight=600'
    },
    hospitalData: {
        hospitalName: 'required|string|minLength:2|maxLength:255',
        hospitalLocation: 'required|string',
        starRating: 'required|string|min:1|max:99|minLength:1|maxLength:2',
        serviceTitle: 'required|string|minLength:2|maxLength:255',
        serviceDescription: 'required|string|minLength:3|maxLength:255',
        slug: 'required|string|minLength:3|maxLength:255',
        hospitalAboutTitle: 'required|string|minLength:2|maxLength:255',
        hospitalAboutDescription: 'required|string|minLength:3',
        hospitalAboutImageAlt: 'required|string|minLength:2|maxLength:255',
        metaTitle: 'string|minLength:2|maxLength:255',
        metaDescription: 'string|minLength:3|maxLength:255',
        virtualTour: 'string|minLength:3|maxLength:255',
        getDirections: 'required|string|minLength:3|maxLength:255',
        checked: 'required|boolean'
    },
    hospitalGroupBannerData: {
        bannerImagePosition: 'required|string|min:1|max:99|minLength:1|maxLength:2',
        bannerImageAlt: 'required|string|minLength:2|maxLength:255',
        bannerIconAlt: 'required|string|minLength:2|maxLength:255',
    },
    miscProcedureBannerImage: {
        data: 'mime:jpg,jpeg,png|size:2mb,1kb|dimensions:minWidth=400,minHeight=300,maxWidth=400,maxHeight=300'
    },
    hospitalBannerImage: {
        data: 'mime:jpg,jpeg,png|size:2mb,1kb|dimensions:minWidth=1550,minHeight=350,maxWidth=1750,maxHeight=550'
    },
    mobileBannerImage: {
        data: 'mime:jpg,jpeg,png|size:2mb,1kb|dimensions:minWidth=300,minHeight=500,maxWidth=500,maxHeight=700'
    },
    hospitalAboutImage: {
        data: 'mime:jpg,jpeg,png|size:2mb,1kb|dimensions:minWidth=450,minHeight=450,maxWidth=650,maxHeight=650'
    },
    videoThumbnail: {
        data: 'mime:jpg,jpeg,png|size:5mb,1kb'
    },
    bannerIcon: {
        data: 'mime:jpg,jpeg,png|dimensions:minWidth=90,minHeight=90,maxWidth=250,maxHeight=200'
    },
    hospitalVideo: {
        data: 'mime:mp4|size:10mb'
    },
    settingData: {
        hospitalName: 'required|string|minLength:2|maxLength:255',
        hospitalAddress: 'required|string|minLength:2|maxLength:255',
        hospitalMap: 'required|string|minLength:2|maxLength:255',
        hospitalPincode: 'required|string|min:1|max:9999999|minLength:1|maxLength:7',
        directionURL: 'string|minLength:2|maxLength:255',
    },
    hospitalContactSetting: {
        hospitalEmail: 'required|email|maxLength:50',
        hospitalMobileNumber: 'required|string|min:1|max:99999999999|minLength:1|maxLength:11',
        hospitalDropDown: 'required|string|minLength:2|maxLength:255'
    },
    hospitalImage: {
        data: 'mime:jpg,jpeg,png|size:2mb,5kb|dimensions:minWidth=500,minHeight=200,maxWidth=700,maxHeight=500'
    },
    diseasesData: {
        title: 'required|string|minLength:2|maxLength:255',
        description: 'required|string|minLength:3|maxLength:255',
        diseaseImageAlt: 'required|string|minLength:3|maxLength:255',
        longDescription: 'required|string|minLength:3',
    },
    diseaseImage: {
        data: 'mime:jpg,jpeg,png|size:2mb,1kb|dimensions:minWidth=500,minHeight=200,maxWidth=700,maxHeight=500'
    },
    patientStoriesGeneralData: {
        title: "required|string|minLength:2|maxLength:255",
        imageAlt: "required|string|minLength:2|maxLength:255",
        metaTitle: "string|minLength:2|maxLength:255",
        metaDescription: "string|minLength:3|maxLength:255",
        description: "required|string|minLength:3",
        slug: 'required|string|minLength:3|maxLength:255'
    },
    patientReviewssGeneralData: {
        title: "required|string|minLength:2|maxLength:255",
        imageAlt: "required|string|minLength:2|maxLength:255",
        metaTitle: "string|minLength:2|maxLength:255",
        metaDescription: "string|minLength:3|maxLength:255",
        slug: 'required|string|minLength:3|maxLength:255'
    },
    doctorsGeneralData: {
        title: "required|string|minLength:2|maxLength:255",
        imageAlt: "required|string|minLength:2|maxLength:255",
        metaTitle: "string|minLength:2|maxLength:255",
        metaDescription: "string|minLength:3|maxLength:255",
        slug: 'required|string|minLength:3|maxLength:255'
    },
    specialityGeneralData: {
        title: "required|string|minLength:2|maxLength:255",
        imageAlt: "required|string|minLength:2|maxLength:255",
        metaTitle: "string|minLength:2|maxLength:255",
        metaDescription: "string|minLength:3|maxLength:255",
        description: "required|string|minLength:3",
        slug: 'required|string|minLength:3|maxLength:255'
    },
    homepageGeneralData: {
        title1: "required|string|minLength:3",
        title2: "required|string|minLength:3",
        title3: "required|string|minLength:3",
        shortDesc1: "required|string|minLength:3",
        shortDesc2: "required|string|minLength:3",
        shortDesc3: "required|string|minLength:3",
        videoLink: "required|string|minLength:3",
        expCenterTitle: "required|string|minLength:3",
        expCenterDesc: "required|string|minLength:3",
        expCenterSlider: "required|string|minLength:3",
        brandTitle: "required|string|minLength:3",
        brandDesc: "required|string|minLength:3",
        metaTitle: "string|minLength:3",
        metaDesc: "string|minLength:3",
        slug: 'required|string|minLength:3|maxLength:255'
    },
    proceduresGeneralData: {
        title: "required|string|minLength:2|maxLength:255",
        imageAlt: "required|string|minLength:2|maxLength:255",
        metaTitle: "string|minLength:2|maxLength:255",
        metaDescription: "string|minLength:3|maxLength:255",
        slug: 'required|string|minLength:3|maxLength:255'
    },
    patientReviewsData: {
        patientName: 'required|string|minLength:2|maxLength:255',
        rating: 'required|string|min:1|max:5|minLength:1|maxLength:1',
        description: 'required|string|minLength:3',
        patientImageAlt: 'required|string|minLength:2|maxLength:255',
        subTitle: 'required|string|minLength:2|maxLength:255',
        hospitalNames: 'required|string|minLength:2|maxLength:255',
        doctorNames: 'required|string|minLength:2|maxLength:255',
    },
    patientImage: {
        data: 'mime:jpg,jpeg,png|size:2mb,5kb|dimensions:minWidth=500,minHeight=200,maxWidth=700,maxHeight=500'
    },
    specialityData: {
        title: 'required|string|minLength:2|maxLength:255',
        overviewTitle: 'required|string|minLength:2|maxLength:255',
        overviewDescription: 'required|string|minLength:3',
        slug: 'required|string|minLength:3|maxLength:255',
        overviewImageAlt: 'required|string|minLength:2|maxLength:255',
        specialityThumbnailImageAlt: 'required|string|minLength:2|maxLength:255',
        specialityBannerImageAlt: 'required|string|minLength:2|maxLength:255',
        metaTitle: 'string|minLength:2|maxLength:255',
        metaDescription: 'string|minLength:3|maxLength:255',
        position: 'required|string|min:1',
        checked: 'required|boolean'
    },
    specialityBannerImage: {
        data: 'mime:jpg,jpeg,png|size:5mb,1kb|dimensions:minWidth=1600,minHeight=400,maxWidth=1600,maxHeight=400'
    },
    specialityThumbnailImage: {
        data: 'mime:jpg,jpeg,png|size:5mb,1kb'
    },
    specialityGroupBannerData: {
        bannerImagePosition: 'required|string|min:1|max:99|minLength:1|maxLength:2',
        bannerImageAlt: 'required|string|minLength:2|maxLength:255',
        bannerIconAlt: 'required|string|minLength:2|maxLength:255',
    },
    specialityMiscData: {
        miscTitle: 'required|string|minLength:2|maxLength:255',
        miscImageAlt: 'required|string|minLength:2|maxLength:255',
        miscDescription: 'required|string|minLength:2|maxLength:255',
    },
    specialityTechnologyData: {
        technologyTitle: 'required|string|minLength:2|maxLength:255',
        technologyImageAlt: 'required|string|minLength:2|maxLength:255',
        technologyDescription: 'required|string|minLength:2|maxLength:255',
    },
    technologyImage: {
        data: 'mime:jpg,jpeg,png|size:2mb,1kb|dimensions:minWidth=500,minHeight=200,maxWidth=700,maxHeight=500'
    },
    overviewImage: {
        data: 'mime:jpg,jpeg,png|size:2mb,1kb|dimensions:minWidth=400,minHeight=300,maxWidth=600,maxHeight=600'
    },
    patientStoriesData: {
        title: 'required|string|minLength:2|maxLength:255',
        patientName: 'required|string|minLength:2|maxLength:255',
        patientLocation: 'required|string|minLength:2|maxLength:255',
        speciality: 'required|string|minLength:2|maxLength:255',
        bannerImageAlt: 'required|string|minLength:2|maxLength:255',
        video: 'required|string|minLength:2',
    },
    patientStoriesBannerImage: {
        data : 'mime:jpg,jpeg,png|size:5mb,1kb'
    },
    video: {
        data: 'mime:mp4|size:10mb'
    },
    doctorsData: {
        doctorName: 'required|string|minLength:2|maxLength:255',
        doctorImageAlt: 'string|minLength:2|maxLength:255',
        doctorDesignation: 'required|string|minLength:2|maxLength:255',
        doctorAppointmentURL: 'string|minLength:2|maxLength:255',
        doctorDescription: 'required|string|minLength:3',
        doctorRating: 'string|min:1|max:5|minLength:1|maxLength:1',
        slug: 'required|string|minLength:3|maxLength:255',
        metaTitle: 'string|minLength:2|maxLength:255',
        metaDescription: 'string|minLength:3|maxLength:255',
        OPDDescription: 'string|minLength:2',
        doctorQualifications: 'required|string|minLength:3|maxLength:255',
        doctorExperience: 'required|string|minLength:1|maxLength:255|min:1|max:99',
        // doctorCoverImageAlt: 'string|minLength:2|maxLength:255',
        doctorLocation: 'string|minLength:2|maxLength:255',
        doctorDepartment: 'string|minLength:2|maxLength:255',
        UHID: 'string|minLength:2|maxLength:255',
        checked: 'required|boolean'
    },
    aboutDoctorData: {
        aboutTitle: 'required|string|minLength:2|maxLength:255',
        aboutDescription: 'string|minLength:3'
    },
    doctorImage: {
        data : 'mime:jpg,jpeg,png|size:10mb,1kb'
    },
    doctorCoverImage: {
        data : 'mime:jpg,jpeg,png|size:2mb,5kb|dimensions:minWidth=500,minHeight=200,maxWidth=700,maxHeight=500'
    },
    specialityTypeData: {
        title: 'required|string|minLength:2|maxLength:255',
        shortDescription: 'required|string|minLength:2|maxLength:255',
        longDescription: 'required|string|minLength:2',
        bannerImageAlt: 'required|string|minLength:2|maxLength:255',
        slug: 'required|string|minLength:2|maxLength:255',
        metaTitle: 'string|minLength:2|maxLength:255',
        metaDescription: 'string|minLength:3|maxLength:255',
        specialityName: 'required|string|minLength:2|maxLength:255',
        overviewImageAlt: 'required|string|minLength:2|maxLength:255',
        overviewDescription: 'required|string|minLength:2',
        checked: 'required|boolean'
    },
    proceduresData: {
        title: 'required|string|minLength:2|maxLength:255',
        overviewTitle: 'required|string|minLength:2|maxLength:255',
        overviewDescription: 'required|string|minLength:3',
        speciality: 'required|string|minLength:3|maxLength:255',
        slug: 'required|string|minLength:3|maxLength:255',
        overviewImageAlt: 'required|string|minLength:2|maxLength:255',
        metaTitle: 'string|minLength:2|maxLength:255',
        metaDescription: 'string|minLength:3|maxLength:255',
        formBackgroundImageAlt: 'required|string|minLength:2|maxLength:255',
        checked: 'required|boolean'
    },
    procedureGroupBannerData: {
        bannerImagePosition: 'required|string|min:1|max:99|minLength:1|maxLength:2',
        bannerImageAlt: 'required|string|minLength:2|maxLength:255',
    },
    procedureMiscData: {
        miscTitle: 'required|string|minLength:2|maxLength:255',
        miscImageAlt: 'required|string|minLength:2|maxLength:255',
        miscDescription: 'required|string|minLength:2',
    },
    formBackgroundImage: {
        data: 'mime:jpg,jpeg,png|size:2mb,5kb|dimensions:minWidth=1600,minHeight=400,maxWidth=1600,maxHeight=400'
    },
    headersData: {
        sectionTitle: 'required|string|minLength:2|maxLength:255',
        description: 'required|string|maxLength:255',
        customScriptHead: 'required|string|minLength:2|maxLength:255',
        customScriptBody: 'required|string|minLength:2|minLength:3|maxLength:255',
    },
    headersGroupData: {
        topHeaderTitle: 'required|string|maxLength:255',
        topHeaderURL: 'required|string|maxLength:255',
    },
    emergencyContact: {
        data: 'mime:jpg,jpeg,png|size:2mb,1kb|dimensions:minWidth=500,minHeight=200,maxWidth=750,maxHeight=600'
    },
    footersData: {
        copyright: 'required|string|minLength:2|maxLength:255',
        customScript: 'required|string|minLength:2|minLength:3|maxLength:255',
    },
    sectionGroup: {
        sectionTitle: 'required|string|minLength:2|maxLength:255',
        description: 'required|string|minLength:2',
    },
    contactUsData: {
        title: 'required|string|minLength:2|maxLength:255',
        bannerImageAlt: 'required|string|minLength:2|maxLength:255',
        subTitle: 'required|string|minLength:2|maxLength:255',
        slug: 'required|string|minLength:3|maxLength:255',
        overviewTitle: 'required|string|minLength:2|maxLength:255',
        overviewDescription: 'required|string|minLength:3',
        metaTitle: 'string|minLength:2|maxLength:255',
        metaDescription: 'string|minLength:3|maxLength:255'
    },
    contactBannerImage: {
        data : 'mime:jpg,jpeg,png|size:2mb,5kb|dimensions:minWidth=500,minHeight=200,maxWidth=700,maxHeight=500'
    },
    contactMobileImage: {
        data : 'mime:jpg,jpeg,png|size:2mb,5kb|dimensions:minWidth=500,minHeight=200,maxWidth=700,maxHeight=500'
    },
    staticPagesData: {
        title: 'required|string|minLength:2|maxLength:255',
        bannerImageAlt: 'required|string|minLength:2|maxLength:255',
        slug: 'required|string|minLength:3|maxLength:255',
        metaTitle: 'string|minLength:2|maxLength:255',
        metaDescription: 'string|minLength:3|maxLength:255',
        description: 'required|string|minLength:2'
    },
    staticPagesBannerImage: {
        data : 'mime:jpg,jpeg,png|size:5mb,1kb|dimensions:minWidth=1600,minHeight=400,maxWidth=1600,maxHeight=400'
    },
    staticPagesMobileImage: {
        data : 'mime:jpg,jpeg,png|size:2mb,5kb|dimensions:minWidth=500,minHeight=200,maxWidth=700,maxHeight=500'
    },
    faqData: {
        title: 'required|string|minLength:2|maxLength:255',
        description: 'string|minLength:3'
    },
    sliderData: {
        title: 'required|string|minLength:2|maxLength:255',
    },
    brandData: {
        brandName: 'required|string|minLength:2|maxLength:255',
        brandLogoAlt: 'required|string|minLength:2|maxLength:255',
        brandImageAlt: 'required|string|minLength:2|maxLength:255',
    },
    brandLogo: {
        data : 'mime:jpg,jpeg,png|size:5mb,1kb'
    },
    brandImage: {
        data : 'mime:jpg,jpeg,png|size:5mb,1kb'
    },
    bannerData: {
        bannerTitle: 'string|minLength:2|maxLength:255',
        slider: 'required|string|minLength:2|maxLength:255',
        bannerImageAlt: 'required|string|minLength:2|maxLength:255',
        //position: 'required|string|minLength:1|maxLength:255|min:1',
        status: 'required|boolean'
    },
    // categoryData: {
    //     categoryName: 'required|string|minLength:2|maxLength:255',
    //     visibility: 'required|boolean',
    //     inMenu: 'required|boolean',
    //     shortDescription: 'required|string|minLength:2',
    //     title2: 'required|string|minLength:2|maxLength:255',
    //     description2: 'required|string|minLength:2',
    //     title3: 'required|string|minLength:2|maxLength:255',
    //     description3: 'required|string|minLength:2',
    //     metaTitle: 'string|minLength:2|maxLength:255',
    //     metaDescription: 'string|minLength:2',
    //     metaKeyword: 'string|minLength:2|maxLength:255',
    //     thumbnailImageAlt: 'required|string|minLength:2|maxLength:255',
    //     bannerTitle: 'required|string|minLength:2|maxLength:255',
    //     brandLogo: 'required|string|minLength:2|maxLength:255',
    //     slider: 'required|string|minLength:2|maxLength:255',
    //     slug: 'required|string|minLength:2|maxLength:255',
    //     sliderTitle:'required|string|minLength:2|maxLength:255',
    //     iconAlt:'required|string|minLength:2|maxLength:255',
    // },
    thumbnailImage: {
        data : 'mime:jpg,jpeg,png|size:5mb,1kb'
    },
    mobileThumbnailImage: {
        data : 'mime:jpg,jpeg,png|size:5mb,1kb'
    },
    recognitionsData: {
        iconTitle: 'required|string|minLength:2|maxLength:255',
        iconAlt: 'required|string|minLength:2|maxLength:255',
    },
    icon: {
        data : 'mime:jpg,jpeg,png|size:5mb,1kb'
    },
    productImage: {
        data : 'mime:jpg,jpeg,png|size:5mb,1kb'
    },
    clusterIcon: {
        data : 'mime:jpg,jpeg,png|size:5mb,1kb'
    },
    innovationsData: {
        title: 'required|string|minLength:2|maxLength:255',
        name: 'required|string|minLength:2|maxLength:255',
        imageAlt: 'required|string|minLength:2|maxLength:255',
        slug: 'required|string|minLength:3|maxLength:255',
        videoLink: 'required|string|minLength:3|maxLength:255',
        buttonLink: 'required|string|minLength:3|maxLength:255',
        metaTitle: 'string|minLength:2|maxLength:255',
        metaDescription: 'string|minLength:3',
        logoImageAlt: 'string|minLength:3|maxLength:255',
        description: 'string|minLength:3',
        buttonTitle: 'string|minLength:3|maxLength:255',
    },
    innovationsGroupData: {
        innovationsTitle: 'required|string|minLength:2|maxLength:255',
        innovationsLogoAlt: 'required|string|minLength:2|maxLength:255',
        innovationsDescription: 'required|string|minLength:2',
    },
    innovationsLogo: {
        data : 'mime:jpg,jpeg,png|size:5mb,1kb'
    },
    innovationsAttributeGroupData: {
        innovationsAttributeTitle: 'required|string|minLength:2|maxLength:255',
        innovationsAttributeImageAlt: 'required|string|minLength:2|maxLength:255',
    },
    innovationsAttributeImage: {
        data : 'mime:jpg,jpeg,png|size:5mb,1kb'
    },
    innovationsGeneralData: {
        title: "required|string|minLength:2|maxLength:255",
        // imageAlt: "required|string|minLength:2|maxLength:255",
        metaTitle: "string|minLength:2|maxLength:255",
        metaDescription: "string|minLength:3|maxLength:255",
        slug: 'required|string|minLength:3|maxLength:255',
        description: 'required|string|minLength:3',
        slider: 'required|string|minLength:2',
    },
    coursesData: {
        title: 'required|string|minLength:2|maxLength:255',
        coursesImageAlt: 'required|string|minLength:2|maxLength:255',
        description: 'string|minLength:3'
    },
    coursesImage: {
        data : 'mime:jpg,jpeg,png|size:5mb,1kb|dimensions:minWidth=370,minHeight=280,maxWidth=370,maxHeight=280'
    },
    arData: {
        title: 'required|string|minLength:2|maxLength:255',
        subTitle: 'required|string|minLength:2|maxLength:255',
        arBannerImageAlt: 'required|string|minLength:2|maxLength:255',
        description: 'required|string|minLength:2',
        descriptionImageAlt: 'required|string|minLength:2|maxLength:255',
        slug: 'required|string|minLength:3|maxLength:255',
        metaTitle: 'string|minLength:2|maxLength:255',
        metaDescription: 'string|minLength:3|maxLength:255'
    },
    arBannerImage: {
        data : 'mime:jpg,jpeg,png|size:5mb,1kb|dimensions:minWidth=1600,minHeight=400,maxWidth=1600,maxHeight=400'
    },
    arMobileBannerImage: {
        data : 'mime:jpg,jpeg,png|size:2mb,1kb|dimensions:minWidth=350,minHeight=400,maxWidth=550,maxHeight=700'
    },
    descriptionImage: {
        data : 'mime:jpg,jpeg,png|size:5mb,1kb|dimensions:minWidth=472,minHeight=412,maxWidth=472,maxHeight=412'
    },
    blogsGeneralData: {
        title: "required|string|minLength:2|maxLength:255",
        blogsGeneralImageAlt: "required|string|minLength:2|maxLength:255",
        metaTitle: "string|minLength:2|maxLength:255",
        metaDescription: "string|minLength:3|maxLength:255",
        description: "required|string|minLength:3",
        slug: 'required|string|minLength:3|maxLength:255'
    },
    blogsGeneralBannerImage: {
        data : 'mime:jpg,jpeg,png|size:5mb,1kb'
    },
    blogsGeneralMobileImage: {
        data : 'mime:jpg,jpeg,png|size:5mb,1kb'
    },
    blogsData: {
        title: 'required|string|minLength:2|maxLength:255',
        description: 'required|string|minLength:2',
        // doctorName: 'required|string|minLength:2|maxLength:255',
        // blogsCategory: 'required|string|minLength:2|maxLength:255',
        slug: 'required|string|minLength:3|maxLength:255',
        blogsThumbnailImageAlt: 'required|string|minLength:2|maxLength:255',
        category: 'required|string|minLength:2|maxLength:255',
        date: 'required|string|minLength:2|maxLength:255',
        metaTitle: 'string|minLength:2|maxLength:255',
        metaDescription: 'string|minLength:3|maxLength:255',
        checked: 'required|boolean'
    },
    blogsThumbnailImage: {
        data : 'mime:jpg,jpeg,png|size:5mb,1kb'
    },
    blogsGroupBannerData: {
        blogsImageAlt: 'required|string|minLength:2|maxLength:255',
    },
    blogsBannerImage: {
        data : 'mime:jpg,jpeg,png|size:5mb,1kb'
    },
    blogsMobileImage: {
        data : 'mime:jpg,jpeg,png|size:5mb,1kb'
    },
    blogsCategoryData: {
        title: 'required|string|minLength:2|maxLength:255',
        slug: 'required|string|minLength:3|maxLength:255',
    },
    secondOpinionData: {
        title: 'required|string|minLength:2|maxLength:255',
        subTitle: 'required|string|minLength:2|maxLength:255',
        secondOpinionBannerImageAlt: 'required|string|minLength:2|maxLength:255',
        overviewTitle: 'required|string|minLength:2|maxLength:255',
        overviewImageAlt: 'required|string|minLength:2|maxLength:255',
        overviewDescription: 'required|string|minLength:3|maxLength:255',
        opinionTitle: 'required|string|minLength:2|maxLength:255',
        opinionIconAlt: 'required|string|minLength:2|maxLength:255',
        slug: 'required|string|minLength:3|maxLength:255',
        speciality: 'required|string|minLength:3|maxLength:255',
        patientStories: 'required|string|minLength:3|maxLength:255',
        miscTitle: 'required|string|minLength:2|maxLength:255',
        miscImageAlt: 'required|string|minLength:2|maxLength:255',
        miscDescription: 'required|string|minLength:3|maxLength:255',
        formBackgroundImageAlt: 'required|string|minLength:3|maxLength:255',
        metaTitle: 'string|minLength:2|maxLength:255',
        metaDescription: 'string|minLength:3|maxLength:255'
    },
    secondOpinionBannerImage: {
        data : 'mime:jpg,jpeg,png|size:2mb,1kb|dimensions:minWidth=500,minHeight=200,maxWidth=700,maxHeight=500'
    },
    secondOpinionMobileImage: {
        data : 'mime:jpg,jpeg,png|size:2mb,1kb|dimensions:minWidth=500,minHeight=200,maxWidth=700,maxHeight=500'
    },
    opinionIcon: {
        data : 'mime:jpg,jpeg,png|size:2mb,1kb|dimensions:minWidth=500,minHeight=200,maxWidth=700,maxHeight=500'
    },
    miscImage: {
        data : 'mime:jpg,jpeg,png|size:2mb,1kb|dimensions:minWidth=500,minHeight=200,maxWidth=700,maxHeight=500'
    },
    overviewGroupData: {
        overviewTitle: 'required|string|minLength:2|maxLength:255',
        // overviewSubTitle: 'required|string|minLength:2|maxLength:255',
        overviewDescription: 'required|string|minLength:3',
    },
    aboutUsData: {
        title: 'required|string|minLength:2|maxLength:255',
        subTitle: 'required|string|minLength:2|maxLength:255',
        aboutUsBannerImageAlt: 'required|string|minLength:2|maxLength:255',
        slug: 'required|string|minLength:3|maxLength:255',
        hospitalName: 'required|string|minLength:3|maxLength:255',
        miscImageAlt: 'required|string|minLength:3|maxLength:255',
        miscDescription: 'required|string|minLength:3',
        aboutUsDescription: 'required|string|minLength:3',
        founderName: 'required|string|minLength:2|maxLength:255',
        founderDesignation: 'required|string|minLength:2|maxLength:255',
        // videoTitle: 'required|string|minLength:3|maxLength:255',
        // videoSubTitle: 'required|string|minLength:3|maxLength:255',
        metaTitle: 'string|minLength:2|maxLength:255',
        metaDescription: 'string|minLength:3|maxLength:255',
        founderSignImageAlt: 'required|string|minLength:2|maxLength:255'
    },
    aboutUsBannerImage: {
        data : 'mime:jpg,jpeg,png|size:5mb,1kb|dimensions:minWidth=1600,minHeight=400,maxWidth=1600,maxHeight=400'
    },
    aboutUsMobileImage: {
        data : 'mime:jpg,jpeg,png|size:5mb,1kb|dimensions:minWidth=472,minHeight=412,maxWidth=472,maxHeight=412'
    },
    aboutusMiscImage: {
        data : 'mime:jpg,jpeg,png|size:5mb,1kb|dimensions:minWidth=370,minHeight=400,maxWidth=370,maxHeight=400'
    },
    founderSignImage: {
        data : 'mime:jpg,jpeg,png|size:5mb,1kb|dimensions:minWidth=88,minHeight=83,maxWidth=88,maxHeight=83'
    },
    overviewIcon: {
        data : 'mime:jpg,jpeg,png|size:5mb,1kb|dimensions:minWidth=88,minHeight=83,maxWidth=88,maxHeight=83'
    },
    aboutUsVideo: {
        data : 'mime:mp4|size:10mb'
    },
    partnerIcon: {
        data : 'mime:jpg,jpeg,png|size:5mb,1kb|dimensions:minWidth=153,minHeight=53,maxWidth=153,maxHeight=53'
    },
    doctorBytesData: {
        title: 'required|string|minLength:2|maxLength:255',
        doctorBytesVideoThumbnailAlt: 'required|string|minLength:2|maxLength:255',
        doctorDescription: 'required|string|minLength:2|maxLength:255',
        doctorName: 'required|string|minLength:1|maxLength:255',
        publishedByImageAlt: 'required|string|minLength:2|maxLength:255',
        bannerImageAlt: 'required|string|minLength:2|maxLength:255',
        doctorBytesVideo: 'required|string|minLength:2',
    },
    doctorBytesBannerImage: {
        data : 'mime:jpg,jpeg,png|size:5mb,1kb'
    },
    doctorBytesVideo: {
        data : 'mime:mp4|size:10mb'
    },
    publishedByImage: {
        data : 'mime:jpg,jpeg,png|size:2mb,1kb|dimensions:minWidth=500,minHeight=200,maxWidth=700,maxHeight=500'
    },
    doctorBytesVideoThumbnail: {
        data : 'mime:jpg,jpeg,png|size:5mb,1kb'
    },
    doctorBytesGeneralData: {
        title: "required|string|minLength:2|maxLength:255",
        imageAlt: "required|string|minLength:2|maxLength:255",
        metaTitle: "string|minLength:2|maxLength:255",
        metaDescription: "string|minLength:3|maxLength:255",
        description: "required|string|minLength:3",
        slug: 'required|string|minLength:3|maxLength:255'
    },
    motherChildData: {
        title: 'required|string|minLength:2|maxLength:255',
        motherChildBannerImageAlt: 'required|string|minLength:2|maxLength:255',
        description: 'required|string|minLength:2|maxLength:255',
        overviewTitle: 'required|string|minLength:2|maxLength:255',
        overviewSubTitle: 'required|string|minLength:3|maxLength:255',
        overviewDescription: 'required|string|minLength:3|maxLength:255',
        overviewImageAlt: 'required|string|minLength:3|maxLength:255',
        slug: 'required|string|minLength:3|maxLength:255',
        metaTitle: 'required|string|minLength:2|maxLength:255',
        metaDescription: 'required|string|minLength:3|maxLength:255',
        miscTitle: 'required|string|minLength:2|maxLength:255',
        miscDescription: 'required|string|minLength:2|maxLength:255',
        sectionTitle: 'required|string|minLength:2|maxLength:255',
        sectionSubTitle: 'required|string|minLength:2|maxLength:255',
        virtualTourLink: 'required|string|minLength:2|maxLength:255',
        mapLink: 'required|string|minLength:2|maxLength:255'
    },
    deliveryGroupData: {
        deliveryTitle: 'required|string|minLength:2|maxLength:255',
        deliverySubTitle: 'required|string|minLength:2|maxLength:255',
        noOfSessions: 'required|string|minLength:1|maxLength:2',
        deliveryDescription: 'required|string|minLength:2|maxLength:255'
    },
    roomGroupData: {
        roomTitle: 'required|string|minLength:2|maxLength:255',
        roomImageAlt: 'required|string|minLength:2|maxLength:255',
    },
    wellnessProgramGroupData: {
        wellnessTitle: 'required|string|minLength:2|maxLength:255',
        wellnessSubTitle: 'required|string|minLength:2|maxLength:255',
        wellnessDescription: 'required|string|minLength:2|maxLength:255'
    },
    whyChooseGroupData: {
        whyChooseTitle: 'required|string|minLength:2|maxLength:255',
        whyChooseImageAlt: 'required|string|minLength:2|maxLength:255',
        whyChooseDescription: 'required|string|minLength:2|maxLength:255'
    },
    roomImage: {
        data : 'mime:jpg,jpeg,png|size:2mb,1kb|dimensions:minWidth=500,minHeight=200,maxWidth=700,maxHeight=500'
    },
    wellnessIcon: {
        data : 'mime:jpg,jpeg,png|size:2mb,1kb|dimensions:minWidth=500,minHeight=200,maxWidth=700,maxHeight=500'
    },
    motherChildBannerImage: {
        data : 'mime:jpg,jpeg,png|size:2mb,1kb|dimensions:minWidth=500,minHeight=200,maxWidth=700,maxHeight=500'
    },
    motherChildMobileImage: {
        data : 'mime:jpg,jpeg,png|size:2mb,1kb|dimensions:minWidth=500,minHeight=200,maxWidth=700,maxHeight=500'
    },
    insuranceData: {
        title: 'required|string|minLength:2|maxLength:255',
        insuranceImageAlt: 'required|string|minLength:2|maxLength:255',
    },
    insuranceImage: {
        data: 'mime:jpg,jpeg,png|size:5mb,1kb|dimensions:minWidth=192,minHeight=64,maxWidth=192,maxHeight=64'
    },
    careersData: {
        title: 'required|string|minLength:2|maxLength:255',
        description: 'required|string|minLength:2',
       
        experience: 'required|string',
       
    },
    careersGeneralData: {
        title: "required|string|minLength:2|maxLength:255",
        welcomeImageAlt: "required|string|minLength:2|maxLength:255",
        welcomeDescription: "required|string|minLength:3",
        ourValuesDescription: "required|string|minLength:3",
        testimonialDescription: "required|string|minLength:3",
        metaTitle: "string|minLength:2|maxLength:255",
        metaDescription: "string|minLength:3|maxLength:255",
        slug: 'required|string|minLength:3|maxLength:255'
    },
    welcomeImage: {
        data : 'mime:jpg,jpeg,png|size:5mb,1kb|dimensions:minWidth=472,minHeight=412,maxWidth=472,maxHeight=412'
    },
    ihpData: {
        title: 'required|string|minLength:2|maxLength:255',
        description: 'required|string|minLength:2',
        price: 'required|string|min:1|minLength:2|maxLength:255',
        ihpCallImageAlt: 'required|string|minLength:2|maxLength:255',
    },
    ihpCallImage: {
        data: 'mime:jpg,jpeg,png|size:5mb,1kb'
    },
    packageGroupData: {
        speciality: 'required|string|minLength:2|maxLength:255',
        cost: 'required|string|min:1|max:999999|minLength:1|maxLength:7',
        country: 'required|string|minLength:2|maxLength:255'
    },
    internationalPatientData: {
        title: 'required|string|minLength:2|maxLength:255',
        subTitle: 'required|string|minLength:2|maxLength:255',
        internationalPatientBannerImageAlt: 'required|string|minLength:2|maxLength:255',
        slug: 'required|string|minLength:3|maxLength:255',
        metaTitle: 'string|minLength:2|maxLength:255',
        metaDescription: 'string|minLength:3|maxLength:255',
        homeDescription: 'required|string|minLength:3',
        // planTreatmentButtonName: 'required|string|minLength:2|maxLength:255',
        // planTreatmentButtonLink: 'required|string|minLength:2|maxLength:255',
        // ipFormBackgroundAlt: 'required|string|minLength:2|maxLength:255',
    },
    treatmentGroupData: {
        treatmentTitle: 'required|string|minLength:2|maxLength:255',
        treatmentIconAlt: 'required|string|minLength:2|maxLength:255',
        treatmentDescription: 'required|string|minLength:2|maxLength:255',
        treatmentLinkName: 'required|string|minLength:2|maxLength:255',
        treatmentLinkURL: 'required|string|minLength:2|maxLength:255',
    },
    treatmentIcon: {
        data : 'mime:jpg,jpeg,png|size:5mb,1kb|dimensions:minWidth=51,minHeight=50,maxWidth=51,maxHeight=50'
    },
    specialityTreatmentGroupData: {
        treatmentTitle: 'required|string|minLength:2|maxLength:255',
        treatmentIconAlt: 'required|string|minLength:2|maxLength:255',
        treatmentDescription: 'required|string|minLength:2|maxLength:255',
    },
    specialityTreatmentIcon: {
        data : 'mime:jpg,jpeg,png|size:5mb,1kb|dimensions:minWidth=80,minHeight=80,maxWidth=80,maxHeight=80'
    },
    ipFormBackground: {
        data : 'mime:jpg,jpeg,png|size:2mb,1kb|dimensions:minWidth=500,minHeight=200,maxWidth=700,maxHeight=500'
    },
    internationPatientBannerImage: {
        data : 'mime:jpg,jpeg,png|size:2mb,1kb|dimensions:minWidth=1600,minHeight=400,maxWidth=1600,maxHeight=400'
    },
    internationPatientMobileImage: {
        data : 'mime:jpg,jpeg,png|size:2mb,1kb|dimensions:minWidth=500,minHeight=200,maxWidth=700,maxHeight=500'
    },
    newsGeneralData: {
        title: "required|string|minLength:2|maxLength:255",
        imageAlt: "required|string|minLength:2|maxLength:255",
        metaTitle: "string|minLength:2|maxLength:255",
        metaDescription: "string|minLength:3|maxLength:255",
        slug: 'required|string|minLength:3|maxLength:255',
        description: 'required|string|minLength:3',
    },
    newsData: {
        title: "required|string|minLength:2|maxLength:255",
        newsImageAlt: "required|string|minLength:2|maxLength:255",
        // branch: "required|string|minLength:2|maxLength:255",
        category: "required|string|minLength:3|maxLength:255",
        description: 'required|string|minLength:3|maxLength:255',
        date: 'required|string|minLength:3|maxLength:255',
        type: 'required|string|minLength:3|maxLength:255',
        // checked: 'required|boolean'
    },
    newsImage: {
        data : 'mime:jpg,jpeg,png|size:5mb,1kb|dimensions:minWidth=570,minHeight=414,maxWidth=570,maxHeight=414'
    },
    pdfData: {
        data : 'mime:pdf|size:10mb,1kb'
    },
    newsDataLink: {link: "required|string|minLength:2|maxLength:255"},
    whychoose_usData: {
        title: "required|string|minLength:2|maxLength:255",
        quotetitle: "required|string|minLength:2|maxLength:255",
        description: 'required|string|minLength:1',
        whychoose_usBannerImageAlt:  "required|string|minLength:2|maxLength:255",
        whyChooseUsStatsDescription: "required|string|minLength:1"
    },
    chooseGroupData: {
        treatmentIconAlt: "required|string|minLength:2|maxLength:255",
    },
    techData: {
        techTitle: 'required|string|minLength:3|maxLength:255',
        techBannerImageAlt: 'required|string|minLength:3|maxLength:255',
        techDesc: 'required|string|minLength:3',
        slug: 'required|string|minLength:3|maxLength:255',
    },
    techBannerImage: {
        data : 'mime:jpg,jpeg,png|size:5mb,1kb|dimensions:minWidth=160,minHeight=40,maxWidth=1600,maxHeight=400'
    },
    techImage: {
        data : 'mime:jpg,jpeg,png|size:5mb,1kb|dimensions:minWidth=369,minHeight=219,maxWidth=740,maxHeight=440'
    },
    galleryData: {
        galleryImageTag: 'required|string|minLength:3|maxLength:255',
        slug: 'required|string|minLength:3|maxLength:255',
    },
    galleryImage: {
        data : 'mime:jpg,jpeg,png|size:5mb,1kb|dimensions:minWidth=370,minHeight=250,maxWidth=370,maxHeight=250'
    },
    galleryGeneralData: {
        title: "required|string|minLength:2|maxLength:255",
        imageAlt: "required|string|minLength:2|maxLength:255",
        metaTitle: "string|minLength:2|maxLength:255",
        metaDescription: "string|minLength:3|maxLength:255",
        description: "required|string|minLength:3",
        slug: 'required|string|minLength:3|maxLength:255'
    },
    websiteLogo: {
        data : 'mime:jpg,jpeg,png|size:5mb,1kb|dimensions:minWidth=164,minHeight=44,maxWidth=164,maxHeight=44'
    },
    homepageVideoThumbnail: {
        data : 'mime:jpg,jpeg,png|size:5mb,1kb|dimensions:minWidth=1600,minHeight=671,maxWidth=1600,maxHeight=671'
    },
    homepageVideo: {
        data: 'mime:mp4|size:10mb'
    },
    awardsData: {
        title: 'required|string|minLength:2|maxLength:255',
        subTitle: 'required|string|minLength:2|maxLength:255',
        awardsBannerImageAlt: 'required|string|minLength:2|maxLength:255',
        slug: 'required|string|minLength:3|maxLength:255',
        awardsDescription: 'required|string|minLength:3',
    },
    awardsBannerImage: {
        data : 'mime:jpg,jpeg,png|size:5mb,1kb|dimensions:minWidth=1600,minHeight=400,maxWidth=1600,maxHeight=400'
    },
    awardsMobileImage: {
        data : 'mime:jpg,jpeg,png|size:5mb,1kb|dimensions:minWidth=500,minHeight=200,maxWidth=500,maxHeight=700'
    },
    certificateImage: {
        data : 'mime:jpg,jpeg,png|size:5mb,1kb|dimensions:minWidth=370,minHeight=260,maxWidth=370,maxHeight=260'
    },
    sliderImage: {
        data : 'mime:jpg,jpeg,png|size:5mb,1kb|dimensions:minWidth=770,minHeight=399,maxWidth=770,maxHeight=399'
    },
    awardsSliderData: {
        sliderTitle: 'required|string|minLength:2|maxLength:255',
        sliderDescription: 'required|string|minLength:3',
    },
    certificatesData: {
        certificateTitle: 'required|string|minLength:2|maxLength:255'
    },
    subscriberEmailData: {
        email: 'required|email|minLength:5|maxLength:100'
    }
};