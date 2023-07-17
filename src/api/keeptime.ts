import axios from "axios";

export interface AddClock30DTO {
    sign: string;
}

export interface ClockSelfEchartsVO {
    xtextList: string[];
    xvalueList: number[];
}

export interface ClockSelfDTO {
    isStandard: boolean;
    isSigned: boolean;
    why: string;
    monthTime: number;
    integrityDay: number;
    minOldTime: number;
    maxFirstTime: string;
    id: string;
    userId: string;
    date: string;
    firstTime: string;
    oldTime: number;
}

interface AdminDayData {
    name: string;
    studentId: string;
    date: Date;
    firstTime: Date;
    oldTime: number;
    isStandard: boolean;
    why: string;
}

export function addClock30(data: AddClock30DTO) {
    return axios.post<string>('/api/study_clock/add_clock_30', data);
}

export function getSelfClock() {
    return axios.get<ClockSelfDTO>('/api/study_clock/get_self_clock');
}

export function getSelfClockAll() {
    return axios.get<ClockSelfDTO>('/api/study_clock/get_self_clock_all');
}

export function getSelfClockEcharts() {
    return axios.get<ClockSelfEchartsVO>('/api/study_clock/get_self_clock_echarts');
}
