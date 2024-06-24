using tomerExam.Models;

namespace tomerExam.Interfaces
{
    public interface IInsurancePolicyQueries
    {
        Task<IList<InsurancePolicy>> GetAllInsurancePolicy();
        Task<IList<InsurancePolicy>> GetInsurancePolicyByUserId(int userId);

        Task<InsurancePolicy> GetInsurancePolicyById(int id);

        Task<InsurancePolicy> AddInsurancePolicy(InsurancePolicy insurancePolicy);

        Task<InsurancePolicy> UpdateInsurancePolicy(InsurancePolicy insurancePolicy);

        Task<InsurancePolicy> DeleteInsurancePolicyById(int id);
    }
}
