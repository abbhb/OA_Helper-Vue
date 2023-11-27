import { JSEncrypt } from 'jsencrypt';
import useServerConfigStore from '@/store/modules/server-config';

const encryptByPublicKey = (data: string) => {
  const encryptor = new JSEncrypt();
  const serverConfigStore = useServerConfigStore();
  encryptor.setPublicKey(serverConfigStore.getPublicKey); // publicKey为公钥
  return encryptor.encrypt(data);
};

export default { encryptByPublicKey };
