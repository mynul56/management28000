from rest_framework import serializers
from .models import Category, Transaction
from wallets.serializers import WalletSerializer

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'type', 'icon', 'color')

class TransactionSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    wallet_name = serializers.ReadOnlyField(source='wallet.name')

    class Meta:
        model = Transaction
        fields = ('id', 'wallet', 'wallet_name', 'category', 'category_name', 
                 'amount', 'type', 'date', 'note', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        # Verify wallet belongs to user
        wallet = validated_data['wallet']
        if wallet.user != self.context['request'].user:
            raise serializers.ValidationError({"wallet": "Invalid wallet selection."})
        return super().create(validated_data)
