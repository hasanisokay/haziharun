import React from 'react';

// SVG Icons with inline styles
const BusinessIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '24px', height: '24px', color: '#4B5563', marginRight: '8px' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4V20m8-8H4" />
    </svg>
);
const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '24px', height: '24px', color: '#4B5563', marginRight: '8px' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);
const SpinnerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '24px', height: '24px', color: '#4B5563', marginRight: '8px' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v4m0 4v4m-4-4h4m4 0h4M4 4l4 4M4 20l4-4M20 4l-4 4M20 20l-4-4" />
    </svg>
);
const MoneyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '24px', height: '24px', color: '#4B5563', marginRight: '8px' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c1.11 0 2 .89 2 2v4c0 1.11-.89 2-2 2m0-8V4m0 4V4M4 6h16M4 10h16M4 14h16m0-4H4m16 8v4M4 18v4" />
    </svg>
);
const ChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '24px', height: '24px', color: '#4B5563', marginRight: '8px' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18M12 3L3 12m9-9l9 9" />
    </svg>
);

const ProjectSummaryFooter = ({ summary }) => {
    return (
       <div style={{pageBreakBefore: 'always'}}>
          <h3 style={{ fontWeight: '500', color: '#4B5563', fontSize: '1.125rem', paddingLeft:'1rem', marginBottom: '1rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '0.5rem' }}>প্রকল্পের সারসংক্ষেপ</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ backgroundColor: '#FFFFFF', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', borderRadius: '0.5rem', padding: '1rem', display: 'flex', alignItems: 'center' }}>
                    <BusinessIcon />
                    <div>
                        <div style={{ color: '#6B7280' }}>মোট ব্যবসা</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>{summary.totalProjects}</div>
                    </div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', borderRadius: '0.5rem', padding: '1rem', display: 'flex', alignItems: 'center' }}>
                    <CheckIcon />
                    <div>
                        <div style={{ color: '#6B7280' }}>সমাপ্ত হয়েছে</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>{summary.finishedProjects}</div>
                    </div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', borderRadius: '0.5rem', padding: '1rem', display: 'flex', alignItems: 'center' }}>
                    <SpinnerIcon />
                    <div>
                        <div style={{ color: '#6B7280' }}>চলমান আছে</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>{summary.runningProjects}</div>
                    </div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', borderRadius: '0.5rem', padding: '1rem', display: 'flex', alignItems: 'center' }}>
                    <MoneyIcon />
                    <div>
                        <div style={{ color: '#6B7280' }}>মোট বিনিয়োগ</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>{summary.totalAmountInvested} টাকা</div>
                    </div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', borderRadius: '0.5rem', padding: '1rem', display: 'flex', alignItems: 'center' }}>
                    <ChartIcon />
                    <div>
                        <div style={{ color: '#6B7280' }}>মোট লাভ</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>{summary.totalProfit} টাকা</div>
                    </div>
                </div>
            </div>
       </div>
    );
};

export default ProjectSummaryFooter;
