from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum
from datetime import date
from .models import Budget
from .serializers import BudgetSerializer
from transactions.models import Transaction

class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user).order_by('-month')

    @action(detail=False, methods=['get'])
    def current(self, request):
        today = date.today()
        # Find budgets for the current month based on year and month fields
        budgets = Budget.objects.filter(
            user=request.user, 
            month__year=today.year, 
            month__month=today.month
        )
        
        data = []
        for budget in budgets:
            # Calculate spent amount for this category in the current month
            spent = Transaction.objects.filter(
                user=request.user,
                category=budget.category,
                type='expense',
                date__year=today.year,
                date__month=today.month
            ).aggregate(total=Sum('amount'))['total'] or 0.00
            
            serializer = self.get_serializer(budget)
            budget_data = serializer.data
            budget_data['spent'] = float(spent)
            data.append(budget_data)
            
        return Response(data)
