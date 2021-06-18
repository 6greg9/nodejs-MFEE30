
let Name ="Foorest";
class Shoes{
    constructor(brand, smell){
        this._brand=brand;
        this._smell=smell;
    }
    get Brand(){return this._brand}
    set Brand(brand){ this._brand = brand;}

    smellShoes(){console.log(this._brand+" smell "+this._smell);}
}
let Runner={
    
    Run: ()=>{console.log(Name+" Run");}    ,
    Shoes: Shoes
}
//Runner.Run();
//myshoes = new Runner.Shoes("NIKE", "stinky");
//myshoes.smellShoes();
module.exports=Runner;