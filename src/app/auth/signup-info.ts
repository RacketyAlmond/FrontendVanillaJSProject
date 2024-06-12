export class SignupInfo {


  username: string;
  role: string[];
  email: string;
  password: string;

  constructor(username: string, email: string,  password: string) {
    this.username = username;
    this.role = ['user'];
    this.email = email;
    this.password = password;
  }
}
