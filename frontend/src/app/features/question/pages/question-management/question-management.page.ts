import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Question,
  Category,
  QuestionFilter,
  CreateQuestionDto,
  UpdateQuestionDto,
} from '../../models/question.model';
import { QuestionService } from '../../services/question.service';
import { ImportService } from '../../../import/services/import.service';
import { ExportService } from '../../../export/services/export.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { environment } from '../../../../../environments/environment';

// Components
import { QuestionListComponent } from '../../components/question-list/question-list.component';
import { QuestionFilterComponent } from '../../components/question-filter/question-filter.component';
import { QuestionFormComponent } from '../../components/question-form/question-form.component';
import { CategoryListComponent } from '../../components/category-list/category-list.component';
import { CategoryFormComponent } from '../../components/category-form/category-form.component';
import { ExportButtonComponent } from '../../../export/components/export-button/export-button.component';
import { FileUploadComponent } from '../../../import/components/file-upload/file-upload.component';
import { ImportProgressComponent } from '../../../import/components/import-progress/import-progress.component';

@Component({
  selector: 'app-question-management',
  standalone: true,
  imports: [
    CommonModule,
    QuestionListComponent,
    QuestionFilterComponent,
    QuestionFormComponent,
    CategoryListComponent,
    CategoryFormComponent,
    ExportButtonComponent,
    FileUploadComponent,
    ImportProgressComponent,
  ],
  templateUrl: './question-management.page.html',
  styleUrl: './question-management.page.css',
})
export class QuestionManagementPage implements OnInit {
  private questionService = inject(QuestionService);
  private importService = inject(ImportService);
  private exportService = inject(ExportService);
  private notificationService = inject(NotificationService);

  // Questions
  readonly questions = signal<Question[]>([]);
  readonly totalQuestions = signal(0);
  readonly currentPage = signal(1);
  readonly pageSize = signal(environment.defaultPageSize);

  // Categories
  readonly categories = signal<Category[]>([]);

  // Filters
  readonly searchQuery = signal('');
  readonly selectedCategory = signal('');

  // UI State
  readonly showFilter = signal(true);
  readonly showQuestionForm = signal(false);
  readonly showCategoryForm = signal(false);
  readonly editingQuestion = signal<Question | undefined>(undefined);
  readonly editingCategory = signal<Category | undefined>(undefined);

  // Import
  readonly showImport = signal(false);
  readonly importProgress = signal<{
    sessionId: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    total: number;
    processed: number;
    success: number;
    failed: number;
    errors: any[];
  } | null>(null);

  // Loading states
  readonly isLoading = signal(false);

  constructor() {
    this.loadCategories();
    this.loadQuestions();
  }

  ngOnInit(): void {}

  // Question Management

  loadQuestions(): void {
    this.isLoading.set(true);
    const filter: QuestionFilter = {
      page: this.currentPage(),
      limit: this.pageSize(),
      category_id: this.selectedCategory() || undefined,
      search: this.searchQuery() || undefined,
    };

    this.questionService.getQuestions(filter).subscribe({
      next: (response) => {
        this.questions.set(response.data);
        this.totalQuestions.set(response.total);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.notificationService.error('Failed to load questions');
        this.isLoading.set(false);
      },
    });
  }

  loadCategories(): void {
    this.questionService.getCategories(true).subscribe({
      next: (categories) => {
        this.categories.set(categories);
      },
      error: (error) => {
        this.notificationService.error('Failed to load categories');
      },
    });
  }

  onEditQuestion(id: string): void {
    const question = this.questions().find((q) => q.id === id);
    if (question) {
      this.editingQuestion.set(question);
      this.showQuestionForm.set(true);
    }
  }

  onDeleteQuestion(id: string): void {
    if (confirm('Are you sure you want to delete this question?')) {
      this.questionService.deleteQuestion(id).subscribe({
        next: () => {
          this.notificationService.success('Question deleted');
          this.loadQuestions();
        },
        error: (error) => {
          this.notificationService.error('Failed to delete question');
        },
      });
    }
  }

  onCreateQuestion(): void {
    this.editingQuestion.set(undefined);
    this.showQuestionForm.set(true);
  }

  onQuestionSubmit(dto: CreateQuestionDto | UpdateQuestionDto): void {
    const editing = this.editingQuestion();

    if (editing) {
      this.questionService.updateQuestion(editing.id, dto as UpdateQuestionDto).subscribe({
        next: () => {
          this.notificationService.success('Question updated');
          this.showQuestionForm.set(false);
          this.editingQuestion.set(undefined);
          this.loadQuestions();
        },
        error: (error) => {
          this.notificationService.error('Failed to update question');
        },
      });
    } else {
      this.questionService.createQuestion(dto as CreateQuestionDto).subscribe({
        next: () => {
          this.notificationService.success('Question created');
          this.showQuestionForm.set(false);
          this.loadQuestions();
        },
        error: (error) => {
          this.notificationService.error('Failed to create question');
        },
      });
    }
  }

