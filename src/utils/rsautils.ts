import {JSEncrypt} from 'jsencrypt';
import useRSAStore from "@/store/modules/rsa";

const encryptByPublicKey = (data: string) => {
    const encryptor = new JSEncrypt();
    const rsaState = useRSAStore();
    encryptor.setPublicKey(rsaState.getPublicKey); // publicKey为公钥
    return encryptor.encrypt(data);
};

export default {encryptByPublicKey};
