import formatDate from "@/utils/formatDate.mjs";
import getProjectName from "@/utils/getProjectName.mjs";

const InvestmentTable = ({ projects, showMemberName }) => {
    console.log(projects);
    return (
        <div
            style={{
                backgroundColor: "#f9f9f9",
                borderRadius: "6px",
                padding: "16px",
                marginBottom: "16px",
                border: "1px solid #ddd",
                pageBreakInside: "avoid",
                overflowX: "auto",
            }}
        >

            <table style={{ width: "100%", marginTop: "8px", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ textAlign: "left", borderBottom: "1px solid #D1D5DB", color: "#374151" }}>
                        {[
                            "নাম",
                            "বিনিয়োগ",
                            "লাভ",
                            "মোট পাবেন",
                            "পেয়েছেন",
                            "বাকি আছে",
                            "পার্সেন্টেজ",
                        ].map((header, index) => (
                            <th
                                key={index}
                                style={{
                                    padding: "8px",
                                    minWidth: "130px",
                                    fontWeight: "500",
                                    color: "#374151",
                                }}
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {
                        projects?.map(p => {
                            return p?.members?.map((member) => {
                                const totalPaid = member?.payments
                                    ? member.payments.reduce((acc, currentV) => acc + currentV?.amount, 0)
                                    : 0;

                                return (
                                    <tr
                                        key={member.memberId}
                                        style={{ borderBottom: "1px solid #D1D5DB", color: "#374151" }}
                                    >
                                        <td
                                            style={{
                                                whiteSpace: "nowrap",
                                                textOverflow: "ellipsis",
                                                overflow: "hidden",
                                                maxWidth: "130px",
                                                padding: "8px",
                                                borderRight: "1px solid #D1D5DB",
                                            }}
                                        >
                                            <span>{p.projectName}</span>
                                            <span style={{ fontSize: "12px", display: "block" }}>
                                                {getProjectName(p?.projectType)}
                                            </span>
                                            <span>{member.name}</span>
                                            <span
                                                title={p?.note}
                                                style={{
                                                    whiteSpace: "nowrap",
                                                    textOverflow: "ellipsis",
                                                    overflow: "hidden",
                                                    fontSize: "10px",
                                                    marginTop: "5px",
                                                    display: "block",
                                                    maxWidth: "130px",
                                                }}
                                            >
                                                {p?.note}
                                            </span>
                                        </td>
                                        <td style={{ padding: "8px", borderRight: "1px solid #D1D5DB" }}>
                                            &#2547;{member.amountInvested.toLocaleString()}
                                        </td>
                                        <td style={{ padding: "8px", borderRight: "1px solid #D1D5DB" }}>
                                            &#2547;{member.willGetAmount.toLocaleString()}
                                        </td>
                                        <td style={{ padding: "8px", borderRight: "1px solid #D1D5DB" }}>
                                            {p.projectType === "mudaraba" ? (
                                                <p>
                                                    &#2547;{member.amountInvested.toLocaleString()} ± &#2547;
                                                    {member.willGetAmount.toLocaleString()}
                                                </p>
                                            ) : (
                                                <p>
                                                    &#2547;
                                                    {(member.amountInvested + member.willGetAmount).toLocaleString()}
                                                </p>
                                            )}
                                        </td>
                                        <td style={{ padding: "8px", borderRight: "1px solid #D1D5DB" }}>
                                            {member?.payments ? (
                                                <div>
                                                    {member?.payments.map((p, index) => (
                                                        <div key={index}>
                                                            <p>
                                                                {formatDate(p.date)} - &#2547;{p.amount.toLocaleString()}
                                                            </p>
                                                        </div>
                                                    ))}
                                                    {totalPaid > 0 ? (
                                                        <p style={{ paddingTop: "8px", fontWeight: "600" }}>
                                                            মোটঃ &#2547;{totalPaid.toLocaleString()}
                                                        </p>
                                                    ) : (
                                                        <p>0</p>
                                                    )}
                                                </div>
                                            ) : (
                                                <p>0</p>
                                            )}
                                        </td>
                                        <td style={{ padding: "8px", borderRight: "1px solid #D1D5DB" }}>
                                            &#2547;
                                            {(
                                                member.amountInvested +
                                                member.willGetAmount -
                                                totalPaid
                                            ).toLocaleString()}
                                        </td>
                                        <td style={{ padding: "8px" }}>{member.willGetPercentage}%</td>
                                    </tr>
                                );
                            })

                        })
                    }
                </tbody>
            </table>
        </div>
    );
};

export default InvestmentTable;
