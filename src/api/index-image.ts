import axios from 'axios';

export interface IndexImage {
  id?: string;
  label?: string;
  image?: string;
  sort?: number;
  extra?: string;
}

export function queryIndexImageLabel() {
  return axios.get<string[]>('/api/index_image/all_label');
}

export function queryLabelIndexImage(params: { label: string }) {
  return axios.get<IndexImage[]>('/api/index_image/label_all', {params});
}

export function listIndexImage() {
  return axios.get<IndexImage[]>('/api/index_image/list');
}

export function addIndexImage(data: IndexImage) {
  return axios.post<string>('/api/index_image/add', data);
}

export function updateIndexImage(data: IndexImage) {
  return axios.put<string>('/api/index_image/update', data);
}

export function deleteIndexImage(id: string) {
  return axios.delete<string>('/api/index_image/delete', {
    params: {
      id,
    },
  });
}
