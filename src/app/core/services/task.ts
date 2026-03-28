import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private baseUrl = 'http://localhost:5091/api/tasks';

  constructor(private http: HttpClient) {}

  getTasks(page: number, pageSize: number, search?: string, statusId?: number) {
    let params: any = {
      page,
      pageSize
    };

    if (search) params.search = search;
    if (statusId) params.statusId = statusId;

    return this.http.get<any>(this.baseUrl, { params });
  }

  createTask(task: any) {
    return this.http.post(this.baseUrl, task);
  }

  updateTaskStatus(taskId: number, statusId: number) {
  return this.http.put(`${this.baseUrl}/${taskId}/status`, {
    statusId: statusId
  });
  }

  deleteTask(taskId: number) {
  return this.http.delete(`${this.baseUrl}/${taskId}`);
  }

  generateTask(input: string) {
    return this.http.post<string>(
      'http://localhost:5091/api/ai/generate-task',
      { input } // 🔥 THIS IS THE FIX
    );
  }

  generatePlan() {
    return this.http.get<any>('http://localhost:5091/api/ai/plan');
  }

  chat(message: string) {
    return this.http.post<any>(
      'http://localhost:5091/api/ai/chat',
      { message } // ✅ clean JSON
    );
  }
}