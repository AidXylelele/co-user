export class UserInstance {
    public email: string;
    public name: string;
    public password: string;
    public pending: any[];
    public resolved: any[];
    public rejected: any[];
    public balance: number;
  
    constructor(email: string, name: string, password: string) {
      this.email = email;
      this.name = name;
      this.password = password;
      this.pending = [];
      this.rejected = [];
      this.resolved = [];
      this.balance = 0;
    }
  }