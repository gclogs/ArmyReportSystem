import { create } from 'zustand';
import { Report } from '../schemas/report';

interface ReportState {
  reports: Report[];
  currentReport: Report | null;
  setReports: (reports: Report[]) => void;
  setCurrentReport: (report: Report | null) => void;
  addReport: (report: Report) => void;
  updateReport: (report: Report) => void;
  removeReport: (reportId: number) => void;
}

export const useReportStore = create<ReportState>((set) => ({
  reports: [],
  currentReport: null,
  
  setReports: (reports) => set({ reports }),
  setCurrentReport: (report) => set({ currentReport: report }),
  
  addReport: (report) => 
    set((state) => ({ reports: [...state.reports, report] })),
  
  updateReport: (report) =>
    set((state) => ({
      reports: state.reports.map((r) => 
        r.reportId === report.reportId ? report : r
      ),
    })),
  
  removeReport: (reportId) =>
    set((state) => ({
      reports: state.reports.filter((r) => r.reportId !== reportId),
    })),
}));
