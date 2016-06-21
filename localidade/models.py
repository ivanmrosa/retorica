from django.db import models

# Create your models here.
class Pais(models.Model):
    nome = models.CharField(verbose_name="Nome", max_length=100)

    class Meta:
        db_table = "Pais"
        verbose_name = "País"
        verbose_name_plural = "Países"

    def __str__(self):
        return self.nome

class Estado(models.Model):
    pais = models.ForeignKey(verbose_name="País", to=Pais)
    nome = models.CharField(verbose_name="Nome", max_length=100)


    class Meta:
        db_table = "Estado"
        verbose_name = "Estado"
        verbose_name_plural = "Estados"

    def __str__(self):
        return self.nome

class Cidade(models.Model):
    pais = models.ForeignKey(verbose_name="País", to=Pais)
    estado = models.ForeignKey(verbose_name="Estado", to=Estado, null=True, blank=True)
    nome = models.CharField(verbose_name="Nome", max_length=200)

    class Meta:
        db_table = "Cidade"
        verbose_name = "Cidade"
        verbose_name_plural = "Cidades"

    def __str__(self):
        return self.nome

