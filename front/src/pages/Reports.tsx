import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ReportForm } from '../components/organisms/ReportForm';
import { ReportList } from '../components/organisms/ReportList';
import { ReportDetail } from '../components/organisms/ReportDetail';
import { Button } from '../components/common/Button';
import type { ReportFormData, Report, ReportStatus } from '../schemas/report';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
`;

const Content = styled.div`
  display: grid;
  gap: 24px;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
`;

const Reports: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: async (): Promise<Report[]> => {
      const response = await fetch('/api/reports');
      if (!response.ok) throw new Error('보고서 목록을 불러오는데 실패했습니다.');
      return response.json();
    },
  });

  const createReportMutation = useMutation({
    mutationFn: async ({ formData }: { formData: FormData }) => {
      const response = await fetch('/api/reports', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('보고서 생성에 실패했습니다.');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      setIsFormOpen(false);
    },
  });

  const updateReportMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ReportStatus }) => {
      const response = await fetch(`/api/reports/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('보고서 상태 변경에 실패했습니다.');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });

  const handleSubmit = async (_data: ReportFormData, formData: FormData) => {
    try {
      await createReportMutation.mutateAsync({ formData });
    } catch (error) {
      console.error('보고서 제출 중 오류:', error);
    }
  };

  const handleStatusChange = async (reportId: string, newStatus: ReportStatus) => {
    try {
      await updateReportMutation.mutateAsync({ id: reportId, status: newStatus });
    } catch (error) {
      console.error('상태 변경 중 오류:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Header>
        <Title>보고서</Title>
        <Button onClick={() => setIsFormOpen(true)}>새 보고서 작성</Button>
      </Header>

      <Content>
        <ReportList
          reports={reports}
          onReportClick={setSelectedReport}
        />
      </Content>

      {isFormOpen && (
        <Modal onClick={() => setIsFormOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ReportForm
              onSubmit={handleSubmit}
              isLoading={createReportMutation.isPending}
              onSuccess={() => setIsFormOpen(false)}
            />
          </ModalContent>
        </Modal>
      )}

      {selectedReport && (
        <Modal onClick={() => setSelectedReport(null)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ReportDetail
              report={selectedReport}
              isOfficer={user?.role === 'OFFICER'}
              onStatusChange={(status: ReportStatus) => handleStatusChange(selectedReport.id, status)}
            />
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default Reports;
