const ReportWriteItem = ({ reportId, isEditMode }: { reportId: string; isEditMode: boolean }) => {
    return (
        <div>
            {reportId}
            {isEditMode}
            <h1>ReportWriteItem</h1>
        </div>
    );
};

export default ReportWriteItem;
