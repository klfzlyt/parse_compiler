import lexier from '../../Lexical/lexier.js';
import Parse from '../parse.js';
import codeGenerator from '../../CodeGeneration/index.js';
import traverser from '../../Traverser/traverser.js';
let tokens = [];

let code = `
    def fds(int a,int b){
        return a+b
    }

    int afew = (fds 2 3);
    while(true){
        int w = 0;
        int f = w + 3;
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
/*

*/
let code1 = `
// fewfew
int fe11231 = fz?1+1:2;
float wefwfw=223.33 + 32.1, z=33.1;
char f = ~o~;
int f=3,z,v;
fewfew= 322 + 3232111;
//fewfewvcxvx
f = 5+4;
z = 3>2+44+ff;
v = f * (3 +3);
vvv = ~lyt~;
//fewfewfew
int zzz;
zzz = invoke(fwefw,v,3,~fewfewfw~,3+ffff);
/*fewfewfw
*/
char wewe;
wewe = invoke(log,2);
def fds(int a,int b){
    int f=3,z,v;
    f = 5+4;
    z = 3>2+44+ff;
    v = f * 3;
}
    if(f * (3 +3 - 1) / 3 == 3){
        
    }

    if(aa+1){}
    else{}
    for(w=2;w<=10;w=w+1){
        int few=2;
        few = few+3;
    }
`;
let code2 = `
//定义log
int fcc=1;
fcc++;
int bfff= 2;
bfff/=2;
invoke(log,~bbb~,bfff);
                def logParam(int a){        
                       invoke(log,a);
                }
               
               def fw(int a){
                  
                   while(a){
                      a=a-1;
                      invoke(log,a);
                    }

                   int b= 2;
                  b/=2;
                  invoke(log,~bbb~,b);
               }
               
                //定义累加
                def accu(int begin,int end,int skip){
                    int accu= 0,a;
            
                    for(a=begin;a<=end;a++){
                        if(a == !skip ){
            
                        }
                        else{
                            accu = accu+a;     
                        }
                    }
                    return accu;
                }
                // 空格需要
                string a = ~i    Am   String~ ;
                int b = invoke(accu,0,50,0);
                invoke(log,a,b);
                invoke(logParam,123421212,a);
                //从0加到100，跳过10
                invoke(log,invoke(accu,0,100,10));
                invoke(log,invoke(fw,30))
`;
lexier(tokens, code2);
var parse = new Parse(tokens);
let ast = parse.parseScript();
traverser(ast, {
  CallExpression: {
    enter: function(node, parent) {
      // 改变ast
      // debugger
      // debugger
      if (node.callee == 'log') {
        // 把log变为console.log
        node.callee = `console.log`;
      }
    },
  },
  VariableDeclarator: {
    enter: function(node, parent) {
      // debugger
    },
  },
});
let newCode = codeGenerator(ast);
console.log(newCode);

console.log(ast);

console.log('------------运行结果--------------');
let compiler = new Function(newCode);
compiler();
window.compiler = code => {
  let tokens = [];
  lexier(tokens, code);
  let parse = new Parse(tokens);
  let ast = parse.parseScript();
  traverser(ast, {
    CallExpression: {
      enter: function(node, parent) {
        // 改变ast
        if (node.callee == 'log') {
          // 把log变为console.log
          node.callee = `console.log`;
        }
      },
    },
  });
  let newCode = codeGenerator(ast);
  let compiler = new Function(newCode);
  return compiler();
};
