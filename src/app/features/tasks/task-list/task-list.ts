import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../core/services/task';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, switchMap, map } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.html',
  styleUrls: ['./task-list.css']
})
export class TaskListComponent implements OnInit {

  // 🔥 Reactive stream
  private reload$ = new BehaviorSubject<void>(undefined);

  // 🔥 Tasks observable (no manual subscribe)
  tasks$ = this.reload$.pipe(
      switchMap(() => {
        this.isLoadingTasks = true;

        return this.taskService.getTasks(
          this.page,
          this.pageSize,
          this.search,
          this.selectedStatus
        );
      }),
      map((res: any) => {
        this.isLoadingTasks = false;

        return res.data.map((task: any) => ({
          ...task,
          statusId: this.getStatusId(task.status)
        }));
      })
    );

  constructor(private taskService: TaskService,private cdr: ChangeDetectorRef) {}

  // UI State
  showForm = false;

  newTask = {
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '' // 🔥 ADD THIS
  };

  page = 1;
  pageSize = 5;

  search = '';
  selectedStatus?: number;

  aiInput = '';

  plan: any[] = [];
  isPlanning = false;
  showPlanModal = false;

  chatInput = '';
  chatMessages: { role: string, text: string }[] = [];
  isChatLoading = false;
  isLoadingTasks = false;

  ngOnInit() {
    this.loadTasks();
  }

  // 🔥 Trigger reload instead of API call directly
  loadTasks() {
    this.reload$.next();
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  createTask() {
    const payload = {
      title: this.newTask.title,
      description: this.newTask.description,
      priority: this.newTask.priority,
      dueDate: this.newTask.dueDate,
      assignedToUserId: 1 // 🔥 FORCE ADD
    };

    console.log('FINAL PAYLOAD BEFORE SEND:', payload);

    this.taskService.createTask(payload).subscribe({
      next: (res) => {
        console.log('Task created response:', res);
        alert('Task created!');
        this.showForm = false;
        this.loadTasks();
      },
      error: (err) => {
        console.error('CREATE TASK ERROR:', err);
      }
    });
  }

  updateStatus(taskId: number, statusId: number) {
    this.taskService.updateTaskStatus(taskId, statusId).subscribe({
      next: () => {
        console.log('Status updated');
        this.loadTasks(); // 🔥 reload
      },
      error: (err) => console.error(err)
    });
  }

  deleteTask(taskId: number) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        console.log('Deleted');
        this.loadTasks(); // 🔥 reload instead of manual update
      },
      error: (err) => console.error(err)
    });
  }

  generateWithAI() {
    if (!this.aiInput.trim()) return;

    this.taskService.generateTask(this.aiInput).subscribe({
      next: (res: any) => {
        console.log('AI Response:', res);

        // 🔥 NO JSON.parse
        this.newTask.title = res.title;
        this.newTask.description = res.description;
        this.newTask.priority = res.priority;
        this.newTask.dueDate = res.dueDate;

        this.showForm = true; // open form
      },
      error: (err) => {
      alert(err.error?.error || 'Something went wrong');
      console.error(err);
}
    });
  }

  generatePlan() {
    this.isPlanning = true;

    this.taskService.generatePlan().subscribe({
      next: (res: any) => {
        this.plan = res.plan;
        this.showPlanModal = true;

        this.isPlanning = false;

        // 🔥 FORCE UI UPDATE
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.isPlanning = false;
      }
    });
  }

  // 🔁 Helpers
  getStatusId(status: string): number {
    switch (status) {
      case 'Open': return 1;
      case 'In Progress': return 2;
      case 'Blocked': return 3;
      case 'Done': return 4;
      default: return 1;
    }
  }

  closePlanModal() {
    this.showPlanModal = false;
  }

  sendMessage() {
    if (!this.chatInput.trim()) return;

    const userMsg = this.chatInput;

    this.chatMessages.push({ role: 'user', text: userMsg });

    this.chatInput = '';
    this.isChatLoading = true;

    this.taskService.chat(userMsg).subscribe({
      next: (res: any) => {
        this.chatMessages.push({
          role: 'ai',
          text: res.response
        });

        this.isChatLoading = false;

        // 🔥 AUTO SCROLL HERE
        setTimeout(() => {
          const el = document.querySelector('.chat-box');
          if (el) el.scrollTop = el.scrollHeight;
        }, 100);
      },
      error: (err) => {
        console.error(err);
        this.isChatLoading = false;
      }
    });
  }
}