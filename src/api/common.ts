import axios from "axios";

export default function getPublicKey() {
    return axios.get<string>('/api/common/get_public_key');
}