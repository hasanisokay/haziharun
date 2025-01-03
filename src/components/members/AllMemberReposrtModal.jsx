'use client';

import { useRef } from "react";
import Print from "../svg/Print";
import getProjectName from "@/utils/getProjectName.mjs";
import formatDate from "@/utils/formatDate.mjs";
import MemberSummaryFooter from "./MemberSummaryFooter";
import convertToBanglaNumber from "@/utils/convertToBanglaNumber.mjs";
import ExcelJS from 'exceljs';
import jsToExcelDate from "@/utils/jsToExcelDate.mjs";

const AllMemberReportModal = ({ membersFromParent, onClose, permanentMemberCount, tempMemberCount, totalDepositAmount }) => {
    const iframeRef = useRef(null);
    const handlePrint = () => {
        const printContent = document.getElementById("printable-content").innerHTML; // Grab the content to be printed

        // Inline CSS for the printed content
        const styles = `
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            padding: 0;
            background-color: white;
          }

        `;

        // Open a new window for the print content
        const printWindow = window.open('', '_blank', 'width=800,height=600');

        // Write the styles and content into the print window
        printWindow.document.open();
        printWindow.document.write(`
          <html>
            <head>
              <style>${styles}</style>
            </head>
            <body>
              ${printContent}
            </body>
          </html>
        `);
        printWindow.document.close();

        // Wait for the document to load and then print
        printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
            // printWindow.close();
        };
    };
    let tdStyle = {
        textAlign: 'center',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        wordWrap: 'break-word',
        overflow: 'hidden',
        color: '#374151',
        padding: '4px',
        fontSize: '14px',
        borderRight: "1px solid #ddd",
    }

    async function exportToExcel(data, filePath) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Members');
    
        // Add header row
        worksheet.columns = [
            { header: 'Member ID', key: '_id', width: 25 },
            { header: 'Name', key: 'name', width: 20 },
            { header: 'Type', key: 'type', width: 15 },
            { header: 'Father', key: 'father', width: 20 },
            { header: 'Mother', key: 'mother', width: 20 },
            { header: 'Village', key: 'village', width: 20 },
            { header: 'Post', key: 'post', width: 15 },
            { header: 'Police Station', key: 'policeStation', width: 20 },
            { header: 'District', key: 'district', width: 20 },
            { header: 'Mobile Number', key: 'mobileNumber', width: 20 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'National ID', key: 'nationalId', width: 20 },
            { header: 'Added On', key: 'addedOn', width: 30 },
            { header: 'Project Name', key: 'projectName', width: 30 },
            { header: 'Project Id', key: 'projectId', width: 30 },
            { header: 'Amount Invested', key: 'amountInvested', width: 20 },
            { header: 'Profit', key: 'profit', width: 20 },
            { header: 'Percentage', key: 'percentage', width: 15 },
            { header: 'Payment Date', key: 'paymentDate', width: 30 },
            { header: 'Payment Amount', key: 'paymentAmount', width: 20 },
            { header: 'Deposit Date', key: 'depositDate', width: 30 },
            { header: 'Deposit Amount', key: 'depositAmount', width: 20 },
        ];
    
        // Add data rows
        data.forEach(member => {
            // Base member information
            const baseInfo = {
                _id: member._id,
                name: member.name,
                type: member.type,
                father: member.father,
                mother: member.mother,
                village: member.village,
                post: member.post,
                policeStation: member.policeStation,
                district: member.district,
                mobileNumber: member.mobileNumber,
                email: member.email,
                nationalId: member.nationalId,
                addedOn: jsToExcelDate(member.addedOn),
            };
    
            // Add projects and payments information
            if (member.projectsInfo && member.projectsInfo.length > 0) {
                member.projectsInfo.forEach(project => {
                    const projectInfo = {
                        projectName: project.projectName,
                        projectId: project._id,
                    };
    
                    if (project.members && project.members.length > 0) {
                        project.members.forEach(projectMember => {
                            if(projectMember.memberId !== member._id) { 
                                return;
                             }
                            worksheet.addRow({
                                ...baseInfo,
                                ...projectInfo,
                                amountInvested: projectMember.amountInvested,
                                profit: projectMember.willGetAmount,
                                percentage: projectMember.willGetPercentage,
                            });
                            if (projectMember.payments && projectMember.payments.length > 0) {
                                projectMember.payments.forEach(payment => {
                                    worksheet.addRow({
                                        ...baseInfo,
                                        ...projectInfo,
                                        paymentDate: jsToExcelDate(payment.date),
                                        paymentAmount: payment.amount,
                                    });
                                });
                            } else {
                                worksheet.addRow({
                                    ...baseInfo,
                                    ...projectInfo,
                                });
                            }
                        });
                    } else {
                        worksheet.addRow({
                            ...baseInfo,
                            ...projectInfo,
                        });
                    }
                });
            }
    
            // Add deposits info
            if (member.depositsInfo && member.depositsInfo.length > 0) {
                member.depositsInfo.forEach(deposit => {
                    worksheet.addRow({
                        ...baseInfo,
                        depositDate: jsToExcelDate(deposit.depositDate),
                        depositAmount: deposit.amount,
                    });
                });
            }
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'AllMemberReport.xlsx';
        link.click();
    }


    // console.log(membersFromParent)
    return (
        <div
            // onClick={onClose}
            className="text-black"
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 50,
            }}
        >
            <div
                style={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                    padding: "20px",
                    maxWidth: "800px",
                    width: "100%",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    position: "relative",
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                }}
            >
                <div className="flex justify-between items-center">
                    <h2
                        style={{
                            fontSize: "24px",
                            fontWeight: "600",
                            color: "#333",
                            marginBottom: "16px",
                            textAlign: "center",
                        }}
                    >
                        সব সদস্যের রিপোর্ট
                    </h2>
                    <div className="flex gap-4">
                        <button
                            onClick={handlePrint}
                            className="p-2 flex items-center gap-2"
                        >
                            প্রিন্ট <Print />
                        </button>
                        <button
                            onClick={()=>exportToExcel(membersFromParent, 'AllMemberReport.xlsx')}
                            className="p-2 flex items-center gap-2"
                        >
                            এক্সেল ডাউনলোড
                        </button>
                        <button
                            className="p-2"
                            onClick={onClose}
                        >
                            &#10006;
                        </button>
                    </div>
                </div>

                <div id="printable-content">
                    {membersFromParent?.map((m, index) => {
                        return <div key={index} style={{ marginBottom: "100px" }}>
                            <div style={{ pageBreakInside: "avoid" }}>
                                <span style={{ fontSize: '14px', color: '#374151', textAlign: 'center', display: 'block' }}>সদস্য নং- {convertToBanglaNumber(index + 1)}</span>

                                <h3
                                    style={{
                                        fontSize: "20px",
                                        fontWeight: "500",
                                        color: "#444",
                                        marginBottom: "12px",
                                        borderBottom: "1px solid #ddd",
                                        paddingBottom: "8px",
                                    }}
                                >
                                    {m.name} {" "}
                                    <span style={{ fontSize: '14px', textAlign: 'right' }}>({m.type === "permanent" ? "আমানতসহ সদস্য" : "আমানতহীন সদস্য"})
                                    </span>

                                </h3>
                                <h4
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: "500",
                                        color: "#444",
                                        marginBottom: "12px",
                                        paddingBottom: "8px",
                                    }}
                                >
                                    ব্যক্তিগত তথ্য
                                </h4>
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        gap: "12px",
                                        color: "#555",
                                        fontSize: "14px",
                                        pageBreakInside: "avoid",
                                    }}

                                >
                                    <p
                                        title={m.father}
                                        style={{
                                            whiteSpace: 'nowrap',
                                            textOverflow: 'ellipsis',
                                            wordWrap: 'break-word',
                                            overflow: 'hidden',
                                            maxWidth: '300px'
                                        }}><strong>পিতাঃ</strong> {m.father}</p>
                                    <p
                                        title={m.mother}
                                        style={{
                                            whiteSpace: 'nowrap',
                                            textOverflow: 'ellipsis',
                                            wordWrap: 'break-word',
                                            overflow: 'hidden',
                                            maxWidth: '300px'
                                        }}><strong>মাতাঃ</strong> {m.mother}</p>
                                    <p
                                        title={m.village}
                                        style={{
                                            whiteSpace: 'nowrap',
                                            textOverflow: 'ellipsis',
                                            wordWrap: 'break-word',
                                            overflow: 'hidden',
                                            maxWidth: '300px'
                                        }}><strong>গ্রামঃ</strong> {m.village}</p>
                                    <p
                                        title={m.mobileNumber}
                                        style={{
                                            whiteSpace: 'nowrap',
                                            textOverflow: 'ellipsis',
                                            wordWrap: 'break-word',
                                            overflow: 'hidden',
                                            maxWidth: '300px'
                                        }}><strong>মোবাইলঃ</strong> {m.mobileNumber}</p>
                                    <p style={{
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                        wordWrap: 'break-word',
                                        overflow: 'hidden',
                                        maxWidth: '300px'
                                    }}
                                        title={m.email}><strong>ইমেইলঃ</strong> {m.email}</p>
                                    <p
                                        title={m.nationalId}
                                        style={{
                                            whiteSpace: 'nowrap',
                                            textOverflow: 'ellipsis',
                                            wordWrap: 'break-word',
                                            overflow: 'hidden',
                                            maxWidth: '300px'
                                        }}><strong>জাতীয় পরিচয়পত্রঃ</strong> {m.nationalId}</p>
                                </div>
                            </div>

                            <h4
                                style={{
                                    fontSize: "18px",
                                    fontWeight: "500",
                                    color: "#444",
                                    margin: "26px 0 12px",
                                    borderBottom: "1px solid #ddd",
                                    paddingBottom: "8px",
                                }}
                            >
                                সারসংক্ষেপ
                            </h4>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: "12px",
                                    color: "#555",
                                    pageBreakInside: "avoid",
                                }}
                            >
                                <p><strong>মোট ব্যবসায় বিনিয়োগঃ</strong> {m.projectCount}</p>
                                <p><strong>বিনিয়োগের পরিমাণঃ</strong> &#2547;{m.totalAmountInvested.toLocaleString()}</p>
                                <p><strong>মোট লাভঃ</strong> &#2547;{m.totalWillGetAmount.toLocaleString()}</p>
                            </div>

                            {/* Projects Section */}
                            {m.projectsInfo.length > 0 && (
                                <>
                                    <h4
                                        style={{
                                            fontSize: "18px",
                                            fontWeight: "500",
                                            color: "#444",
                                            marginTop: "20px",
                                            marginBottom: "12px",
                                            borderBottom: "1px solid #ddd",
                                            paddingBottom: "8px",
                                        }}
                                    >
                                        প্রকল্পের বিবরণ
                                    </h4>
                                    {m.projectsInfo.map((project, index) => {
                                        // let totalPaid = project?.payments ? project.payments.reduce((acc, currentV) => acc + currentV?.amount, 0) : 0
                                        return <div
                                            key={project._id}
                                        // style={{
                                        //     backgroundColor: "#f9f9f9",
                                        //     borderRadius: "6px",
                                        //     // padding: "16px",
                                        //     marginBottom: "16px",
                                        //     border: "1px solid #ddd",
                                        //     pageBreakInside: "avoid",
                                        //     overflowX: "auto",
                                        // }}
                                        >
                                            <span style={{ fontSize: '14px', display: 'block', color: '#374151', pageBreakAfter: 'avoid', marginBottom: '6px', marginTop: '6px' }}>প্রকল্প নং- {convertToBanglaNumber(index + 1)}</span>
                                            <div
                                                style={{
                                                    backgroundColor: "#f9f9f9",
                                                    borderRadius: "6px",
                                                    // padding: "16px",
                                                    marginBottom: "16px",
                                                    border: "1px solid #ddd",
                                                    pageBreakInside: "avoid",
                                                    overflowX: "auto",
                                                }}
                                            >    <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '8px' }}>
                                                    <thead>
                                                        <tr style={{ borderBottom: '1px solid #ddd' }}>
                                                            <th style={{ ...tdStyle, width: '150px' }} >
                                                                প্রকল্প
                                                            </th>
                                                            <th style={{ ...tdStyle, width: '100px' }} >
                                                                বিনিয়োগ
                                                            </th>

                                                            <th style={{ ...tdStyle, width: '80px' }}>
                                                                {project.projectType === "mudaraba"
                                                                    ? "লাভ/লস"
                                                                    : "লাভ"}
                                                            </th>
                                                            <th style={{ ...tdStyle, width: '110px' }}>
                                                                মোট পাবেন
                                                            </th>
                                                            <th style={{ ...tdStyle, width: '160px', }}>
                                                                পেয়েছেন
                                                            </th>
                                                            <th style={{ ...tdStyle, width: '100px' }}>
                                                                বাকি আছে
                                                            </th>

                                                            <th style={{ ...tdStyle, width: '90px' }}>
                                                                পার্সেন্টেজ
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {project.members.map((member) => {
                                                            if (member?.name !== m?.name) {
                                                                return null
                                                            }
                                                            let totalPaid = member?.payments ? member.payments.reduce((acc, currentV) => acc + currentV?.amount, 0) : 0
                                                            return (
                                                                <tr
                                                                    key={member.memberId}
                                                                    style={{ borderBottom: '1px solid #ddd' }}
                                                                // className="border-b border-gray-300 "
                                                                >
                                                                    <td
                                                                        style={{ ...tdStyle, width: '150px' }}>
                                                                        <span style={{ display: 'block' }}>                                                                    {project.projectName}</span>

                                                                        <span style={{ fontSize: '11px', display: 'block' }}>{getProjectName(project?.projectType)}</span>
                                                                        <span title={project?.note} style={{
                                                                            whiteSpace: 'nowrap',
                                                                            textOverflow: 'ellipsis',
                                                                            wordWrap: 'break-word',
                                                                            overflow: 'hidden',
                                                                            fontSize: '8px',
                                                                            marginTop: '5px',
                                                                            display: 'block',
                                                                        }}>
                                                                            {project?.note}
                                                                        </span>
                                                                    </td>

                                                                    <td style={{ ...tdStyle, width: '100px' }}>
                                                                        &#2547;{member.amountInvested.toLocaleString()}
                                                                    </td>
                                                                    <td style={{ ...tdStyle, width: '80px' }}>
                                                                        &#2547;{member.willGetAmount.toLocaleString()}
                                                                    </td>
                                                                    <td style={{ ...tdStyle, width: '110px' }}>

                                                                        {
                                                                            project.projectType === 'mudaraba' ? <p> &#2547;{member.amountInvested.toLocaleString()} ± {member.willGetAmount.toLocaleString()}</p> : <p> &#2547;{(member.amountInvested + member.willGetAmount).toLocaleString()}</p>
                                                                        }
                                                                    </td>
                                                                    <td style={{ ...tdStyle, width: '160px' }}>
                                                                        {member?.payments ? <div>
                                                                            {member?.payments?.map((p, index) => <div key={index}>
                                                                                <p >{formatDate(p.date)} - &#2547;{p.amount.toLocaleString()}</p>
                                                                            </div>)}
                                                                            {totalPaid > 0 ? <p style={{ paddingTop: '4px', paddingBottom: '4px', fontWeight: 600 }}>মোটঃ <span style={{ fontWeight: 600 }}>&#2547;{totalPaid.toLocaleString()}</span></p> : <p>0</p>
                                                                            }
                                                                        </div> : <p>0</p>}
                                                                    </td>
                                                                    <td style={{ ...tdStyle, width: '100px' }}>
                                                                        {/* &#2547;{member.willGetAmount.toLocaleString()} */}
                                                                        &#2547;{(member.amountInvested + member.willGetAmount - totalPaid).toLocaleString()}
                                                                    </td>
                                                                    <td style={{ ...tdStyle, width: '90px' }}>
                                                                        {member.willGetPercentage}%
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                </table>

                                            </div>



                                        </div>
                                    })}

                                </>
                            )}
                        </div>
                    })}
                    <MemberSummaryFooter totalDepositAmount={totalDepositAmount} permanentMemberCount={permanentMemberCount} tempMemberCount={tempMemberCount} />
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: "20px",
                        gap: "10px",
                    }}
                >
                    <button
                        onClick={handlePrint}
                        style={{
                            padding: "10px 16px",
                            backgroundColor: "#007BFF",
                            color: "#fff",
                            borderRadius: "4px",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: "500",
                        }}
                    >
                        প্রিন্ট করুন
                    </button>
                    <button
                        onClick={onClose}
                        style={{
                            padding: "10px 16px",
                            backgroundColor: "#6c757d",
                            color: "#fff",
                            borderRadius: "4px",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: "500",
                        }}
                    >
                        বাতিল করুন
                    </button>
                </div>

                {/* Hidden iframe for printing */}
                <iframe ref={iframeRef} style={{ display: "none" }} />
            </div>
        </div>
    );
};

export default AllMemberReportModal;
