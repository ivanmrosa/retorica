from django.shortcuts import render

# Create your views here.
def evento_index(request):
    return render(request=request, template_name='evento/evento_index.html', context={"TITULO":"Retórica - Eventos"})
