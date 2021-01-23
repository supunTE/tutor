export interface ClassInterface {  
    className: string,
    teacherName: string,
    teacherID: string,
    subject: string,
    fee: boolean,
    bookmarkedBy: any,
    lesson: string,
    category: string,
    batchYear: number,
    numberOfWeeks: number,
    classesPerWeek: number,
    mondayData: boolean,
    tuesdayData: boolean,
    wednesdayData: boolean,
    thursdayData: boolean,
    fridayData: boolean,
    saturdayData: boolean,
    sundayData: boolean,
    mondayTime: string,
    tuesdayTime: string,
    wednesdayTime: string,
    thursdayTime: string,
    fridayTime: string,
    saturdayTime: string,
    sundayTime: string,
    linkData: string,
    otherDetails:string
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