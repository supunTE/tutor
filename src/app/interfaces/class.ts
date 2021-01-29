export interface ClassInterface {
    main:{
        className: string,
        teacherName: string,
        teacherID: string,
        subject: string,
        fee: boolean,
        lesson: string,
        category: string,
        batchYear: number,
        classMethod: number,
        otherDetails:string
    },    
    amount:{
        feeAmount: number,
        moneyunit: string,
    },
    duration:{
        duration: string,
        durationStart: Date,
        durationEnd: Date,
        classesPerWeek: number,
    },
    week:{
        weekData: any,
        mondayTime: string,
        tuesdayTime: string,
        wednesdayTime: string,
        thursdayTime: string,
        fridayTime: string,
        saturdayTime: string,
        sundayTime: string,
    }    
    // mondayData: boolean,
    // tuesdayData: boolean,
    // wednesdayData: boolean,
    // thursdayData: boolean,
    // fridayData: boolean,
    // saturdayData: boolean,
    // sundayData: boolean,
}

export interface ClassLinksInterface {  
    link: string,
    name: string,
    time: Date,
}

export interface ClassDocsInterface {  
    link: string,
    name: string,
    time: Date,
}