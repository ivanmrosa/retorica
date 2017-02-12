usuario = {
   ir_cadastro: function(id_cadastro){
      mainLib.find('#form_signup > section').adCl('hide');
      mainLib.find('#' + id_cadastro).rmCl('hide');
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
       if(!mainLib.canUploadFile){
         mainLib.aviso('Seu navegador não aceita uploads de arquivos.');
         return false;
       };
       mainLib.wait.start();
       url = url||'/cadastrar_usuario';
       selector = selector||'#form_signup';
       var params = new FormData(mainLib.find(selector).first());
       mainLib.server.post(url, params,
          function(response){
            mainLib.wait.stop();
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
              }else{

                mainLib.server.get('/obter_usuario', '', function(data){
                  mainLib.dataBinder.removeReplicatedModel('dados_perfil_usuario');
                  mainLib.dataBinder.removeReplicatedModel('edicao_usuario');
                  mainLib.dataBinder.bindOnTemplate('dados_perfil_usuario', data);
                  mainLib.dataBinder.bindOnTemplate('edicao_usuario', data);
                })
              }
            }
          },
          function(data){
            document.write(data);
            document.close();
          }
       );
   },
   recuperar_senha: function(){
      var usuario = mainLib.find('#usuario-recuperacao').first().value;
      if(usuario.trim() == ""){
        mainLib.aviso('Informe um usuário.');
        return false;
      }else{
        mainLib.wait.start();
        mainLib.server.post('recuperar_senha', 'usuario='+usuario, function(data){
              mainLib.wait.stop();
              data = JSON.parse(data);
              mainLib.aviso(data["msg"]);
              mainLib.find('#usuario-recuperacao').first().value = "";
              mainLib.popup.closePopup('recuperar_senha');
            },
            function(data){
              document.write(data);
              document.close();
            }
        );
      };
   }
}
