import { Observable, Timestamp } from 'rxjs';

export interface message{
    uid: string,
    classid: string,
    message: string,
    time: Date
}
