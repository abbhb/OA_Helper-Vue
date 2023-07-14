let timer = null;
let second = 0;
let neiji = 0;
let minute = 0;
let hour = 0;
let nowtime = '';
const complZero = (n) => {
    return n < 10 ? `0${n}` : `${n}`;
};


// eslint-disable-next-line no-restricted-globals
addEventListener('message', (e) => {
    const {data} = e;
    console.log(data);
    if (data === '开启') {
        timer = setInterval(() => {
            second += 1;
            neiji += 1;
            if (neiji === 30) {
                neiji = 0;
                postMessage('A');
            }
            if (second >= 60) {
                second = 0;
                minute += 1;
            }

            if (minute >= 60) {
                minute = 0;
                hour += 1;
            }
            nowtime = `${complZero(hour)}:${complZero(
                minute
            )}:${complZero(second)}`;
            postMessage(nowtime);
        }, 1000);

    }
});
