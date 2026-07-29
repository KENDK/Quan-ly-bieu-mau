from django.db import models

class TrainingType(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'training_types'
        ordering = ['code']

class Personnel(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    full_name = models.CharField(max_length=200)
    academic_title = models.CharField(max_length=50)
    department = models.CharField(max_length=200)
    position = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'personnel'
        ordering = ['full_name']

class Exam(models.Model):
    STATUS_CHOICES = [
        ('planning', 'Đang lên kế hoạch'),
        ('ongoing', 'Đang diễn ra'),
        ('completed', 'Đã hoàn thành'),
    ]
    id = models.CharField(max_length=50, primary_key=True)
    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=200)
    training_type = models.ForeignKey(TrainingType, on_delete=models.PROTECT, related_name='exams')
    cohort = models.CharField(max_length=100)
    exam_date = models.DateField()
    location = models.CharField(max_length=200)
    total_subjects = models.IntegerField(default=0)
    total_rooms = models.IntegerField(default=0)
    students_per_room = models.IntegerField(default=0)
    subjects_list = models.JSONField(default=list)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planning')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'exams'
        ordering = ['-exam_date']

class ExamBoard(models.Model):
    BOARD_CODE_CHOICES = [
        ('DE_THI', 'Ban Đề thi'),
        ('COI_THI', 'Ban Coi thi'),
        ('PHACH', 'Ban Phách'),
        ('CHAM_THI', 'Ban Chấm thi'),
        ('GIAM_SAT', 'Ban Giám sát'),
        ('GENERAL', 'Chung toàn kỳ thi'),
    ]
    id = models.CharField(max_length=50, primary_key=True)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='boards')
    board_code = models.CharField(max_length=50, choices=BOARD_CODE_CHOICES)
    board_name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'exam_boards'
        unique_together = ('exam', 'board_code')

class BoardMemberAssignment(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    exam_board = models.ForeignKey(ExamBoard, on_delete=models.CASCADE, related_name='assignments')
    personnel = models.ForeignKey(Personnel, on_delete=models.CASCADE, related_name='assignments')
    role_name = models.CharField(max_length=100)
    assigned_subject = models.CharField(max_length=200, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'board_member_assignments'

class FormTemplate(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    board_code = models.CharField(max_length=50)
    template_code = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    html_content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    pageSize = models.CharField(max_length=20, default='A4')
    marginTop = models.IntegerField(default=20)
    marginBottom = models.IntegerField(default=20)
    marginLeft = models.IntegerField(default=30)
    marginRight = models.IntegerField(default=15)

    class Meta:
        db_table = 'form_templates'
