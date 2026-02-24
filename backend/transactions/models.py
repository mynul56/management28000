from django.db import models, transaction as db_transaction
from django.conf import settings
from wallets.models import Wallet

class Category(models.Model):
    TYPE_CHOICES = (
        ('income', 'Income'),
        ('expense', 'Expense')
    )
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    icon = models.CharField(max_length=50, blank=True, null=True)
    color = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.type})"

class Transaction(models.Model):
    TYPE_CHOICES = (
        ('income', 'Income'),
        ('expense', 'Expense')
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='transactions')
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name='transactions')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='transactions')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    date = models.DateField()
    note = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        with db_transaction.atomic():
            if self.pk:
                old = Transaction.objects.select_for_update().get(pk=self.pk)
                # Revert old balance
                if old.type == 'income':
                    old.wallet.balance -= old.amount
                else:
                    old.wallet.balance += old.amount
                old.wallet.save()
            
            # Apply new balance
            if self.type == 'income':
                self.wallet.balance += self.amount
            else:
                self.wallet.balance -= self.amount
            self.wallet.save()
            super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        with db_transaction.atomic():
            if self.type == 'income':
                self.wallet.balance -= self.amount
            else:
                self.wallet.balance += self.amount
            self.wallet.save()
            super().delete(*args, **kwargs)

    def __str__(self):
        return f"{self.type} - {self.amount} on {self.date}"
