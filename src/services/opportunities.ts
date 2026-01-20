export interface Opportunity {
    id: number | string;
    title: string;
    category: string;
    risk: string;
    expectedReturn: string;
    minInvestment: string;
    status: string;
    daysLeft: number;
}

export const opportunities: Opportunity[] = [
    {
        id: 1,
        title: "Quantum Growth Fund - Series B",
        category: "Financial Technology",
        risk: "Moderate",
        expectedReturn: "12-15%",
        minInvestment: "$50,000",
        status: "Active",
        daysLeft: 14
    },
    {
        id: 2,
        title: "Eco-Energy Infrastructure Project",
        category: "Real Estate / ESG",
        risk: "Low",
        expectedReturn: "8-10%",
        minInvestment: "$25,000",
        status: "Closing Soon",
        daysLeft: 3
    },
    {
        id: 3,
        title: "AI Logistics Optimization",
        category: "Automation / Software",
        risk: "High",
        expectedReturn: "22-28%",
        minInvestment: "$100,000",
        status: "Active",
        daysLeft: 21
    },
    {
        id: 4,
        title: "Strategic Land Acquisition - Berlin",
        category: "Real Estate",
        risk: "Low",
        expectedReturn: "9%",
        minInvestment: "$75,000",
        status: "Under Review",
        daysLeft: 0
    }
];
