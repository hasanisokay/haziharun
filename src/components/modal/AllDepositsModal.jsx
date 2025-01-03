import formatDate from "@/utils/formatDate.mjs";
import { useRef } from "react";
import Print from "../svg/Print";
import convertToBanglaNumber from "@/utils/convertToBanglaNumber.mjs";
import ExcelJS from 'exceljs';
import jsToExcelDate from "@/utils/jsToExcelDate.mjs";
const AllDepositsModal = ({ deposits, onClose }) => {
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
    const totalDepositAmount = deposits.reduce((acc, deposit) => acc + deposit.amount, 0);

    async function saveDataToExcel(data) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Deposits");
      
        // Add headers
        worksheet.columns = [
          { header: "ID", key: "_id", width: 30 },
          { header: "Member ID", key: "memberId", width: 20 },
          { header: "Name", key: "name", width: 30 },
          { header: "Amount", key: "amount", width: 15 },
          { header: "Deposit Date", key: "depositDate", width: 25 },
          { header: "Added On", key: "addedOn", width: 25 },
        ];
      
        // Add rows to the worksheet
        data.forEach((item) => {
          worksheet.addRow({
            _id: item._id,
            memberId: item.member.memberId,
            name: item.member.name,
            amount: item.amount,
            depositDate: jsToExcelDate(item.depositDate),
            addedOn: jsToExcelDate(item.addedOn),
          });
        });
      
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `DepositReport_${jsToExcelDate(new Date())}.xlsx`;
        link.click();
      }
    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 50,
            }}>
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
                }}>
                <div className="flex justify-between items-center flex-wrap">
                    <button
                        onClick={handlePrint}
                        className="flex gap-2"
                    >
                        প্রিন্ট করুন <Print />
                    </button>
                    <button
                            onClick={()=>saveDataToExcel(deposits)}
                            className="p-2 flex items-center gap-2"
                        >
                            এক্সেল ডাউনলোড
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
                <div id="printable-content" style={{ marginTop: '16px' }}>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">আমানত রিপোর্ট</h3>
                    {deposits?.map((deposit, index) => (
                        <div key={deposit._id} style={{
                            backgroundColor: '#ffffff',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                            borderRadius: '0.5rem',
                            padding: '16px',
                            marginTop: index !== 0 ? '16px' : '0', // Equivalent of space-y-4
                        }}>
                            <span style={{ fontSize: '14px', color: '#374151', textAlign: 'left', display: 'block' }}>ক্রমিক নং- {convertToBanglaNumber(index + 1)}</span>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{
                                        fontSize: '1.125rem',
                                        fontWeight: '600',
                                        color: '#2D3748'
                                    }}>
                                        {deposit.member.name}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{
                                        fontSize: '1.25rem',
                                        fontWeight: '500',
                                        color: '#38A169',
                                        marginBottom: '4px'
                                    }}>
                                        &#2547; {deposit.amount.toFixed(2)}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#A0AEC0', marginBottom: '4px' }}>
                                        আমানতের তারিখঃ {formatDate(deposit.depositDate)}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#A0AEC0' }}>
                                        হিসাব উঠানো হয়েছেঃ {formatDate(deposit.addedOn)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div style={{ backgroundColor: '#FFFFFF', boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)', borderRadius: '0.5rem', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
                        <div>
                            <div style={{ color: '#6B7280' }}>মোট আমানত</div>
                            <div style={{ fontSize: '1.25rem', color: '#38A169', fontWeight: '600' }}>{totalDepositAmount} টাকা</div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex justify-center items-center gap-8 text-center">
                    <button
                        onClick={handlePrint}
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg">
                        প্রিন্ট করুন
                    </button>
                    <button
                        onClick={onClose}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600">
                        বাতিল করুন
                    </button>
                </div>
                <iframe
                    ref={iframeRef}
                    style={{ display: "none" }}
                    title="Print Deposits"
                />
            </div>
        </div>
    );
};

export default AllDepositsModal;
