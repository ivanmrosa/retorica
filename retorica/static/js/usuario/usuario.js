usuario = {
   ir_cadastro: function(id_cadastro){
      mainLib.find('#form_signin > section').adCl('hidde');
      mainLib.find('#' + id_cadastro).rmCl('hidde');
   }
}