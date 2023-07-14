import axios from "axios";

export interface AddClock30DTO {
    sign: string;
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

export function addClock30(data: AddClock30DTO) {
    return axios.post<string>('/api/study_clock/add_clock_30', data);
}

export function getSelfClock() {
    return axios.get<ClockSelfDTO>('/api/study_clock/get_self_clock');
}

export function getSelfClockAll() {
    return axios.get<ClockSelfDTO>('/api/study_clock/get_self_clock_all');
}
