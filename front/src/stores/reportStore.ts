import { create } from 'zustand';
import { Report, ReportFilter } from '../types/report';

interface ReportState {
  reports: Report[];
  currentReport: Report | null;
  filter: ReportFilter;
  setReports: (reports: Report[]) => void;
  setCurrentReport: (report: Report | null) => void;
  setFilter: (filter: ReportFilter) => void;
  addReport: (report: Report) => void;
  updateReport: (report: Report) => void;
  removeReport: (reportId: string) => void;
}

export const useReportStore = create<ReportState>((set) => ({
  reports: [],
  currentReport: null,
  filter: {},
  
  setReports: (reports) => set({ reports }),
  setCurrentReport: (report) => set({ currentReport: report }),
  setFilter: (filter) => set({ filter }),
  
  addReport: (report) => 
    set((state) => ({ reports: [...state.reports, report] })),
  
  updateReport: (report) =>
    set((state) => ({
      reports: state.reports.map((r) => 
        r.id === report.id ? report : r
      ),
    })),
  
  removeReport: (reportId) =>
    set((state) => ({
      reports: state.reports.filter((r) => r.id !== reportId),
    })),
}));
