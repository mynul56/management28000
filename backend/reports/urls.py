from django.urls import path
from .views import MonthlyReportView, ExportCSVView, ExportPDFView

urlpatterns = [
    path('monthly/', MonthlyReportView.as_view(), name='monthly-report'),
    path('export/csv/', ExportCSVView.as_view(), name='export-csv'),
    path('export/pdf/', ExportPDFView.as_view(), name='export-pdf'),
]
