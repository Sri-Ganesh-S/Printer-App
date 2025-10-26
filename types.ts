export enum UserRole {
  Student = 'student',
  Printer = 'printer',
}

export interface PrintJob {
  id: string;
  fileName: string;
  fileData: string; // Base64 encoded PDF
  pageCount: number;
  summary: string;
  cost: number;
  status: 'pending' | 'completed';
  createdAt: number;
  studentId: string;
  tokenNumber?: string;
}