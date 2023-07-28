const getBrowser = (type) => {
    const ua = navigator.userAgent.toLowerCase();
    let s;
    let name = '';
    let ver = '0'; /* eslint-disable-next-line no-underscore-dangle */
    const _set = (bname, bver) => {
        name = bname;
        ver = bver;
    };
    const toFixedVersion = (veras) => {
        const vers = `${veras}`.replace(/_/g, '.');
        const floatLength = 1;
        const verss = String(vers).split('.');
        const versa = `${verss[0]}.${verss[1] || '0'}`;
        const verf = Number(versa).toFixed(floatLength);
        return verf;
    };
    // 探测浏览器
    if (ua.match(/msie ([\d.]+)/)) {
        s = ua.match(/msie ([\d.]+)/);
        _set('ie', toFixedVersion(s[1]));
    }
    if (ua.match(/firefox\/([\d.]+)/)) {
        s = ua.match(/firefox\/([\d.]+)/);
        _set('firefox', toFixedVersion(s[1]));
    }
    if (ua.match(/chrome\/([\d.]+)/)) {
        s = ua.match(/chrome\/([\d.]+)/);
        _set('chrome', toFixedVersion(s[1]));
    }
    if (ua.match(/opera.([\d.]+)/)) {
        s = ua.match(/opera.([\d.]+)/);
        _set('opera', toFixedVersion(s[1]));
    }
    if (ua.match(/version\/([\d.]+).*safari/)) {
        s = ua.match(/version\/([\d.]+).*safari/);
        _set('safari', toFixedVersion(s[1]));
    }
    if (type === 'n') {
        return name;
    }
    if (type === 'v') {
        return ver;
    }
    return name + ver;
};

export default function isT() {
    const name = getBrowser('n');
    const version = getBrowser('v');
    if (name.toLowerCase() === 'chrome' && version >= 87) {
        console.log('版本符合要求');
        return true;
    }
    if (name.toLowerCase() === 'firefox' && version >= 78) {
        console.log('版本符合要求');
        return true;
    }
    if (name.toLowerCase() === 'safari' && version >= 13) {
        console.log('版本符合要求');
        return true;
    }
    if (name.toLowerCase() === 'edge' && version >= 88) {
        console.log('版本符合要求');
        return true;
    }
    console.log('/* 建议更换浏览器！ */');
    return false;
}
