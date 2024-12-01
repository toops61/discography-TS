export class NewClassDisc {
    [key:string]:string|boolean|number|undefined;

    constructor (
      public artist:string,
      public artist_tri:string,
      public album:string,
      public year:number,
      public genre:string,
      public format:string,
      public cover:string,
      public digipack:boolean
    ) {}
}
