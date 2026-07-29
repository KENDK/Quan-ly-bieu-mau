from rest_framework import serializers
from .models import TrainingType, Personnel, Exam, ExamBoard, BoardMemberAssignment, FormTemplate

class TrainingTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingType
        fields = '__all__'

class PersonnelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Personnel
        fields = '__all__'

class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = '__all__'

class ExamBoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamBoard
        fields = '__all__'

class BoardMemberAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = BoardMemberAssignment
        fields = '__all__'

class FormTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormTemplate
        fields = '__all__'
