import React from 'react';

const PermanentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '24px', height: '24px', color: '#4B5563', marginRight: '8px' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4V20m8-8H4" />
    </svg>
);
const TempIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '24px', height: '24px', color: '#4B5563', marginRight: '8px' }}> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4h4" /> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12h4" /> <circle cx="12" cy="12" r="10" /> </svg>);
const DepositIcon = () => (<svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    style={{ width: '24px', height: '24px', color: '#4B5563', marginRight: '8px' }}
>
    <g id="SVGRepo_iconCarrier">
        <path d="M19.6 21H4.4C3.1 21 2 19.9 2 18.6V14h2v4.2c0 .6.4.8 1 .8h14c.6 0 1-.4 1-1v-4h2v4.6c0 1.3-1.1 2.4-2.4 2.4"></path>
        <path d="M15.3 12.1 13.4 14v-4c0-2 0-4.9 2.4-7-3.4.6-5.1 3.2-5.2 7v4l-1.9-1.9L7 13l5 5 5-5z"></path>
    </g>
</svg>);

const MemberSummaryFooter = ({ permanentMemberCount, tempMemberCount, totalDepositAmount }) => {

    return (
        <>
            <h3 style={{ fontWeight: '500', color: '#4B5563', fontSize: '1.125rem', marginBottom: '1rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '0.5rem' }}>সারসংক্ষেপ</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ backgroundColor: '#FFFFFF', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', borderRadius: '0.5rem', padding: '1rem', display: 'flex', alignItems: 'center' }}>
                    <PermanentIcon />
                    <div>
                        <div style={{ color: '#6B7280' }}>আমানতসহ সদস্য সংখ্যা</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>{permanentMemberCount}</div>
                    </div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', borderRadius: '0.5rem', padding: '1rem', display: 'flex', alignItems: 'center' }}>
                    <TempIcon />
                    <div>
                        <div style={{ color: '#6B7280' }}>আমানতহীন সদস্য সংখ্যা</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>{tempMemberCount}</div>
                    </div>
                </div>
                <div style={{ backgroundColor: '#FFFFFF', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', borderRadius: '0.5rem', padding: '1rem', display: 'flex', alignItems: 'center' }}>
                    <DepositIcon />
                    <div>
                        <div style={{ color: '#6B7280' }}>মোট আমানত</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>{Number(totalDepositAmount.toFixed(2)).toLocaleString()}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MemberSummaryFooter;
