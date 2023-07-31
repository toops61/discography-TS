export class NewDisc {
    [key:string]:string|boolean;

    constructor (
      public artist:'',
      public album:'',
      public year:'',
      public genre:'Folk Rock',
      public format:'cd',
      public cover:'',
      public digipack:false
    ) {}
}
