from rest_framework import serializers
from .models import Wallet

class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = ('id', 'name', 'balance', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at', 'balance')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        # Initial balance should default to 0 on creation, and will be updated via transactions.
        validated_data['balance'] = 0.00
        return super().create(validated_data)
