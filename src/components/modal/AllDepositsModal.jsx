import formatDate from "@/utils/formatDate.mjs";
import { useRef } from "react";
import Print from "../svg/Print";

const AllDepositsModal = ({ deposits, onClose }) => {
    const iframeRef = useRef(null);
    const handlePrint = () => {
        const printContent = iframeRef.current.contentDocument;
        printContent.body.innerHTML = document.getElementById("printable-content").innerHTML;
        iframeRef.current.contentWindow.print();
    };

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
                <div className="flex justify-between items-center">
                    <button
                        onClick={handlePrint}
                        className="flex gap-2"
                    >
                        প্রিন্ট করুন <Print />
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
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: index !== 0 ? '16px' : '0', // Equivalent of space-y-4
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
                    ))}
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
