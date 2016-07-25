from localidade.models import Pais, Estado, Cidade
from lib.main_lib import RenderView
import json

# Create your views here.
class LocalidadeController(RenderView):
    def __init__(self, **kwargs):
        self.parametros = kwargs

    def ObterCidades(self):
       if self.parametros['estado_id']:
           return json.dumps(list(Cidade.objects.filter(estado_id=self.parametros['estado_id']).values('id', 'nome')))
       else:
           return '[]'


    def ObterEstados(self):
        if self.parametros['pais_id']:
            return json.dumps(list(Estado.objects.filter(pais_id=self.parametros['pais_id']).values('id', 'nome')))
        else:
            return '[]'

    def ObterPaises(self):
        return json.dumps(list(Pais.objects.all().values('id', 'nome')))
