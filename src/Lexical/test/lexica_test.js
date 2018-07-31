import lexier from '../lexier.js';
import codeGenerator from '../../CodeGeneration/index.js';
let result = [];

let code = `
    def fds(int a,int b){
        return a+b
    }

    int afew = (fds 2 3);
    while(true){
        int w = 0;
        int f = w+3;
        float floated =  f + 3.332;
        if(f){
            //commenttt

        }
        else{
            /*fefwfew
            fewfwe
            */
            if(true){

            }
            int f =323232332;
            //few
            float few= 32/=3;
        }
        if(f<=-1){
            
        }
    }


`;

let code1 = `
def logParam(int a){        
    invoke(log,a);
}
`
lexier(result, code1);

console.log(result);
