using tomerExam.Interfaces;
using tomerExam.Models;
using tomerExam.Queries;

namespace tomerExam.Services
{
    public class InsurancePolicyService : IInsurancePolicyService
    {
        private readonly ILogger<InsurancePolicyService> _logger;
        private readonly IInsurancePolicyQueries _insurancePolicyQueries;

        public InsurancePolicyService(ILogger<InsurancePolicyService> logger, IInsurancePolicyQueries insurancePolicyQueries)
        {
            _logger = logger;
            _insurancePolicyQueries = insurancePolicyQueries;
        }
        public async Task<InsurancePolicy> AddInsurancePolicy(InsurancePolicy insurancePolicy)
        {
            _logger.LogInformation($"AddInsurancePolicy - Enter");
            var retValue = await _insurancePolicyQueries.AddInsurancePolicy(insurancePolicy);
            _logger.LogInformation($"AddInsurancePolicy - Exit");
            return retValue;
        }

        public async Task<InsurancePolicy> DeleteInsurancePolicyById(int id)
        {
            _logger.LogInformation($"DeleteInsurancePolicyById - Enter");
            var retValue = await _insurancePolicyQueries.DeleteInsurancePolicyById(id);
            _logger.LogInformation($"DeleteInsurancePolicyById - Exit");
            return retValue;
        }

        public async Task<IList<InsurancePolicy>> GetAllInsurancePolicies()
        {
            _logger.LogInformation($"GetAllInsurancePolicies - Enter");
            var retValue = await _insurancePolicyQueries.GetAllInsurancePolicy();
            _logger.LogInformation($"GetAllInsurancePolicies - Exit");
            return retValue;
        }

        public async Task<IList<InsurancePolicy>> GetInsurancePoliciesByUserId(int userId)
        {
            _logger.LogInformation($"GetInsurancePoliciesByUserId - Enter");
            var retValue = await _insurancePolicyQueries.GetInsurancePolicyByUserId(userId);
            _logger.LogInformation($"GetInsurancePoliciesByUserId - Exit");
            return retValue;
        }

        public async Task<InsurancePolicy> GetInsurancePolicyById(int id)
        {
            _logger.LogInformation($"GetInsurancePolicyById - Enter");
            var retValue = await _insurancePolicyQueries.GetInsurancePolicyById(id);
            _logger.LogInformation($"GetInsurancePolicyById - Exit");
            return retValue;
        }

        public async Task<InsurancePolicy> UpdateInsurancePolicy(InsurancePolicy insurancePolicy)
        {
            _logger.LogInformation($"UpdateInsurancePolicy - Enter");
            var retValue = await _insurancePolicyQueries.UpdateInsurancePolicy(insurancePolicy);
            _logger.LogInformation($"UpdateInsurancePolicy - Exit");
            return retValue;
        }
    }
}
