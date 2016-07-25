usuario = {
   ir_cadastro: function(id_cadastro){
      mainLib.find('#form_signup > section').adCl('hidde');
      mainLib.find('#' + id_cadastro).rmCl('hidde');
   },
   logar: function(){
     mainLib.server.post('/login', mainLib.dataBinder.formParser('#form_login'),
        function(data){
          var result = JSON.parse(data);
          if(result["logged"] == "true"){
            window.location.href = '/evento';
          }else{
            mainLib.aviso(result["msg"]);
          }
        },
        function(data){
           mainLib.aviso('ocorreu um erro ao realizar login');
           return false;
        }
     )
   },
   cadastrar_usuario: function(url, selector, ir_cadastro, resetar){
       url = url||'/cadastrar_usuario';
       selector = selector||'#form_signup';
       var params = mainLib.dataBinder.formParser(selector);
       mainLib.server.post(url, params,
          function(response){
            var data = JSON.parse(response);
            if(data["ok"] == false){
               if(ir_cadastro){
                 usuario.ir_cadastro(ir_cadastro);
               };
               mainLib.aviso('Existem campos preenchidos incorretamente. Verifique as mensagens e corrija');
               mainLib.dataBinder.bindValidations(selector, JSON.parse(data["msg"]))
            }else if(data["ok"] == true){
              mainLib.aviso(data["msg"]);
              if(resetar){
                mainLib.find(selector).elements[0].reset();
              }
            }
          },
          function(data){
            document.write(data);
            document.close();
          }
       );
   }
}