  // Category Management

  onCreateCategory(): void {
    this.editingCategory.set(undefined);
    this.showCategoryForm.set(true);
  }

  onEditCategory(category: Category): void {
    this.editingCategory.set(category);
    this.showCategoryForm.set(true);
  }

  onDeleteCategory(id: string): void {
    const category = this.categories().find((c) => c.id === id);
    const questionCount = category?.question_count || 0;

    let message = 'Are you sure you want to delete this category?';
    if (questionCount > 0) {
      message = `This category has ${questionCount} questions. Are you sure you want to delete it?`;
    }

    if (confirm(message)) {
      this.questionService.deleteCategory(id).subscribe({
        next: () => {
          this.notificationService.success('Category deleted');
          this.loadCategories();
        },
        error: (error) => {
          this.notificationService.error('Failed to delete category');
        },
      });
    }
  }

  onCategorySubmit(dto: any): void {
    const editing = this.editingCategory();

    if (editing) {
      this.questionService.updateCategory(editing.id, dto).subscribe({
        next: () => {
          this.notificationService.success('Category updated');
          this.showCategoryForm.set(false);
          this.editingCategory.set(undefined);
          this.loadCategories();
        },
        error: (error) => {
          this.notificationService.error('Failed to update category');
        },
      });
    } else {
      this.questionService.createCategory(dto).subscribe({
        next: () => {
          this.notificationService.success('Category created');
          this.showCategoryForm.set(false);
          this.loadCategories();
        },
        error: (error) => {
          this.notificationService.error('Failed to create category');
        },
      });
    }
  }

  // Filters

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(1);
    this.loadQuestions();
  }

  onCategoryChange(categoryId: string): void {
    this.selectedCategory.set(categoryId);
    this.currentPage.set(1);
    this.loadQuestions();
  }

  onClearFilters(): void {
    this.searchQuery.set('');
    this.selectedCategory.set('');
    this.currentPage.set(1);
    this.loadQuestions();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadQuestions();
  }

  // Import

  onToggleImport(): void {
    this.showImport.update((show) => !show);
  }

  onFileUpload(event: any): void {
    const file = event.file;

    this.importService.uploadFile(file).subscribe({
      next: (response) => {
        this.notificationService.success('File uploaded, processing...');
        this.pollImportStatus(response.session_id);
      },
      error: (error) => {
        this.notificationService.error('Failed to upload file');
      },
    });
  }

  private pollImportStatus(sessionId: string): void {
    this.importService.getImportStatus(sessionId).subscribe({
      next: (progress) => {
        this.importProgress.set(progress as any);

        if (
          progress.status === 'completed' ||
          progress.status === 'failed'
        ) {
          if (progress.status === 'completed') {
            this.notificationService.success(
              `Import complete: ${progress.success} questions added`
            );
            this.loadQuestions();
            this.loadCategories();
          } else {
            this.notificationService.error('Import failed');
          }
          this.showImport.set(false);
          this.importProgress.set(null);
        } else {
          // Continue polling
          setTimeout(() => this.pollImportStatus(sessionId), 1000);
        }
      },
      error: (error) => {
        this.notificationService.error('Failed to get import status');
      },
    });
  }

  // Export

  onExport(format: string): void {
    this.notificationService.info(`Exporting to ${format.toUpperCase()}...`);

    this.exportService
      .exportQuestions({
        format: format as any,
        category_id: this.selectedCategory() || undefined,
        include_deleted: false,
      })
      .subscribe({
        next: (blob) => {
          const filename = this.exportService.generateFilename(format);
          this.exportService.downloadFile(blob, filename);
          this.notificationService.success('Export complete');
        },
        error: (error) => {
          this.notificationService.error('Failed to export questions');
        },
      });
  }

  // UI Helpers

  closeQuestionForm(): void {
    this.showQuestionForm.set(false);
    this.editingQuestion.set(undefined);
  }

  closeCategoryForm(): void {
    this.showCategoryForm.set(false);
    this.editingCategory.set(undefined);
  }

  onQuestionFormCancel(): void {
    this.closeQuestionForm();
  }

  onCategoryFormCancel(): void {
    this.closeCategoryForm();
  }
}
