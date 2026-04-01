export type TDashboardCards = {
    sales: {
        totalMonth: number;
        countMonth: number;
        growthPercent: number;
        openOrders: number;
    };
    stock: {
        totalValue: number;
        totalItems: number;
    };
    customers: {
        countMonth: number;
        growthPercent: number;
    };
    accountsReceivable: {
        openAmount: number;
        openCount: number;
        overdueAmount: number;
        overdueCount: number;
        totalAmount: number;
        totalCount: number;
    };
    accountsPayable: {
        openAmount: number;
        openCount: number;
        overdueAmount: number;
        overdueCount: number;
        totalAmount: number;
        totalCount: number;
    };
};

export type TDashboardMonthlySales = {
    totals: number[];
    counts: number[];
};

export type TDashboardMonthlyTarget = {
    currentMonth: number;
    previousMonth: number;
    today: number;
    growthPercent: number;
};

export type TDashboardRecentOrder = {
    id: string;
    code: string;
    customerName: string;
    sellerName: string;
    total: number;
    status: string;
    createdAt: string;
};