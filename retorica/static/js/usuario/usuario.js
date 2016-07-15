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
   }
}