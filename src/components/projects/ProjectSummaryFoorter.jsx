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
const DebtIcon = () => (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    id="Layer_1"
    width="24"
    style={{ width: '24px', height: '24px', color: '#4B5563', marginRight: '8px' }}
    height="24"
    fill="#000"
    version="1.1"
    viewBox="0 0 295.24 295.24"
  >
    <g id="SVGRepo_iconCarrier">
      <path d="M185.714.001h9.524v9.524h-9.524zM185.714 19.049h9.524v9.524h-9.524zM195.238 9.525h9.524v9.524h-9.524z"></path>
      <path d="M266.667 238.096v-28.571H152.381v-28.814c34.538-2.457 61.905-31.271 61.905-66.424 0-25.914-14.848-49.219-38.095-60.233V38.096h-23.81v-6.757c0-5.3 3.376-9.986 8.4-11.657a12.3 12.3 0 0 1 3.89-.633h11.519V9.525h-11.519c-2.338 0-4.657.376-6.895 1.119a21.78 21.78 0 0 0-14.919 20.695v6.757h-23.81v15.957C95.8 65.068 80.952 88.372 80.952 114.287c0 35.152 27.367 63.967 61.905 66.424v28.814H28.571v28.571H0v57.143h66.667v-57.143H38.095v-19.048h104.762v19.048h-28.571v57.143h66.667v-57.143h-28.571v-19.048h104.762v19.048h-28.571v57.143h66.667v-57.143zM57.143 247.62v38.095H9.524V247.62zm33.333-133.333c0-23.133 13.805-43.838 35.167-52.748l2.929-1.224V47.62h38.095v12.695l2.929 1.224c21.362 8.91 35.167 29.614 35.167 52.748 0 29.905-23.1 54.467-52.381 56.9v-9.281h-9.524v9.281c-29.282-2.434-52.382-26.996-52.382-56.9m80.953 133.333v38.095H123.81V247.62zm114.285 38.095h-47.619V247.62h47.619z"></path>
      <path d="M152.381 152.382v-9.524c7.876 0 14.286-6.41 14.286-14.286v-4.762c0-7.876-6.41-14.286-14.286-14.286h-9.524a4.766 4.766 0 0 1-4.762-4.762v-4.761a4.766 4.766 0 0 1 4.762-4.762h9.524a4.766 4.766 0 0 1 4.762 4.762h9.524c0-7.876-6.41-14.286-14.286-14.286v-9.524h-9.524v9.524c-7.876 0-14.286 6.41-14.286 14.286v4.762c0 7.876 6.41 14.286 14.286 14.286h9.524a4.766 4.766 0 0 1 4.762 4.762v4.762a4.766 4.766 0 0 1-4.762 4.762h-9.524a4.766 4.766 0 0 1-4.762-4.762h-9.524c0 7.876 6.41 14.286 14.286 14.286v9.523zM19.048 261.906h9.524v9.524h-9.524zM38.095 261.906h9.524v9.524h-9.524zM133.333 261.906h9.524v9.524h-9.524zM152.381 261.906h9.524v9.524h-9.524zM247.619 261.906h9.524v9.524h-9.524zM266.667 261.906h9.524v9.524h-9.524z"></path>
    </g>
  </svg>
);

const ChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '24px', height: '24px', color: '#4B5563', marginRight: '8px' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18M12 3L3 12m9-9l9 9" />
    </svg>
);
const ProfitIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '24px', height: '24px', color: '#4B5563', marginRight: '8px' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18M9 12l2 2 4-4" />
    </svg>
);
const PaymentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '24px', height: '24px', color: '#4B5563', marginRight: '8px' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h4" />
    </svg>
);
const ProjectSummaryFooter = ({ summary, amountsSummary }) => {
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
                    <ProfitIcon />
                    <div>
                        <div style={{ color: '#6B7280' }}>মোট লাভ</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>{summary.totalProfit} টাকা</div>
                    </div>
                </div>
      
                <div style={{ backgroundColor: '#FFFFFF', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', borderRadius: '0.5rem', padding: '1rem', display: 'flex', alignItems: 'center' }}>
                    <ChartIcon />
                    <div>
                        <div style={{ color: '#6B7280' }}>মোট পরিশোধযোগ্য</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>{summary.totalProfit + summary.totalAmountInvested} টাকা</div>
                    </div>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', borderRadius: '0.5rem', padding: '1rem', display: 'flex', alignItems: 'center' }}>
                    <PaymentIcon />
                    <div>
                        <div style={{ color: '#6B7280' }}>পরিশোধ করা হয়েছে</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>{amountsSummary.totalPayments} টাকা</div>
                    </div>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', borderRadius: '0.5rem', padding: '1rem', display: 'flex', alignItems: 'center' }}>
                    <DebtIcon />
                    <div>
                        <div style={{ color: '#6B7280' }}>বাকি আছে</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>{summary.totalProfit + summary.totalAmountInvested - amountsSummary.totalPayments} টাকা</div>
                    </div>
                </div>
            </div>
       </div>
    );
};

export default ProjectSummaryFooter;
