from django.contrib import admin
from .models import CarMake, CarModel

class CarModelInline(admin.TabularInline):
    model = CarModel

class CarMakeAdmin(admin.ModelAdmin):
    inlines = [CarModelInline]

class CarModelAdmin(admin.ModelAdmin):
    list_display = ['name', 'type', 'year', 'dealer_id']
    list_filter = ['type', 'year']
    search_fields = ['name', 'car_make__name']

admin.site.register(CarMake, CarMakeAdmin)
admin.site.register(CarModel, CarModelAdmin)
