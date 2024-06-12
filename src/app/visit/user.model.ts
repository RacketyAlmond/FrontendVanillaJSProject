import { Role } from './role.model';
import { Visit } from './visit.model';

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  roles: Role[];
  visits: Visit[];
}
