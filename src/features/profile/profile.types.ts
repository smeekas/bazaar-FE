// TODO: mirror the backend's `GET /profile` response shape.
export type Profile = {
  id: string;
  email: string;
  name: string;
  role: 'VENDOR';
};
