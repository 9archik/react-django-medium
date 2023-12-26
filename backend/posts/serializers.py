from rest_framework import serializers
from .models import Post
from users.models import User


class PostSerializer(serializers.ModelSerializer):
    user_id = serializers.CharField(write_only=True)
    class Meta:
        model = Post
        fields = ['title', 'content', 'image', 'theme', "user_id"]
        
    def create(self, validated_data):
        try:
            title = validated_data["title"]
            content = validated_data["content"]
            image = validated_data["image"]
            theme = validated_data["theme"]
            user_id = validated_data["user_id"]
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid user id")
        
        print(validated_data)
         
        post = Post.objects.create(
            content=content,
            user=user,
            image=image,
            theme = theme,
            title = title,
        )
        return post
      