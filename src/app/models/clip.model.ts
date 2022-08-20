import firebase from "firebase/compat/app"

export default interface IClip{
    uid:string,
    displayName:string,
    title:string,
    fileName:string,
    docId?:string,
    url:string,
    screenshotUrl:string,
    screenshotFileName:string,
    timestamp:firebase.firestore.FieldValue
}