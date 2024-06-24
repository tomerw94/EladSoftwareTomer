using tomerExam.Models;

namespace tomerExam.Interfaces
{
    public interface IInsurancePolicyService
    {
        Task<IList<InsurancePolicy>> GetAllInsurancePolicies();
        Task<IList<InsurancePolicy>> GetInsurancePoliciesByUserId(int userId);

        Task<InsurancePolicy> GetInsurancePolicyById(int id);

        Task<InsurancePolicy> AddInsurancePolicy(InsurancePolicy insurancePolicy);

        Task<InsurancePolicy> UpdateInsurancePolicy(InsurancePolicy insurancePolicy);

        Task<InsurancePolicy> DeleteInsurancePolicyById(int id);
    }
}
