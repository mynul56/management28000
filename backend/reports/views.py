from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from transactions.models import Transaction
from datetime import date
from django.http import HttpResponse
import csv
import io
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

class MonthlyReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        month = request.query_params.get('month', date.today().month)
        year = request.query_params.get('year', date.today().year)
        
        transactions = Transaction.objects.filter(
            user=request.user,
            date__year=year,
            date__month=month
        )
        
        income = transactions.filter(type='income').aggregate(total=Sum('amount'))['total'] or 0.00
        expense = transactions.filter(type='expense').aggregate(total=Sum('amount'))['total'] or 0.00
        
        # Category breakdown
        category_breakdown = transactions.filter(type='expense').values(
            'category__name', 'category__color'
        ).annotate(total=Sum('amount'))
        
        return Response({
            'month': month,
            'year': year,
            'total_income': income,
            'total_expense': expense,
            'net_balance': income - expense,
            'expense_by_category': category_breakdown
        })

class ExportCSVView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="transactions.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['Date', 'Type', 'Category', 'Wallet', 'Amount', 'Note'])
        
        transactions = Transaction.objects.filter(user=request.user).order_by('-date')
        
        for tx in transactions:
            writer.writerow([
                tx.date, 
                tx.type, 
                tx.category.name if tx.category else '', 
                tx.wallet.name, 
                tx.amount, 
                tx.note
            ])
            
        return response

class ExportPDFView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        buffer = io.BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)
        p.drawString(100, 750, "Transaction Report")
        
        transactions = Transaction.objects.filter(user=request.user).order_by('-date')
        y = 700
        for tx in transactions:
            cat_name = tx.category.name if tx.category else 'None'
            line = f"{tx.date} | {tx.type.capitalize()} | {cat_name} | {tx.wallet.name} | ${tx.amount}"
            p.drawString(100, y, line)
            y -= 20
            if y < 50:
                p.showPage()
                y = 750
                
        p.showPage()
        p.save()
        
        buffer.seek(0)
        return HttpResponse(buffer, content_type='application/pdf')
