import api from './api';

export const integrationService = {
  // Swathi's court booking member verification
  verifyMemberForCourtBooking: async (identifier) => {
    const res = await api.get(`/integration/members/verify/${identifier}`);
    return res.data;
  },

  // Balaji's shop/cafe discount check
  getMemberDiscounts: async (memberId) => {
    const res = await api.get(`/integration/members/discount-eligibility/${memberId}`);
    return res.data;
  },

  // Anish's club financial & analytics summary
  getClubSummary: async () => {
    const res = await api.get('/integration/analytics/club-summary');
    return res.data;
  },

  // Anish's membership transactions ledger
  getMembershipTransactions: async (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const res = await api.get(`/integration/finance/membership-transactions?${params.toString()}`);
    return res.data;
  },

  // Anish's salary expenses
  getSalaryExpenses: async (month, year) => {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    const res = await api.get(`/integration/finance/salary-expenses?${params.toString()}`);
    return res.data;
  },
};
