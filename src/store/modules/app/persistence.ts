const CONFIG_JSON = 'CONFIG';

const getConfig = () => {
  return localStorage.getItem(CONFIG_JSON);
};

const setConfig = (config: string) => {
  localStorage.setItem(CONFIG_JSON, config);
};

const deleteLocalMenu = () => {
  localStorage.removeItem(CONFIG_JSON);
};
export { getConfig, setConfig, deleteLocalMenu };
