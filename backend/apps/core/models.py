from django.db import models

class TrainingType(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    createdAt = models.DateTimeField(auto_now_add=True, db_column='created_at')

    class Meta:
        db_table = 'training_types'
        ordering = ['code']

class GlobalSubject(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    createdAt = models.DateTimeField(auto_now_add=True, db_column='created_at')

    class Meta:
        db_table = 'global_subjects'
        ordering = ['name']

class Personnel(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    fullName = models.CharField(max_length=200, db_column='full_name')
    academicTitle = models.CharField(max_length=50, blank=True, null=True, db_column='academic_title')
    department = models.CharField(max_length=200)
    position = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.CharField(max_length=100, blank=True, null=True)
    militaryRank = models.CharField(max_length=50, blank=True, null=True, db_column='military_rank')
    createdAt = models.DateTimeField(auto_now_add=True, db_column='created_at')

    class Meta:
        db_table = 'personnel'
        ordering = ['fullName']

class Exam(models.Model):
    STATUS_CHOICES = [
        ('planning', 'Đang lên kế hoạch'),
        ('ongoing', 'Đang diễn ra'),
        ('completed', 'Đã hoàn thành'),
    ]
    id = models.CharField(max_length=50, primary_key=True)
    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=200)
    training_type = models.ForeignKey(TrainingType, on_delete=models.PROTECT, related_name='exams', db_column='training_type_id')
    cohort = models.CharField(max_length=100)
    examDate = models.DateField(db_column='exam_date')
    location = models.CharField(max_length=200)
    totalSubjects = models.IntegerField(default=0, db_column='total_subjects')
    totalRooms = models.IntegerField(default=0, db_column='total_rooms')
    studentsPerRoom = models.IntegerField(default=0, db_column='students_per_room')
    subjectsList = models.JSONField(default=list, db_column='subjects_list')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planning')
    createdAt = models.DateTimeField(auto_now_add=True, db_column='created_at')

    class Meta:
        db_table = 'exams'
        ordering = ['-examDate']

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
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='boards', db_column='exam_id')
    boardCode = models.CharField(max_length=50, choices=BOARD_CODE_CHOICES, db_column='board_code')
    boardName = models.CharField(max_length=100, db_column='board_name')
    description = models.TextField(blank=True, null=True)
    pdfFile = models.TextField(blank=True, null=True, db_column='pdf_file')
    pdfStatus = models.CharField(max_length=20, default='pending', db_column='pdf_status') # 'pending' (Chờ ký duyệt) | 'uploaded' (Đã lưu hồ sơ)
    pdfUploadedAt = models.DateTimeField(blank=True, null=True, db_column='pdf_uploaded_at')
    createdAt = models.DateTimeField(auto_now_add=True, db_column='created_at')

    class Meta:
        db_table = 'exam_boards'
        unique_together = ('exam', 'boardCode')

class BoardMemberAssignment(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    exam_board = models.ForeignKey(ExamBoard, on_delete=models.CASCADE, related_name='assignments', db_column='exam_board_id')
    personnel = models.ForeignKey(Personnel, on_delete=models.CASCADE, related_name='assignments', db_column='personnel_id')
    roleName = models.CharField(max_length=100, db_column='role_name')
    assignedSubject = models.CharField(max_length=200, blank=True, null=True, db_column='assigned_subject')
    notes = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'board_member_assignments'

class FormTemplate(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    boardCode = models.CharField(max_length=50, db_column='board_code')
    templateCode = models.CharField(max_length=50, unique=True, db_column='template_code')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    htmlContent = models.TextField(db_column='html_content')
    createdAt = models.DateTimeField(auto_now_add=True, db_column='created_at')
    updatedAt = models.DateTimeField(auto_now=True, db_column='updated_at')
    
    pageSize = models.CharField(max_length=20, default='A4')
    marginTop = models.IntegerField(default=20)
    marginBottom = models.IntegerField(default=20)
    marginLeft = models.IntegerField(default=30)
    marginRight = models.IntegerField(default=15)

    class Meta:
        db_table = 'form_templates'
