const CONFIG_JSON = 'CONFIG';


const getConfig = () => {
    return localStorage.getItem(CONFIG_JSON);
};

const setConfig = (config: string) => {
    localStorage.setItem(CONFIG_JSON, config);
};

const deleteLocalMenu = () =>{
    const json = JSON.parse(getConfig());
    json.serverMenu = [];
    setConfig(JSON.stringify(json))
}
export {getConfig,setConfig,deleteLocalMenu}