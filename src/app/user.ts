import {Rezervation} from "./rezervation";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  rezervations: Rezervation[];
  role: string;
}
